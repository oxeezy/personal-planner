const DailyPlan = require('../models/DailyPlan');


// ================================================================
// CREATE DAILY PLAN
// ================================================================

const createDailyPlan = (
    req,
    res
) => {

    const userId =
        req.session.userId;


    const {
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
    } = req.body;


    // ============================================================
    // BASIC VALIDATION
    // ============================================================

    if (
        !date ||
        !endDate ||
        !startTime ||
        !endTime ||
        !title
    ) {

        return res
            .status(400)
            .send(
                'Required schedule fields are missing'
            );

    }


    if (endDate < date) {

        return res
            .status(400)
            .send(
                'End date cannot be before start date'
            );

    }


    if (
        date === endDate &&
        endTime <= startTime
    ) {

        return res
            .status(400)
            .send(
                'End time must be later than start time'
            );

    }


    // ============================================================
    // RECURRENCE VALIDATION
    // ============================================================

    const finalRecurrenceType =
        recurrenceType || 'none';


    const allowedRecurrenceTypes = [
        'none',
        'daily',
        'weekly',
        'monthly'
    ];


    if (
        !allowedRecurrenceTypes.includes(
            finalRecurrenceType
        )
    ) {

        return res
            .status(400)
            .send(
                'Invalid recurrence type'
            );

    }


    let finalRecurrenceDays =
        recurrenceDays || null;


    let finalRecurrenceEndDate =
        recurrenceEndDate || null;


    // No recurrence

    if (
        finalRecurrenceType === 'none'
    ) {

        finalRecurrenceDays =
            null;

        finalRecurrenceEndDate =
            null;

    }


    // Recurring schedule requires end date

    if (
        finalRecurrenceType !== 'none' &&
        !finalRecurrenceEndDate
    ) {

        return res
            .status(400)
            .send(
                'Recurrence end date is required'
            );

    }


    // Recurrence end date cannot be before start date

    if (
        finalRecurrenceEndDate &&
        finalRecurrenceEndDate < date
    ) {

        return res
            .status(400)
            .send(
                'Recurrence end date cannot be before the start date'
            );

    }


    // Weekly schedules require at least one weekday

    if (
        finalRecurrenceType === 'weekly' &&
        !finalRecurrenceDays
    ) {

        return res
            .status(400)
            .send(
                'Please select at least one day for weekly recurrence'
            );

    }


    // Daily / monthly do not need recurrence days

    if (
        finalRecurrenceType !== 'weekly'
    ) {

        finalRecurrenceDays =
            null;

    }


    // ============================================================
    // CREATE
    // ============================================================

    DailyPlan.create(

        userId,

        date,

        endDate,

        startTime,

        endTime,

        title.trim(),

        description || null,

        category || 'other',

        finalRecurrenceType,

        finalRecurrenceDays,

        finalRecurrenceEndDate,

        (
            error,
            result
        ) => {

            if (error) {

                console.error(
                    'Daily plan creation error:',
                    error
                );


                return res
                    .status(500)
                    .send(
                        'Daily plan creation failed'
                    );

            }


            res.send(
                'Daily plan added successfully!'
            );

        }

    );

};


// ================================================================
// GET DAILY PLANS
// ================================================================

const getDailyPlans = (
    req,
    res
) => {

    const userId =
        req.session.userId;


    DailyPlan.getByUser(

        userId,

        (
            error,
            result
        ) => {

            if (error) {

                console.error(
                    'Get daily plans error:',
                    error
                );


                return res
                    .status(500)
                    .send(
                        'Something went wrong'
                    );

            }


            res.json(
                result
            );

        }

    );

};


// ================================================================
// UPDATE DAILY PLAN
// ================================================================

const updateDailyPlan = (
    req,
    res
) => {

    const userId =
        req.session.userId;


    const planId =
        req.params.id;


    const {
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
    } = req.body;


    // ============================================================
    // BASIC VALIDATION
    // ============================================================

    if (
        !date ||
        !endDate ||
        !startTime ||
        !endTime ||
        !title
    ) {

        return res
            .status(400)
            .send(
                'Required schedule fields are missing'
            );

    }


    if (endDate < date) {

        return res
            .status(400)
            .send(
                'End date cannot be before start date'
            );

    }


    if (
        date === endDate &&
        endTime <= startTime
    ) {

        return res
            .status(400)
            .send(
                'End time must be later than start time'
            );

    }


    // ============================================================
    // RECURRENCE VALIDATION
    // ============================================================

    const finalRecurrenceType =
        recurrenceType || 'none';


    const allowedRecurrenceTypes = [
        'none',
        'daily',
        'weekly',
        'monthly'
    ];


    if (
        !allowedRecurrenceTypes.includes(
            finalRecurrenceType
        )
    ) {

        return res
            .status(400)
            .send(
                'Invalid recurrence type'
            );

    }


    let finalRecurrenceDays =
        recurrenceDays || null;


    let finalRecurrenceEndDate =
        recurrenceEndDate || null;


    // No recurrence

    if (
        finalRecurrenceType === 'none'
    ) {

        finalRecurrenceDays =
            null;

        finalRecurrenceEndDate =
            null;

    }


    // Recurring schedule requires end date

    if (
        finalRecurrenceType !== 'none' &&
        !finalRecurrenceEndDate
    ) {

        return res
            .status(400)
            .send(
                'Recurrence end date is required'
            );

    }


    // Recurrence end date cannot be before start date

    if (
        finalRecurrenceEndDate &&
        finalRecurrenceEndDate < date
    ) {

        return res
            .status(400)
            .send(
                'Recurrence end date cannot be before the start date'
            );

    }


    // Weekly requires weekdays

    if (
        finalRecurrenceType === 'weekly' &&
        !finalRecurrenceDays
    ) {

        return res
            .status(400)
            .send(
                'Please select at least one day for weekly recurrence'
            );

    }


    // Daily / monthly don't use weekday selection

    if (
        finalRecurrenceType !== 'weekly'
    ) {

        finalRecurrenceDays =
            null;

    }


    // ============================================================
    // UPDATE
    // ============================================================

    DailyPlan.update(

        planId,

        userId,

        date,

        endDate,

        startTime,

        endTime,

        title.trim(),

        description || null,

        category || 'other',

        finalRecurrenceType,

        finalRecurrenceDays,

        finalRecurrenceEndDate,

        (
            error,
            result
        ) => {

            if (error) {

                console.error(
                    'Daily plan update error:',
                    error
                );


                return res
                    .status(500)
                    .send(
                        'Daily plan update failed'
                    );

            }


            if (
                result.affectedRows === 0
            ) {

                return res
                    .status(404)
                    .send(
                        'Daily plan not found'
                    );

            }


            res.send(
                'Daily plan updated successfully!'
            );

        }

    );

};


// ================================================================
// DELETE DAILY PLAN
// ================================================================

const deleteDailyPlan = (
    req,
    res
) => {

    const userId =
        req.session.userId;


    const planId =
        req.params.id;


    DailyPlan.delete(

        planId,

        userId,

        (
            error,
            result
        ) => {

            if (error) {

                console.error(
                    'Daily plan deletion error:',
                    error
                );


                return res
                    .status(500)
                    .send(
                        'Daily plan deletion failed'
                    );

            }


            if (
                result.affectedRows === 0
            ) {

                return res
                    .status(404)
                    .send(
                        'Daily plan not found'
                    );

            }


            res.send(
                'Daily plan deleted successfully!'
            );

        }

    );

};


// ================================================================
// EXPORT
// ================================================================

module.exports = {

    createDailyPlan,

    getDailyPlans,

    updateDailyPlan,

    deleteDailyPlan

};