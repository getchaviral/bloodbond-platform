const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");
const Donor = require("../models/Donor");
const auth = require("../middleware/authMiddleware");
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Create request
router.post("/request", auth("user"), async (req, res) => {
  try {
    const { bloodGroup, units } = req.body;
    const unitsNumber = Number(units);

    if (!BLOOD_GROUPS.includes(bloodGroup)) {
      return res.status(400).json({ message: "Invalid blood group" });
    }
    if (!Number.isInteger(unitsNumber) || unitsNumber <= 0) {
      return res.status(400).json({ message: "Units must be a positive integer" });
    }

    const request = await BloodRequest.create({
      user: req.user.id,
      bloodGroup,
      units: unitsNumber,
    });

    return res.json(request);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// View own requests
router.get("/requests", auth("user"), async (req, res) => {
  try {
    const requests = await BloodRequest.find({ user: req.user.id });
    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/donate", auth("user"), async (req, res) => {
  try {
    const { name, age, bloodGroup, city } = req.body;
    const ageNumber = Number(age);

    if (!name || !city || !BLOOD_GROUPS.includes(bloodGroup)) {
      return res.status(400).json({ message: "Invalid donor details" });
    }
    if (!Number.isInteger(ageNumber) || ageNumber < 18 || ageNumber > 65) {
      return res.status(400).json({ message: "Age must be between 18 and 65" });
    }

    const donor = await Donor.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          name: String(name).trim(),
          age: ageNumber,
          bloodGroup,
          city: String(city).trim(),
          lastDonationDate: new Date(),
        },
        $setOnInsert: { donations: 0, user: req.user.id },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json({
      message: "Donor profile saved successfully",
      donor,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
