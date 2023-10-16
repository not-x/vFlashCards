// Salting passwords with bcrypt
// Code found via:
// https://auth0.com/blog/hashing-in-action-understanding-bcrypt/

const bcrypt = require("bcrypt");
const plainTextPassword = "DFGh5546*%^__90";

for (let saltRounds = 10; saltRounds < 21; saltRounds++) {
    console.time(`bcrypt | cost: ${saltRounds}, time to hash`);
    bcrypt.hashSync(plainTextPassword, saltRounds);
    console.timeEnd(`bcrypt | cost: ${saltRounds}, time to hash`);
};