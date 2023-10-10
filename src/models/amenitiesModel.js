const mongoose = require("mongoose");

const amenitiesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Amenities = mongoose.model("Amenities", amenitiesSchema);

module.exports = Amenities;
