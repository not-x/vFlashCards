const router = require("express").Router();
const pool = require("../db");

router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (lastName === undefined) throw "Missing last name";
        if (email === undefined) throw "Missing email";
        if (password === undefined) throw "Missing password";

        const checkEmail = await pool.query("SELECT vfc_user_email FROM vfc_user WHERE vfc_user_email = $1", [email]);
        if (checkEmail.rows.length !== 0) throw "Email already in use";
        else {
            const signup = await pool.query("INSERT INTO vfc_user (vfc_user_fname, vfc_user_lname, vfc_user_email, vfc_user_password) VALUES ($1, $2, $3, $4)", [firstName, lastName, email, password]);
        }
        res.json(req.body);

    } catch (err) {
        console.error("500 Error - " + err);
        res.status(500).send("500 Error - " + err);
    }
});

module.exports = router;