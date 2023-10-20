const token = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.TOKEN_SECRET;

function tokenGenerator(vfc_user_id) {
    return token.sign(vfc_user_id, secret, { expiresIn: "1h" });
}

module.exports = tokenGenerator;