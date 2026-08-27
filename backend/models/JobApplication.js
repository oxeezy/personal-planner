const db = require('../config/database');

const JobApplication = {

    // ================================================================
    // CREATE
    // ================================================================

    create: (
        userId,
        company,
        position,
        applicationDate,
        status,
        priority,
        interviewDate,
        interviewTime,
        interviewNotes,
        jobUrl,
        notes,
        followUpDate,
        followUpStatus,
        followUpNotes,
        callback
    ) => {

        const sql = `
            INSERT INTO job_applications
            (
                user_id,
                company,
                position,
                application_date,
                status,
                priority,
                interview_date,
                interview_time,
                interview_notes,
                job_url,
                notes,
                follow_up_date,
                follow_up_status,
                follow_up_notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                userId,
                company,
                position,
                applicationDate,
                status,
                priority,
                interviewDate,
                interviewTime,
                interviewNotes,
                jobUrl,
                notes,
                followUpDate,
                followUpStatus,
                followUpNotes
            ],
            callback
        );

    },


    // ================================================================
    // GET USER JOB APPLICATIONS
    // ================================================================

    getByUser: (
        userId,
        callback
    ) => {

        const sql = `
            SELECT
                id,
                user_id,
                company,
                position,

                DATE_FORMAT(
                    application_date,
                    '%Y-%m-%d'
                ) AS application_date,

                status,
                priority,

                DATE_FORMAT(
                    interview_date,
                    '%Y-%m-%d'
                ) AS interview_date,

                TIME_FORMAT(
                    interview_time,
                    '%H:%i'
                ) AS interview_time,

                interview_notes,

                job_url,

                notes,

                DATE_FORMAT(
                    follow_up_date,
                    '%Y-%m-%d'
                ) AS follow_up_date,

                follow_up_status,

                follow_up_notes,

                DATE_FORMAT(
                    interview_reminder_sent_date,
                    '%Y-%m-%d'
                ) AS interview_reminder_sent_date,

                DATE_FORMAT(
                    follow_up_reminder_sent_date,
                    '%Y-%m-%d'
                ) AS follow_up_reminder_sent_date,

                created_at

            FROM job_applications

            WHERE user_id = ?

            ORDER BY created_at DESC
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
        jobId,
        userId,
        company,
        position,
        applicationDate,
        status,
        priority,
        interviewDate,
        interviewTime,
        interviewNotes,
        jobUrl,
        notes,
        followUpDate,
        followUpStatus,
        followUpNotes,
        callback
    ) => {

        const sql = `
            UPDATE job_applications

            SET
                company = ?,
                position = ?,
                application_date = ?,
                status = ?,
                priority = ?,
                interview_date = ?,
                interview_time = ?,
                interview_notes = ?,
                job_url = ?,
                notes = ?,
                follow_up_date = ?,
                follow_up_status = ?,
                follow_up_notes = ?

            WHERE
                id = ?
                AND user_id = ?
        `;

        db.query(
            sql,
            [
                company,
                position,
                applicationDate,
                status,
                priority,
                interviewDate,
                interviewTime,
                interviewNotes,
                jobUrl,
                notes,
                followUpDate,
                followUpStatus,
                followUpNotes,
                jobId,
                userId
            ],
            callback
        );

    },


    // ================================================================
    // DELETE
    // ================================================================

    delete: (
        jobId,
        userId,
        callback
    ) => {

        const sql = `
            DELETE FROM job_applications

            WHERE
                id = ?
                AND user_id = ?
        `;

        db.query(
            sql,
            [
                jobId,
                userId
            ],
            callback
        );

    },


    // ================================================================
    // GET JOB APPLICATIONS FOR REMINDERS
    // ================================================================

    getReminderJobs: (
        callback
    ) => {

        const sql = `
            SELECT
                ja.id,
                ja.user_id,
                ja.company,
                ja.position,
                ja.status,
                ja.interview_date,
                ja.interview_time,
                ja.interview_notes,
                ja.follow_up_date,
                ja.follow_up_status,
                ja.follow_up_notes,
                ja.interview_reminder_sent_date,
                ja.follow_up_reminder_sent_date,
                u.email,
                u.name

            FROM job_applications ja

            INNER JOIN users u
                ON ja.user_id = u.id

            WHERE
                (
                    ja.status = 'Interview'
                    AND ja.interview_date IS NOT NULL
                )

                OR

                (
                    ja.follow_up_date IS NOT NULL
                    AND ja.follow_up_status = 'Pending'
                )

            ORDER BY
                ja.interview_date ASC,
                ja.follow_up_date ASC
        `;

        db.query(
            sql,
            [],
            callback
        );

    },


    // ================================================================
    // MARK INTERVIEW REMINDER SENT
    // ================================================================

    markInterviewReminderSent: (
        jobId,
        reminderDate,
        callback
    ) => {

        const sql = `
            UPDATE job_applications

            SET
                interview_reminder_sent_date = ?

            WHERE id = ?
        `;

        db.query(
            sql,
            [
                reminderDate,
                jobId
            ],
            callback
        );

    },


    // ================================================================
    // MARK FOLLOW-UP REMINDER SENT
    // ================================================================

    markFollowUpReminderSent: (
        jobId,
        reminderDate,
        callback
    ) => {

        const sql = `
            UPDATE job_applications

            SET
                follow_up_reminder_sent_date = ?

            WHERE id = ?
        `;

        db.query(
            sql,
            [
                reminderDate,
                jobId
            ],
            callback
        );

    }

};

module.exports = JobApplication;