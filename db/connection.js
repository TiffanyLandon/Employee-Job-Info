const mysql = require('mysql2');
// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'landon12!',
        database: 'department'
    },
    console.log('Connected to the department database.')
);


module.exports = db;