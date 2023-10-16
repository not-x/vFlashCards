// Example - Technique 2 - Auto-generate a salt and a hash
// https://auth0.com/blog/hashing-in-action-understanding-bcrypt/

const bcrypt = require("bcrypt");
const saltRounds = 10;
const plainTextPassword = "DFGh5546*%^__90";

bcrypt
    .hash(plainTextPassword, saltRounds)
    .then(hash => {
        console.log(`Hash: ${hash}`);

        // Store hash in your password DB.
    })

    .catch(err => console.error(err.message));