const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");       // password hashing function

router.post("/register", async(req, res) => {
    try {
        const {firstName, lastName, email, password } = req.body;

        const vfcUser = await pool.query("SELECT * FROM users WHERE vfc_user_email = $1", [email]);
    } catch(err) {
        console.error(err.message);
        // res.status(500).send("500 - Error");
    }
});