var express = require("express");
var router = express.Router();
const pool = require("../database");

router.get("/", async (req, res, next) => {
    await pool
        .promise()
        .query("SELECT * FROM meeps")
        .then(() => {
            res.render("login.njk", {
                title: "Login",
                layout: "layout.njk"
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                register: {
                    error: "Error logging in"
                }
            });
        });
});
router.get("/", async (req, res, next) => {
    await pool
        .promise()
        .query("SELECT * FROM meeps")
        .then(([rows, fields]) => {
            res.render("meeps.njk", {
                meeps: rows,
                title: "Meeps",
                layout: "layout.njk"
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                meeps: {
                    error: "Error getting meeps"
                }
            });
        });
});
router.post("/", async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    await pool
        .promise()
        .query("SELECT * FROM users WHERE (username) = (?)", [username])
        .then((response) => {
            if(response[0][0].password == password){
                req.session.username = username;
                //console.log("ASDASDASDASDSD " + response[0][0].id)
                //req.session.userid = rows[0].id;
                res.redirect("/meeps");
            }else{
                res.json("Wrong Password")
            }
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
