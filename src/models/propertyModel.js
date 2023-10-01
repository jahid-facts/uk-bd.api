const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    description: String,
    placeDescribesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenities",
    },
    typeOfPlaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TypeOfPlace",
    },
    located: Object,
    address: Object,
    guests: Object,
    amenitiesIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenities",
      },
    ],
    images: [
      {
        name: String,
        url: String,
      },
    ],
    decideReservations: String,
    price: String,
    discounts: Object,
    status: {
      type: String,
      default: "In progress",
    },
  },
  {
    timestamps: true,
  }
);

const PropertyModel = mongoose.model("AllProperty", propertySchema);

module.exports = PropertyModel;
