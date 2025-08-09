require("dotenv").config();

const video = require("./controllers/videoStream.controllers");
const fileUpload = require("./controllers/uploadsFiles.controllers");
const engine = require("./controllers/viewsEjs.middleware");
const { ValidationError, NotFoundError } = require("./Errors/appErros");
const session = require("express-session");
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: ["http://localhost:8000", "http://mondomaine.com"],
  method: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
const streamLogAccess = fs.createWriteStream(
  path.join(__dirname, "logs", "accessLogs.log"),
  { flags: "a" }
);

app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("combined", { stream: streamLogAccess }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30,
      httpOnly: true,
      secure: false,
    },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use("/ejs", engine);

app.get("/", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  res.sendFile(path.join(__dirname, "..", "public", "login.html"), (err) => {
    if (err) {
      return next(new NotFoundError("Login page not found"));
    }
  });
});

app.get("/upload", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "public", "upload.html"), (err) => {
    if (err) {
      return next(new NotFoundError("Page uplods indisponible"));
    }
  });
});

app.use("/upload", fileUpload);
app.use("/video", video);

app.get("/helmet", (req, res) => {
  res.json({ test: "helmet" });
});

app.post("/", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new ValidationError("Email and password required"));
  }
  req.session.user = { id: 1 };
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "..", "public", "home.html"));
});

app.use((err, req, res, next) => {
  if (req.headersSent) {
    return next(err);
  }
  if (err.name === ValidationError || err.name === NotFoundError) {
    return res.status(err.statusCode).send(err.message);
  }
  console.log(err);
  res.status(500).send("Internal server error");
});

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});