const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();


// ============================================================
// SSL CONFIGURATION
// ============================================================

let ssl;

// LOCAL: use the CA certificate file
if (process.env.DB_SSL_CA_PATH) {

    ssl = {
        ca: fs.readFileSync(
            process.env.DB_SSL_CA_PATH
        ),
        rejectUnauthorized: true
    };

}

// RENDER: use the CA certificate stored in environment variable
else if (process.env.DB_SSL_CA) {

    ssl = {
        ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n'),
        rejectUnauthorized: true
    };

}


// ============================================================
// DATABASE CONNECTION POOL
// ============================================================

const db = mysql.createPool({

    host:
        process.env.DB_HOST,

    port:
        Number(process.env.DB_PORT),

    user:
        process.env.DB_USER,

    password:
        process.env.DB_PASSWORD,

    database:
        process.env.DB_NAME,

    ssl,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});


// ============================================================
// DATABASE CONNECTION TEST
// ============================================================

db.getConnection((error, connection) => {

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

    connection.release();

});


module.exports = db;