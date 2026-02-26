const express = require("express");
const router = express.Router();
const BloodStock = require("../models/BloodStock");

router.get("/blood-stock", async (req, res) => {
  try {
    const { bloodGroup, state, district } = req.query;

    const pipeline = [
      { $match: { units: { $gt: 0 } } },
      {
        $lookup: {
          from: "bloodbanks",
          localField: "bloodBank",
          foreignField: "_id",
          as: "bank",
        },
      },
      { $unwind: "$bank" },
      { $match: { "bank.isActive": true } },
    ];

    if (bloodGroup) {
      pipeline.push({ $match: { bloodGroup } });
    }
    if (state) {
      pipeline.push({ $match: { "bank.state": state } });
    }
    if (district) {
      pipeline.push({ $match: { "bank.district": district } });
    }

    pipeline.push({
      $project: {
        _id: 1,
        bloodGroup: 1,
        units: 1,
        bloodBankId: "$bank._id",
        bankName: "$bank.name",
        state: "$bank.state",
        district: "$bank.district",
        city: "$bank.city",
      },
    });

    pipeline.push({ $sort: { units: -1 } });

    const stock = await BloodStock.aggregate(pipeline);
    return res.json(stock);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
