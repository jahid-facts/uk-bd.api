const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: String,
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;


