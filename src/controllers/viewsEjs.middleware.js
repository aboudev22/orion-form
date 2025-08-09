const express = require("express");

const router = express.Router();

router.get("/", (req, res)=> {
  res.render("index", {
    title: "page d'acceuil",
    user: {name: "Aboubakar", isAdmin: true},
    items: ["Node.js", "Express", "EJS"]
  });
});

module.exports = router;