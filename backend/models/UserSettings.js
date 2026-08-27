const db = require('../config/database');

const UserSettings = {

    // ================================================================
    // GET SETTINGS
    // ================================================================

    getByUser: (
        userId,
        callback
    ) => {

        const sql = `
            SELECT
                id,
                user_id,
                theme,
                background_type,
                background_color,
                background_image,
                show_planner,
                show_job_tracker,
                show_daily_planner,
                show_goals,
                created_at,
                updated_at
            FROM user_settings
            WHERE user_id = ?
        `;

        db.query(
            sql,
            [userId],
            callback
        );

    },


    // ================================================================
    // CREATE DEFAULT SETTINGS
    // ================================================================

    createDefault: (
        userId,
        callback
    ) => {

        const sql = `
            INSERT INTO user_settings
            (
                user_id
            )
            VALUES (?)
        `;

        db.query(
            sql,
            [userId],
            callback
        );

    },


    // ================================================================
    // UPDATE SETTINGS
    // ================================================================

    update: (
        userId,
        theme,
        backgroundType,
        backgroundColor,
        backgroundImage,
        showPlanner,
        showJobTracker,
        showDailyPlanner,
        showGoals,
        callback
    ) => {

        const sql = `
            UPDATE user_settings
            SET
                theme = ?,
                background_type = ?,
                background_color = ?,
                background_image = ?,
                show_planner = ?,
                show_job_tracker = ?,
                show_daily_planner = ?,
                show_goals = ?
            WHERE user_id = ?
        `;

        db.query(
            sql,
            [
                theme,
                backgroundType,
                backgroundColor,
                backgroundImage,
                showPlanner,
                showJobTracker,
                showDailyPlanner,
                showGoals,
                userId
            ],
            callback
        );

    }

};

module.exports = UserSettings;