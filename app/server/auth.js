const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;

module.exports = async (req, res, next) => {
    try {
        const token = req.header("token");
        if (!token || token === null) throw "401 - Unauthorized";
        console.log("token: " + token);

        const validate = jwt.verify(token, process.env.TOKEN_SECRET);
        // console.log("validated: " + validate);
        if (!validate) throw "401 - Unauthorized";
        // console.log("validate: " + JSON.stringify(validate));
        // console.log(validate.vfc_user_id);
        req.user = validate.vfc_user_id;
        next();
    } catch (err) {
        console.log("Error: " + err);
        res.json(err);
    };
};
// function authToken(req, res, next) {
//     const authHeader = req.headers("token");
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token == null) throw "401 - Unauthorized";

//     try {
//         const verify = jwt.verify(token, secret);
//         req.user = verify.user;
//         next();
//     } catch (err) {
//         console.log("Reason - " + err);
//         res.status(401).json(err);
//     }
// };