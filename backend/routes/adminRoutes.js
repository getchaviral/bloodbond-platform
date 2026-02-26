const express = require("express");
const router = express.Router();
const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");
const BloodStock = require("../models/BloodStock");
const Donor = require("../models/Donor");
const auth = require("../middleware/authMiddleware");

router.get("/users", auth("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/stats", auth("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await Donor.countDocuments();
    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({
      status: "pending",
    });
    const fulfilledRequests = await BloodRequest.countDocuments({
      status: "fulfilled",
    });

    const stock = await BloodStock.find();
    const totalUnits = stock.reduce((sum, item) => sum + item.units, 0);
    const stockByGroup = stock.reduce((acc, item) => {
      acc[item.bloodGroup] = item.units;
      return acc;
    }, {});

    return res.json({
      totalUsers,
      totalDonors,
      totalRequests,
      pendingRequests,
      fulfilledRequests,
      totalUnits,
      stockByGroup,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/donors", auth("admin"), async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    return res.json(donors);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/requests", auth("admin"), async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: "pending" });
    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/approve/:id", auth("admin"), async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res
        .status(409)
        .json({ message: `Cannot approve request in ${request.status} state` });
    }

    request.status = "approved";
    await request.save();
    return res.json({ message: "Approved" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/reject/:id", auth("admin"), async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res
        .status(409)
        .json({ message: `Cannot reject request in ${request.status} state` });
    }

    request.status = "rejected";
    await request.save();
    return res.json({ message: "Rejected" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
