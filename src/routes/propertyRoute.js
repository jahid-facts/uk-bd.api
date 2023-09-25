const express = require("express");
const {
  addProperty,
  getAllProperties,
  getUserProperties,
  getProperty,
  deleteProperty,
  updateProperty,
} = require("../controllers/propertyController");
const router = express.Router();

router.post("/add-property", addProperty);
router.get("/getAllProperties", getAllProperties);
router.get("/user/properties/:id", getUserProperties);
router.get("/edit/property/:id", getProperty);
// Route for updating a property by ID
router.put('/properties/:id', updateProperty);
// Route for deleting a property by ID
router.delete('/properties/:id', deleteProperty);
 
module.exports = router;
