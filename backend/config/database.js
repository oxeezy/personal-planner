const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'personal_planner'
});

db.connect((error) => {
    if (error) {
        console.log('Database connection failed');
        console.log(error);
        return;
    }

    console.log('Database connected successfully');
});

module.exports = db;