/* 
Example with modification via: 
https://dev.to/documatic/what-is-bcrypt-how-to-use-it-to-hash-passwords-5c0g
*/

const bcrypt = require("bcrypt");
const plainTextPassword = "generic";
const plainTextPassword2 = "falsy";
const saltRounds = 2;
const lineBreak = lineSeparator(70);

function lineSeparator(lineLength) {
    let result = "";
    for (let i = 0; i < lineLength; i++) {
        result += "-";
    }
    return result;
}

console.log(lineBreak);

// Example 1 - Note that salt is auto generated
bcrypt.hash(plainTextPassword, saltRounds, function (err, hash) {
    console.log(`Ex1 - hash()\nPassword: ${plainTextPassword} | Salt Rounds: ${saltRounds} | Hash: ${hash}\n${lineBreak}`);
    // TODO: Store the hash in your password DB
});


// Example 2 - Synchronous method called hashSync()
const hash2 = bcrypt.hashSync(plainTextPassword, saltRounds);
console.log(`Ex2 - hashSync()\nPassword: ${plainTextPassword} | Salt Rounds: ${saltRounds} | Hash: ${hash2}\n${lineBreak}`);

// Example - Generating salt for hash
bcrypt.genSalt(saltRounds, function (err, salt) {
    console.log(`Ex - genSalt()\nSalt: ${salt}\n${lineBreak}`);
});

//  Pass salt to hash
bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(plainTextPassword, salt, function (err, hash) {
        console.log(`Ex - genSalt(salt rounds, func() -> hash(pw, salt, func())\nPassing Salt -> Hash: ${hash}\n${lineBreak}`);
        // Store hash in your password DB
    });
});

// Synchronous equivalent - genSaltSync()
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(plainTextPassword, salt);
console.log(`Ex - genSaltSync() + hashSync()\n1) genSaltSync(): ${salt} -> 2) hashSync(pw, salt): ${hash}\n${lineBreak}`);

// Verifying a password
// compare()

bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
    console.log(`Ex - Verifying password - compare()\nHash: ${hash}`)
    // The has returned, continue to compare
    bcrypt.compare(plainTextPassword, hash, function(err, result) {
        console.log(`Password: ${plainTextPassword} | Result via compare(): ${result}`);
    });
    bcrypt.compare(plainTextPassword2, hash, function(err, result) {
        console.log(`Password: ${plainTextPassword2} | Result via compare(): ${result}`);
    });
    console.log(lineBreak);
});

// Synchronous method - compareSync()
const hash3 = bcrypt.hashSync(plainTextPassword, saltRounds);
const result = bcrypt.compareSync(plainTextPassword, hash);
console.log(`Ex - compareSync()\nhashSync(): ${hash3} | compareSync(): ${result}\n${lineBreak}`);

// Using promise or async/await instead of callback function
// bcrypt
//     .hash(plainTextPassword, saltRounds)
//     .then((hash) => {
//         return bcrypt.compare(plainTextPassword, hash)
//             .then((result) => {
//                 console.log(plainTextPassword, result); // generic: true
//             });
//     });
//     .catch ((err) => {
//     console.log(err);
// });
bcrypt
    .hash("generic", 5)
    .then((hash) => {
        return bcrypt.compare("generic", hash)
            .then((result) => {
                console.log("generic:", result); // generic: true
            });
    })
    .catch((err) => {
        console.log(err);
    });

// Alternative async/await style
async function passwordHashTest(password) {
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);

    const result = await bcrypt.compare(plainTextPassword, hash);
    console.log(result);
}

passwordHashTest(plainTextPassword);
// console.log(`Ex - hash() -> compare() - async/await style\n${hashTest}\n${lineBreak}`);