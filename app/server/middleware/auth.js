const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;

function authToken(req, res, next) {
    const authHeader = req.headers("token");
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) throw "401 - Unauthorized";

    try {
        const verify = jwt.verify(token, secret);
        req.user = verify.user;
        next();
    } catch (err) {
        console.log("Reason - " + err);
        res.status(401).json(err);
    }
};