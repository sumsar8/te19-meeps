var express = require("express");
var router = express.Router();
const pool = require("../database");
const bcrypt = require('bcrypt');

router.get("/", async (req, res, next) => {
    await pool
        .promise()
        .query("SELECT * FROM rasobg_users")
        .then(() => {
            res.render("register.njk", {
                title: "Register",
                layout: "layout.njk"
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                register: {
                    error: "Error creating account"
                }
            });
        });
});
router.post("/", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, 10, async function(err, hash) {

    await pool
        .promise()
        .query("INSERT INTO rasobg_users (username,password,created_at) VALUES (?,?,now())", [username, hash])
        .then((response) => {
            res.redirect("/login");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                task: {
                    error: "Error getting meep"
                }
            });
        });
    });
});

module.exports = router;
