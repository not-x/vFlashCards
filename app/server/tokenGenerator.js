const token = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.TOKEN_SECRET;

function tokenGenerator(vfc_user_id) {
    // console.log(`argument: ${vfc_user_id}`);
    // return token.sign({login_id: vfc_user_id}, secret, { expiresIn: "1h" });
    return token.sign({ vfc_user_id }, secret, { expiresIn: "1h" });

    // Following lines do not work 
    // return token.sign(JSON.stringify(vfc_user_id), secret, { expiresIn: "1h"});
    // return token.sign(vfc_user_id, secret, { expiresIn: "1h" });
}

module.exports = tokenGenerator;