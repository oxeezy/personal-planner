const db = require('../config/database');

const GoalMilestone = {

    // ================================================================
    // CREATE MILESTONE
    // ================================================================

    create: (
        goalId,
        title,
        callback
    ) => {

        const sql = `
            INSERT INTO goal_milestones
            (
                goal_id,
                title
            )
            VALUES (?, ?)
        `;

        db.query(
            sql,
            [
                goalId,
                title
            ],
            callback
        );

    },


    // ================================================================
    // GET MILESTONES FOR A GOAL
    // ================================================================

    getByGoal: (
        goalId,
        callback
    ) => {

        const sql = `
            SELECT
                id,
                goal_id,
                title,
                completed,
                created_at
            FROM goal_milestones
            WHERE goal_id = ?
            ORDER BY created_at ASC
        `;

        db.query(
            sql,
            [goalId],
            callback
        );

    },


    // ================================================================
    // TOGGLE MILESTONE
    // ================================================================

    toggle: (
        milestoneId,
        goalId,
        completed,
        callback
    ) => {

        const sql = `
            UPDATE goal_milestones
            SET completed = ?
            WHERE id = ?
            AND goal_id = ?
        `;

        db.query(
            sql,
            [
                completed,
                milestoneId,
                goalId
            ],
            callback
        );

    },


    // ================================================================
    // UPDATE MILESTONE
    // ================================================================

    update: (
        milestoneId,
        goalId,
        title,
        callback
    ) => {

        const sql = `
            UPDATE goal_milestones
            SET title = ?
            WHERE id = ?
            AND goal_id = ?
        `;

        db.query(
            sql,
            [
                title,
                milestoneId,
                goalId
            ],
            callback
        );

    },


    // ================================================================
    // DELETE MILESTONE
    // ================================================================

    delete: (
        milestoneId,
        goalId,
        callback
    ) => {

        const sql = `
            DELETE FROM goal_milestones
            WHERE id = ?
            AND goal_id = ?
        `;

        db.query(
            sql,
            [
                milestoneId,
                goalId
            ],
            callback
        );

    }

};

module.exports = GoalMilestone;