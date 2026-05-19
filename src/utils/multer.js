// This file sets up multer for handling file uploads, specifically for product images. It defines a storage strategy that saves files to the "uploads/" directory with a unique filename. It also includes a file filter to ensure only certain image types are accepted and limits the file size to 5MB.
const multer = require("multer");
const path = require("path");

// Define where and how files are saved
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists!
  },
  filename: function (req, file, cb) {
    // Creates a unique name: timestamp + original extension
    const uniqueSuffix =
      "Product" + Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cb) => {
      if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG, PNG, and GIF allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Changed from fieldSize to fileSize for the actual file
  },
  fileFilter: fileFilter,
});

module.exports = { upload };

// This code sets up multer to handle file uploads, specifically for product images. It defines a storage strategy that saves files to the "uploads/" directory with a unique filename. It also includes a file filter to ensure only certain image types are accepted and limits the file size to 5MB.

// const multer = require("multer");
// const storage = multer.memoryStorage();

// // 1. File Type Validation
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/gif"
//   ) {
//     cb(null, true); // Accept
//   } else {
//     cb(new Error("Invalid file type, only JPEG and PNG allowed!"), false); // Reject
//   }
// };

// const upload = multer({
//   storage,
//   //   5mb file size
//   limits: { fieldSize: 5 * 1024 * 1024 },
//   fileFilter: fileFilter,
// });

// module.exports = { upload };