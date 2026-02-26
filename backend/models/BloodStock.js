const mongoose = require("mongoose");

const bloodStockSchema = new mongoose.Schema({
  bloodBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodBank",
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  units: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

bloodStockSchema.index({ bloodBank: 1, bloodGroup: 1 }, { unique: true });

module.exports = mongoose.model("BloodStock", bloodStockSchema);
