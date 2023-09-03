const express = require("express");
const { amenities, typeOfPlace } = require("../controllers/frontendController");
const router = express.Router();

router.get("/amenities", amenities);
router.get("/typeOfPlace", typeOfPlace);

module.exports = router;
