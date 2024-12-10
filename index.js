const express = require("express");
const status = require("express-status-monitor");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const aws = require("aws-sdk");

const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const app = express();
const PORT = 8001;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(status());
app.use(express.urlencoded({ extended: false }));

app.post("/upload", upload.single("profileImage"), (req, res) => {
  if (!req.file) return res.render("/");
  console.log(req.file);
  const file = req.file;
  const key = "uploads/" + Date.now() + "-" + file.originalname;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: fs.createReadStream(file.path),
    ContentType: file.mimetype,
  };

  s3.upload(params, (error, response) => {
    if (error) return res.send(error);
    return res.send(response);
  }).on("httpUploadProgress", (progress) => {
    console.log(`Progress: ${progress.loaded} / ${progress.total}`);
  });
});

app.get("/", (req, res) => {
  return res.render("home");
});

app.listen(PORT, () => {
  return console.log(`Server running at http://localhost:${PORT}`);
});
