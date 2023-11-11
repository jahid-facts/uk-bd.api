const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: String,
  images: {
    type: [String],
    default: [],
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
