const db = require('../config/database');

const DailyPlan = {

    // ================================================================
    // CREATE
    // ================================================================

    create: (
        userId,
        date,
        endDate,
        startTime,
        endTime,
        title,
        description,
        category,
        recurrenceType,
        recurrenceDays,
        recurrenceEndDate,
        callback
    ) => {

        const sql = `
            INSERT INTO daily_plans
            (
                user_id,
                date,
                end_date,
                start_time,
                end_time,
                title,
                description,
                category,
                recurrence_type,
                recurrence_days,
                recurrence_end_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                userId,
                date,
                endDate,
                startTime,
                endTime,
                title,
                description,
                category,
                recurrenceType,
                recurrenceDays,
                recurrenceEndDate
            ],
            callback
        );

    },


    // ================================================================
    // GET USER DAILY PLANS
    // ================================================================

    getByUser: (
        userId,
        callback
    ) => {

        const sql = `
            SELECT
                id,
                user_id,

                DATE_FORMAT(
                    date,
                    '%Y-%m-%d'
                ) AS date,

                DATE_FORMAT(
                    end_date,
                    '%Y-%m-%d'
                ) AS end_date,

                TIME_FORMAT(
                    start_time,
                    '%H:%i'
                ) AS start_time,

                TIME_FORMAT(
                    end_time,
                    '%H:%i'
                ) AS end_time,

                title,
                description,
                category,

                recurrence_type,
                recurrence_days,

                DATE_FORMAT(
                    recurrence_end_date,
                    '%Y-%m-%d'
                ) AS recurrence_end_date,

                reminder_tomorrow_sent,

                created_at

            FROM daily_plans

            WHERE user_id = ?

            ORDER BY
                date ASC,
                start_time ASC
        `;

        db.query(
            sql,
            [userId],
            callback
        );

    },


    // ================================================================
    // UPDATE
    // ================================================================

    update: (
        planId,
        userId,
        date,
        endDate,
        startTime,
        endTime,
        title,
        description,
        category,
        recurrenceType,
        recurrenceDays,
        recurrenceEndDate,
        callback
    ) => {

        const sql = `
            UPDATE daily_plans

            SET
                date = ?,
                end_date = ?,
                start_time = ?,
                end_time = ?,
                title = ?,
                description = ?,
                category = ?,
                recurrence_type = ?,
                recurrence_days = ?,
                recurrence_end_date = ?,

                reminder_tomorrow_sent = 0

            WHERE
                id = ?
                AND user_id = ?
        `;

        db.query(
            sql,
            [
                date,
                endDate,
                startTime,
                endTime,
                title,
                description,
                category,
                recurrenceType,
                recurrenceDays,
                recurrenceEndDate,
                planId,
                userId
            ],
            callback
        );

    },


    // ================================================================
    // DELETE
    // ================================================================

    delete: (
        planId,
        userId,
        callback
    ) => {

        const sql = `
            DELETE FROM daily_plans

            WHERE
                id = ?
                AND user_id = ?
        `;

        db.query(
            sql,
            [
                planId,
                userId
            ],
            callback
        );

    }

};

module.exports = DailyPlan;