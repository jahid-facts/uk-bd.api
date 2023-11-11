const Student = require("../models/studentModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/images/"); // Specify the directory to save uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

exports.studentAddController = async (req, res) => {
  try {
    // Execute the multer middleware for handling file uploads
    upload.array("images", 5)(req, res, async (err) => {
      if (err) {
        throw new Error("Multer Error: " + err.message);
      }

      // console.log(req.body); // Check if the form data is correctly parsed
      // console.log(req.files); // Check if the files are correctly uploaded

      // Get the uploaded images and store them in an array
      const images = req.files.map((file) => `assets/images/${file.filename}`);
 
      const { name, age, city } = req.body;

      // Create a new student document
      const newStudent = {
        name,
        age,
        city,
        images,
      };

      // Save the student document to the database
      await Student.create(newStudent);

      res.status(200).json({
        message: "Student added successfully",
      });
    });
  } catch (err) {
    console.error(err.message);

    // Additional logging for debugging
    console.error("Request Body:", req.body);
    console.error("Request Files:", req.files);

    res.status(500).json({
      error: err.message,
    });
  }
};

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

// exports.studentAddController = async (req, res, next) => {
//   try {
//     const files = req.files; // Access uploaded files
//     const images = files.map(file => `/Images/${file.filename}`); // Assuming you want to store file paths

//     // Create a new student document
//     // const studentInfo = {
//     //   name: req.body.name,
//     //   age: req.body.age,
//     //   images: images,
//     // };

//     // // Save the student document to the database
//     // await Student.create(studentInfo);

//     console.log(req.body);
//     res.status(200).json({
//       message: "Student added successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

/// delete stuent use body.prams

exports.studentDeleteController = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    // Retrieve the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete each image associated with the student
    if (student.images && student.images.length > 0) {
      student.images.forEach((imageName) => {
        const imagePath = path.join(imageName);
        console.log('imagePath', imagePath)
        // Check if the file exists before attempting to delete
        if (fs.existsSync(imagePath)) {
          console.log('existsSync', imagePath)
          fs.unlinkSync(imagePath);
        }
      });
    }

    // Delete the student record from the database
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
