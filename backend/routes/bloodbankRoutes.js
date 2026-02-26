const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const BloodStock = require("../models/BloodStock");
const BloodRequest = require("../models/BloodRequest");
const BloodBank = require("../models/BloodBank");
const auth = require("../middleware/authMiddleware");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

async function getBloodBankForUser(userId) {
  return BloodBank.findOne({ user: userId });
}

router.get("/profile", auth("bloodbank"), async (req, res) => {
  try {
    const profile = await getBloodBankForUser(req.user.id);
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", auth("bloodbank"), async (req, res) => {
  try {
    const { name, state, district, city, address, phone } = req.body;

    if (!name || !state || !district || !city) {
      return res
        .status(400)
        .json({ message: "name, state, district and city are required" });
    }

    const profile = await BloodBank.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          name: String(name).trim(),
          state: String(state).trim(),
          district: String(district).trim(),
          city: String(city).trim(),
          address: String(address || "").trim(),
          phone: String(phone || "").trim(),
        },
        $setOnInsert: { user: req.user.id },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/stock", auth("bloodbank"), async (req, res) => {
  try {
    const { bloodGroup, units } = req.body;
    const unitsNumber = Number(units);

    if (!BLOOD_GROUPS.includes(bloodGroup)) {
      return res.status(400).json({ message: "Invalid blood group" });
    }
    if (!Number.isInteger(unitsNumber) || unitsNumber <= 0) {
      return res.status(400).json({ message: "Units must be a positive integer" });
    }

    const bloodBank = await getBloodBankForUser(req.user.id);
    if (!bloodBank) {
      return res.status(400).json({
        message: "Complete blood bank profile first",
      });
    }

    const stock = await BloodStock.findOneAndUpdate(
      { bloodBank: bloodBank._id, bloodGroup },
      {
        $inc: { units: unitsNumber },
        $set: { updatedBy: req.user.id },
        $setOnInsert: { bloodBank: bloodBank._id, bloodGroup },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.json(stock);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/stock", auth(), async (req, res) => {
  try {
    if (req.user.role === "bloodbank") {
      const bloodBank = await getBloodBankForUser(req.user.id);
      if (!bloodBank) return res.json([]);

      const stock = await BloodStock.find({ bloodBank: bloodBank._id }).sort({
        bloodGroup: 1,
      });
      return res.json(stock);
    }

    const stock = await BloodStock.find().sort({ bloodGroup: 1 });
    return res.json(stock);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/requests", auth("bloodbank"), async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/fulfill/:id", auth("bloodbank"), async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const bloodBank = await getBloodBankForUser(req.user.id);
    if (!bloodBank) {
      return res.status(400).json({
        message: "Complete blood bank profile first",
      });
    }

    await session.withTransaction(async () => {
      const request = await BloodRequest.findById(req.params.id).session(session);
      if (!request) {
        const error = new Error("Request not found");
        error.status = 404;
        throw error;
      }
      if (request.status !== "approved") {
        const error = new Error(
          `Cannot fulfill request in ${request.status} state`
        );
        error.status = 409;
        throw error;
      }

      const stock = await BloodStock.findOneAndUpdate(
        {
          bloodBank: bloodBank._id,
          bloodGroup: request.bloodGroup,
          units: { $gte: request.units },
        },
        {
          $inc: { units: -request.units },
          $set: { updatedBy: req.user.id },
        },
        { new: true, session }
      );

      if (!stock) {
        const error = new Error("Insufficient stock");
        error.status = 400;
        throw error;
      }

      request.status = "fulfilled";
      await request.save({ session });
    });

    return res.json({ message: "Request fulfilled successfully" });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  } finally {
    await session.endSession();
  }
});

module.exports = router;
