// Example - Technique 1 - Generate a salt and hash on separate functions calls.
// https://auth0.com/blog/hashing-in-action-understanding-bcrypt/

const bcrypt = require("bcrypt");
const saltRounds = 10;
const plainTextPassword = "DFGh5546*%^__90";

bcrypt
    .genSalt(saltRounds)
    .then(salt => {
        console.log(`Salt: ${salt}`);
        return bcrypt.hash(plainTextPassword, salt);
    })

.then(hash => {
    console.log(`Hash: ${hash}`);
    // Store hash in your password DB
})

.catch(err => console.error(err.message));