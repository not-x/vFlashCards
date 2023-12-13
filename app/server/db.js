const Pool = require("pg").Pool;
require("dotenv").config();

// const pool = new Pool({    
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     port:5432,
//     database: process.env.DB
// });

// const dev = new Pool({    
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     port:5432,
//     database: process.env.DB
// });
// const dev = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const dev = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB}`;
// console.log(dev)
// const prod = {
//     "use_env_variable": process.env.DB_PROD,
//     "dialect": "postgres",
//     "dialectOptions": {
//       "ssl": {
//         "rejectUnauthorized": false
//       }
//     }
// }

const prod = `postgresql://${DATABASE_URL}`
console.log(prod);
const pool = new Pool({
    connectionString:
      process.env.NODE_ENV === "production" ? prod : dev,
  });
  

module.exports = pool;