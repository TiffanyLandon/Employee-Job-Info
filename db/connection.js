const mysql = require('mysql2');
require('dotenv').config()
// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: process.env.DB_USER,
        // Your MySQL password
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    console.log('Connected to the department database.')
);


module.exports = db;