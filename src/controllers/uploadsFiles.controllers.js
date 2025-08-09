const { ValidationError } = require("../Errors/appErros");
const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();

const items = [
  { type: "image/jpeg", ext: "jpeg" },
  { type: "image/png", ext: "png" },
  { type: "image/gif", ext: "gif" },
  { type: "image/bmp", ext: "bmp" },
  { type: "image/webp", ext: "webp" },
  { type: "image/tiff", ext: "tiff" },
  { type: "image/x-icon", ext: "ico" },
  { type: "image/heic,", ext: "heic" },
  { type: "image/webp", ext: "webp" },
  { type: "image/heif", ext: "heif" },
  { type: "image/svg+xml", ext: "svg" },
  { type: "application/postscript", ext: "eps" },
];

const extension = (mimetype) => {
  for (let i = 0; i < items.length; i++) {
    if (mimetype === items[i].type) {
      return items[i].ext;
    }
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "..", "uploads", "/")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(
      null,
      Date.now() + name.replace(/\s+/g, "-") + "." + extension(file.mimetype)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = Array.from({ length: items.length }, (_, i) => items[i].type);
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError("Seules les images sont autorisees"));
  }
};

const fileFilters = (req, file, cb) => {
  const allowed = Array.from({ length: items.length }, (_, i) => items[i].type);
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError("Type fichier pas pris en compte"));
  }
};

const upload = multer({ storage, fileFilter, limits: 1024 * 1024 * 10 });

router.post("/", upload.single("avatar"), (req, res, next) => {
  console.log(req.file);
  res.send("fichier recus");
});

module.exports = router;
