const Student = require("../models/studentModel");

exports.studentController = async (req, res, next) => {
  try {
    const response = await Student.find();
    res.status(200).json({
      students: response,
      message: "Student find successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

// student name, age and city add in database

exports.studentAddController = async (req, res, next) => {
  try {
    const studentInfo = {
      name: req.body.name,
      age: req.body.age,
      city: req.body.city,
    };
    await Student.create(studentInfo);
    res.status(200).json({
      message: "Student add successfully",
    });
  } catch (err) { 
    res.status(500).json({
      error: err.message,
    });
  }
};

/// delete stuent use body.prams

exports.studentDeleteController = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    await Student.findByIdAndDelete(studentId);
    res.status(200).json({
      message: "Student delete successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// student find by id from req.params

exports.studentEditController = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    await Student.findById(studentId).then((response) => {
      res.status(200).json({
        student: response,
        message: "Student update successfully",
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// student Upadate Controller
exports.studentUpdateController = async (req, res, next) => {
  try {
    const studentId = req.body.id;
    const studentInfo = {
      name: req.body.name,
      age: req.body.age,
      city: req.body.city,
    };
    await Student.findByIdAndUpdate(studentId, studentInfo);
    res.status(200).json({
      message: "Student update successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
