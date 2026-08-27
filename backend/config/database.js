const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({

    host:
        process.env.DB_HOST || 'localhost',

    user:
        process.env.DB_USER || 'root',

    password:
        process.env.DB_PASSWORD,

    database:
        process.env.DB_NAME || 'personal_planner'

});

db.connect((error) => {

    if (error) {

        console.log(
            'Database connection failed'
        );

        console.log(
            error
        );

        return;

    }

    console.log(
        'Database connected successfully'
    );

});

module.exports = db;