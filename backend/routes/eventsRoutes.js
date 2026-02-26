const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const auth = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1, createdAt: -1 });
    return res.json(events);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth("admin"), async (req, res) => {
  try {
    const { title, date, location, city, organizer, description, donorsExpected, timing } =
      req.body;

    if (!title || !date || !location || !city || !organizer) {
      return res
        .status(400)
        .json({ message: "title, date, location, city and organizer are required" });
    }

    const event = await Event.create({
      title,
      date,
      location,
      city,
      organizer,
      description: description || "",
      donorsExpected: Number(donorsExpected) || 0,
      timing: timing || "",
    });

    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", auth("admin"), async (req, res) => {
  try {
    const update = req.body;
    if (Object.prototype.hasOwnProperty.call(update, "donorsExpected")) {
      update.donorsExpected = Number(update.donorsExpected) || 0;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json(event);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth("admin"), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json({ message: "Event deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
