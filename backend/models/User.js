const db = require('../config/database');

const User = {

    // ================================================================
    // CREATE USER
    // ================================================================

    create: (
        name,
        email,
        password,
        callback
    ) => {

        const sql = `
            INSERT INTO users
            (
                name,
                email,
                password
            )
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [
                name,
                email,
                password
            ],
            callback
        );

    },


    // ================================================================
    // LOGIN
    // ================================================================

    login: (
        email,
        password,
        callback
    ) => {

        const sql = `
            SELECT
                id,
                name,
                email
            FROM users
            WHERE
                email = ?
                AND password = ?
            LIMIT 1
        `;

        db.query(
            sql,
            [
                email,
                password
            ],
            callback
        );

    },


    // ================================================================
    // GET USER BY ID
    // ================================================================

    getById: (
        userId,
        callback
    ) => {

        const sql = `
            SELECT
                id,
                name,
                email
            FROM users
            WHERE id = ?
            LIMIT 1
        `;

        db.query(
            sql,
            [
                userId
            ],
            callback
        );

    }

};

module.exports = User;