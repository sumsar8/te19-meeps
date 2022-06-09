var express = require("express");
var router = express.Router();
const pool = require("../database");
var fileUpload = require("express-fileupload")


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

/*router.post("/upload", async (req, res) => {
  const path = "/images/profiles/" + req.body.img;
  const file = req.files.myFile;

  const userid = req.session.userid;
  const pathfile = "/images/profiles/" + file.name;


  await pool
    .promise()
    .query("UPDATE rasobg_users SET imgpath = ? WHERE user_id = ?", [path, userid])
    .then((res) => {
      file.mv(path, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.send({ status: "success", path: pathfile });
      });
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
*/
router.post('/upload', async function (req, res) {
  let profilepic;
  let uploadPath;
  let userid = req.session.user_id;
  let path = req.files.profilepic.name;
  let pathname = "/images/profiles/" + path;
  await pool
    .promise()
    .query("UPDATE rasobg_users SET imgpath = ? WHERE user_id = ?", [pathname, userid])
    .then((response) => {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }

      // The name of the input field (i.e. "profilepic") is used to retrieve the uploaded file
      profilepic = req.files.profilepic;
      uploadPath = '/home/sumsar8/webservercode/te19-meeps/public/images/profiles/' + profilepic.name;

      // Use the mv() method to place the file somewhere on your server
      profilepic.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        } else {
          res.redirect("/profile");
        }
      });
    });
});


module.exports = router;
