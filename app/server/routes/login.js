const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const tokenGenerator = require("../tokenGenerator");
const authentication = require('../auth');
const { sign } = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        // console.log(firstName);
        if (firstName === undefined || firstName.length === 0) console.log("Note - First name is missing but optional.");
        if (lastName === undefined) throw "Missing last name";
        if (email === undefined) throw "Missing email";
        if (password === undefined) throw "Missing password";

        const emailLowerCase = email.toLowerCase();
        // console.log("email: " + email + "\t" + "lowerCase: " + emailLowerCase);

        const lookupEmail = await pool.query("SELECT vfc_user_email FROM vfc_user WHERE vfc_user_email = $1", [emailLowerCase]);
        if (lookupEmail.rows.length !== 0) throw "Email already in use";

        // const hash = await bcrypt.hash(password, saltRounds, function (err, hash) {
        //     if (hash) {
        //         const signup = pool.query("INSERT INTO vfc_user (vfc_user_fname, vfc_user_lname, vfc_user_email, vfc_user_password) VALUES ($1, $2, $3, $4)", [firstName, lastName, emailLowerCase, hash]);
        //         console.log("hash: " + hash);
        //         console.log(JSON.stringify(signup));
        //     }
        // });

        const hash = bcrypt.hash(password, saltRounds)
        const signup = await pool.query("INSERT INTO vfc_user (vfc_user_fname, vfc_user_lname, vfc_user_email, vfc_user_password) VALUES ($1, $2, $3, $4)", [firstName, lastName, email, password]);

        // console.log("hash: " + hash);
        // console.log(JSON.stringify(signup));

        // console.log("200 OK - " + JSON.stringify(req.body));
        // res.status(200).json(req.body);

        const getUserID = await pool.query("SELECT * from vfc_user WHERE vfc_user_email = $1", [emailLowerCase]);

        // console.log(`newUserID: ${JSON.stringify(getUserID)}`);
        // const token = tokenGenerator(getUserID.rows[0].vfc_user_id);
        // console.log(`token: ${token}`);
        res.json({ token });

    } catch (err) {
        console.error("500 Error - " + err);
        res.status(500).send("500 Error - " + err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email + "/" + password);

        if (email === undefined || password === undefined) throw "Missing credential";

        const emailLowerCase = email.toLowerCase();
        // const lookupLogin = await pool.query("SELECT vfc_user_email FROM vfc_user WHERE vfc_user_email = $1 AND vfc_user_password = $2", [email, password]);
        // if (lookupLogin.rows.length === 0) throw "Invalid login credential";

        const lookupLogin = await pool.query("SELECT vfc_user_id, vfc_user_email, vfc_user_password FROM vfc_user WHERE vfc_user_email = $1", [emailLowerCase]);
        if (lookupLogin.rows.length === 0) throw "Invalid login credential";

        const pwHash = lookupLogin.rows[0].vfc_user_password;
        // console.log(pwHash);
        // console.log(password);
        const validateLogin = await bcrypt.compare(password, pwHash);
        console.log(validateLogin);
        if (!validateLogin) throw "Invalid login credential";

        console.log("Token hash OK!");
        const userID = lookupLogin.rows[0].vfc_user_id;
        // console.log("vfc_user_id: " + userID);
        // console.log(`ID format/type: ${typeof(userID)}`);
        // const token = tokenGenerator(lookupLogin.rows[0].vfc_user_id);

        const token = tokenGenerator(userID);

        console.log(`token: ${token}`);
        console.log("200 - Login successful");
        // res.status(200).send("200 - Login successful");
        // console.log({token});

        res.json({ token });
    } catch (error) {
        console.log("500 Error - " + error);
        res.status(500).send("500 Error - " + error);
    }
});

router.get("/", authentication, (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err);
    }
})

// function authToken(req, res, next) {
//     const token = req.header("token");
//     // const authHeader = req.headers['authorization'];
//     // console.log("authHeader: " + authHeader);
//     // const token = authHeader && authHeader.split(' ')[1];
//     // console.log("authHeader.split(' ')[1]: " + authHeader.split(' ')[1]);
//     console.log(token);
//     if (token === null) throw "401 - Unauthorized - null";
//     if(!token) throw "401 - Unauthorized - !token";

//     try {
//         const verify = jwt.verify(token, secret);
//         console.log("verify: " + verify);
//         req.user = verify.user;
//         next();
//     } catch (err) {
//         console.log("Reason - " + err);
//         res.status(401).json(err);
//     }
// };

module.exports = router;