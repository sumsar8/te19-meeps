var express = require("express");
const multer = require('multer')
var router = express.Router();
const pool = require("../database");


const upload = multer({
  dest: "images/profiles/"
});

router.get("/", async (req, res) => {

  await pool
    .promise()
    .query("SELECT * FROM rasobg_users")
    .then((response) => {
      req.session.img = "/images/profiles/" + response[0][0].imgpath;
      res.render("profile.njk", {
        title: "Profile",
        img: req.session.img,
        layout: "layout.njk"
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        register: {
          error: "Error loading profile"
        }
      });
    });
});

router.post("/", async (req, res) => {
  const path = req.body.img;
  const userid = req.session.userid;
  console.log(path, " + ", userid)
  await pool
    .promise()
    .query("UPDATE rasobg_users SET imgpath = ? WHERE user_id = ?", [path, userid])

    .then((response) => {

    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Login: {
          error: "Error pushing path to server"
        }
      });
    });
});

module.exports = router;
