const db = require('../config/database');

const Goal = {

    // ================================================================
    // CREATE GOAL
    // ================================================================

    create: (
        userId,
        title,
        description,
        category,
        deadline,
        progress,
        status,
        callback
    ) => {

        const sql = `
            INSERT INTO goals
            (
                user_id,
                title,
                description,
                category,
                deadline,
                progress,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                userId,
                title,
                description,
                category,
                deadline,
                progress,
                status
            ],
            callback
        );

    },


    // ================================================================
    // GET USER GOALS
    // ================================================================

    getByUser: (userId, callback) => {

        const sql = `
            SELECT
                id,
                user_id,
                title,
                description,
                category,
                DATE_FORMAT(deadline, '%Y-%m-%d') AS deadline,
                progress,
                status,
                created_at
            FROM goals
            WHERE user_id = ?
            ORDER BY
                status ASC,
                deadline ASC,
                created_at DESC
        `;

        db.query(
            sql,
            [userId],
            callback
        );

    },


    // ================================================================
    // UPDATE GOAL
    // ================================================================

    update: (
        goalId,
        userId,
        title,
        description,
        category,
        deadline,
        progress,
        status,
        callback
    ) => {

        const sql = `
            UPDATE goals
            SET
                title = ?,
                description = ?,
                category = ?,
                deadline = ?,
                progress = ?,
                status = ?
            WHERE id = ?
            AND user_id = ?
        `;

        db.query(
            sql,
            [
                title,
                description,
                category,
                deadline,
                progress,
                status,
                goalId,
                userId
            ],
            callback
        );

    },


    // ================================================================
    // DELETE GOAL
    // ================================================================

    delete: (
        goalId,
        userId,
        callback
    ) => {

        const sql = `
            DELETE FROM goals
            WHERE id = ?
            AND user_id = ?
        `;

        db.query(
            sql,
            [
                goalId,
                userId
            ],
            callback
        );

    },

    // ================================================================
// UPDATE GOAL PROGRESS
// ================================================================

    updateProgress: (
        goalId,
        userId,
        progress,
        callback
    ) => {

        const sql = `
            UPDATE goals
            SET progress = ?
            WHERE id = ?
            AND user_id = ?
        `;

        db.query(
            sql,
            [
                progress,
                goalId,
                userId
            ],
            callback
        );

    },

};

module.exports = Goal;