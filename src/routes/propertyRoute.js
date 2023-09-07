const express = require("express");
const {
  addProperty,
  getAllProperties,
} = require("../controllers/propertyController");
const router = express.Router();

router.post("/add-property", addProperty);
router.get("/getAllProperties", getAllProperties);

module.exports = router;
