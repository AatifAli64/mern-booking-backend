import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Images will be saved in 'backend/uploads'
  },
  filename(req, file, cb) {
    // Naming file: image-DATE-EXTENSION
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Check file type (Allow only images)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;