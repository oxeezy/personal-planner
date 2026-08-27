const db = require('../config/database');

const Task = {

    create: (userId, title, description, dueDate, priority, callback) => {

        const sql = `
            INSERT INTO tasks 
            (user_id, title, description, due_date, priority)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [userId, title, description, dueDate, priority],
            callback
        );

    },

    getByUser: (userId, callback) => {

        const sql = `
            SELECT 
                id,
                user_id,
                title,
                description,
                status,
                priority,
                DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
                created_at,
                completed
            FROM tasks
            WHERE user_id = ?
        `;

        db.query(sql, [userId], callback);
    },

    update: (taskId, userId, title, description, dueDate, priority, callback) => {

        const sql = `
            UPDATE tasks
            SET title = ?, description = ?, due_date = ?, priority = ?
            WHERE id = ? AND user_id = ?
        `;

        db.query(
            sql,
            [title, description, dueDate, priority, taskId, userId],
            callback
        );

    },

    delete: (taskID, userId, callback) => {

        const sql = `
            DELETE FROM tasks
            WHERE id = ? AND user_id = ?
        `;

        db.query(sql, [taskID, userId], callback);
    },

    complete: (taskId, userId, callback) => {

        const sql = `
            UPDATE tasks
            SET completed = ?
            WHERE id = ? AND user_id = ?
        `;

        db.query(sql, [1, taskId, userId], callback);
    }

};

module.exports = Task;