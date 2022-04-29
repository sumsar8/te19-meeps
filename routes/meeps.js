var express = require("express");
var router = express.Router();
const pool = require("../database");

router.get("/", async (req, res, next) => {
    await pool
        .promise()
        .query("SELECT * FROM rasobg_meeps JOIN rasobg_users ON rasobg_meeps.user_id = rasobg_users.user_id")
        .then(([rows, fields]) => {
            res.render("meeps.njk", {
                meeps: rows,
                title: "Meeps",
                username: req.session.username,
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

router.get("/:id/delete", async (req, res, next) => {
    const id = req.params.id;
    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: "Bad request"
            }
        });
    }
    await pool
        .promise()
        .query("DELETE FROM rasobg_meeps WHERE id = ?", [id])
        .then((response) => {
            if (response[0].affectedRows === 1) {
                res.redirect("/meeps");
            } else {
                res.status(400).redirect("/meeps");
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                meeps: {
                    error: "Error deleting meep"
                }
            });
        });
});
router.post("/", async (req, res, next) => {
    const meep = req.body.meep;
    const userid = req.session.userid;
    await pool
        .promise()
        .query("INSERT INTO rasobg_meeps (body,created_at,updated_at,user_id) VALUES (?,now(),now(),?)", [meep,userid])
        .then((response) => {
            if (response[0].affectedRows == 1) {
                res.redirect("/meeps");
            } else {
                res.status(400).json({
                    task: {
                        error: "Invalid meep"
                    }
                });
            }
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

module.exports = router;
