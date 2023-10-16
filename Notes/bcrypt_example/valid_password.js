// Validating a Password with a Hash
const bcrypt = require("bcrypt");
const plainTextPassword = "DFGh5546*%^__90";
const badplainTextPassword = "DFGh5546*%^__90_badpassword";
const hash = "$2b$10$69SrwAoAUNC5F.gtLEvrNON6VQ5EX89vNqLEqU655Oy9PeT/HRM/a";

bcrypt
    .compare(plainTextPassword, hash)
    .then(res => {
        console.log("Testing correct password vs hash: ");
        console.log(res);
    })
    .catch(err => console.error(err.message));


bcrypt
    .compare(badplainTextPassword, hash)
    .then(res => {
        console.log("Testing bad password against hash: ");
        console.log(res);
    })
    .catch(err => console.error(err.message));