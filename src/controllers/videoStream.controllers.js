const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const videoPath = path.join(__dirname, "babi.mp4");
  const videoSize = fs.statSync(videoPath).size;
  
  const range = req.headers.range ?? "bytes=0-";
  if (!range) {
    return res.status(416).send("Range header required");
  }

  const CHUNK_SIZE = 10 ** 6; // 1 MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;

  res.status(206).set({
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  });

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

module.exports = router;
