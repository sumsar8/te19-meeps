var express = require("express");
var router = express.Router();
const pool = require("../database");


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
router.post("/", async (req, res, next) => {
    const path = req.body.img;
    const userid = req.session.userid;

    console.log(path);
    await pool
        .promise()
        .query("UPDATE rasobg_users SET imgpath = ? WHERE user_id = ?", [path,userid])

        .then((response) => {

            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    Login: {
                        error: "Error logging in"
                    }
                });
            });
        });

module.exports = router;
