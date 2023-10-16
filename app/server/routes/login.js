const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        console.log(firstName);
        if (firstName === undefined || firstName.length === 0) console.log("Note - First name is missing but optional.");
        if (lastName === undefined) throw "Missing last name";
        if (email === undefined) throw "Missing email";
        if (password === undefined) throw "Missing password";

        const lookupEmail = await pool.query("SELECT vfc_user_email FROM vfc_user WHERE vfc_user_email = $1", [email]);
        if (lookupEmail.rows.length !== 0) throw "Email already in use";
        else {
            const hash = bcrypt.hash(password, saltRounds, function (err, hash) {
                const signup = pool.query("INSERT INTO vfc_user (vfc_user_fname, vfc_user_lname, vfc_user_email, vfc_user_password) VALUES ($1, $2, $3, $4)", [firstName, lastName, email, hash]);
            })
            // const signup = await pool.query("INSERT INTO vfc_user (vfc_user_fname, vfc_user_lname, vfc_user_email, vfc_user_password) VALUES ($1, $2, $3, $4)", [firstName, lastName, email, password]);
        };
        console.log("200 OK - " + JSON.stringify(req.body));
        res.status(200).json(req.body);

    } catch (err) {
        console.error("500 Error - " + err);
        res.status(500).send("500 Error - " + err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email + "/" + password);

        if (email === undefined || password === undefined) throw "Missing credential";

        // const lookupLogin = await pool.query("SELECT vfc_user_email FROM vfc_user WHERE vfc_user_email = $1 AND vfc_user_password = $2", [email, password]);
        // if (lookupLogin.rows.length === 0) throw "Invalid login credential";

        const lookupLogin = await pool.query("SELECT vfc_user_email, vfc_user_password FROM vfc_user WHERE vfc_user_email = $1", [email]);
        if (lookupLogin.rows.length === 0) throw "Invalid login credential";

        const pwHash = lookupLogin.rows[0].vfc_user_password;
        // console.log(pwHash);
        // console.log(password);
        const validateLogin = await bcrypt.compare(password, pwHash);
        // console.log(validateLogin);
        if (!validateLogin) throw "Invalid login credential";

        console.log("200 - Login successful");
        res.status(200).send("200 - Login successful");

    } catch (error) {
        console.log("500 Error - " + error);
        res.status(500).send("500 Error - " + error);
    }
});

module.exports = router;