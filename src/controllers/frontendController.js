const Amenities = require("../models/amenitiesModel");
const TypeOfPlace = require("../models/typeOfPlaceModel");
const { resReturn } = require("../utils/responseHelpers");

// get all amenites
exports.amenities = async (req, res, next) => {
  try {
    const amenities = await Amenities.find();
    return resReturn(res, 200, { amenities }); 
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    }); 
  }
};

// get all typeOfPlace 
exports.typeOfPlace = async (req, res, next) => {
  try {
    const typeOfPlace = await TypeOfPlace.find();
    return resReturn(res, 200, { typeOfPlace });
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    });
  }
};
