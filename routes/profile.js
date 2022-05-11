var express = require("express");
const multer  = require('multer')
var router = express.Router();
const pool = require("../database");

const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

const upload = multer({
    dest: "images/profiles/"
  });

router.get("/", async (req, res, next) => {
    await pool
        .promise()
        .query("SELECT * FROM rasobg_meeps")
        .then(() => {
            res.render("profile.njk", {
                title: "Profile",
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
    /*app.post(
        "/upload",
        //upload.single("file" name attribute of <file> element in your form ),
        (req, res) => {
          const tempPath = req.file.path;
          const targetPath = path.join(__dirname, "./uploads/image.png");
      
          if (path.extname(req.file.originalname).toLowerCase() === ".png") {
            fs.rename(tempPath, targetPath, err => {
              if (err) return handleError(err, res);
      
              res
                .status(200)
                .contentType("text/plain")
                .end("File uploaded!");
            });
          } else {
            fs.unlink(tempPath, err => {
              if (err) return handleError(err, res);
      
              res
                .status(403)
                .contentType("text/plain")
                .end("Only .png files are allowed!");
            });
          }
        }
      );*/
router.post("/", async (req, res) => {
    const path = req.body.img;
    const userid = req.session.userid;
    console.log(path, " + ", userid)
    await pool
        .promise()
        .query("UPDATE rasobg_users SET imgpath = ? WHERE user_id = ?", [path,userid])

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
