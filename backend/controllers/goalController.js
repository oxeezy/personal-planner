const Goal = require('../models/Goal');


// ================================================================
// CREATE GOAL
// ================================================================

const createGoal = (req, res) => {

    const userId = req.session.userId;

    const {
        title,
        description,
        category,
        deadline,
        progress,
        status
    } = req.body;


    if (!title || title.trim() === '') {

        return res
            .status(400)
            .send('Goal title is required');

    }


    Goal.create(
        userId,
        title,
        description || null,
        category || 'other',
        deadline || null,
        progress ?? 0,
        status || 'active',
        (error, result) => {

            if (error) {

                console.log(error);

                return res
                    .status(500)
                    .send('Goal creation failed');

            }


            res.send('Goal added successfully!');

        }
    );

};


// ================================================================
// GET GOALS
// ================================================================

const getGoals = (req, res) => {

    const userId = req.session.userId;


    Goal.getByUser(
        userId,
        (error, result) => {

            if (error) {

                console.log(error);

                return res
                    .status(500)
                    .send('Failed to load goals');

            }


            res.send(result);

        }
    );

};


// ================================================================
// UPDATE GOAL
// ================================================================

const updateGoal = (req, res) => {

    const userId = req.session.userId;

    const goalId = req.params.id;

    const {
        title,
        description,
        category,
        deadline,
        progress,
        status
    } = req.body;


    if (!title || title.trim() === '') {

        return res
            .status(400)
            .send('Goal title is required');

    }


    Goal.update(
        goalId,
        userId,
        title,
        description || null,
        category || 'other',
        deadline || null,
        progress ?? 0,
        status || 'active',
        (error, result) => {

            if (error) {

                console.log(error);

                return res
                    .status(500)
                    .send('Goal update failed');

            }


            if (result.affectedRows === 0) {

                return res
                    .status(404)
                    .send('Goal not found');

            }


            res.send(
                'Goal updated successfully!'
            );

        }
    );

};


// ================================================================
// DELETE GOAL
// ================================================================

const deleteGoal = (req, res) => {

    const userId = req.session.userId;

    const goalId = req.params.id;


    Goal.delete(
        goalId,
        userId,
        (error, result) => {

            if (error) {

                console.log(error);

                return res
                    .status(500)
                    .send('Goal deletion failed');

            }


            if (result.affectedRows === 0) {

                return res
                    .status(404)
                    .send('Goal not found');

            }


            res.send(
                'Goal deleted successfully!'
            );

        }
    );

};

// ================================================================
// UPDATE GOAL PROGRESS
// ================================================================

const updateGoalProgress = (req, res) => {

    const userId = req.session.userId;

    const goalId = req.params.id;

    const progress = Number(req.body.progress);


    if (
        Number.isNaN(progress) ||
        progress < 0 ||
        progress > 100
    ) {

        return res
            .status(400)
            .send('Progress must be between 0 and 100');

    }


    Goal.updateProgress(
        goalId,
        userId,
        progress,
        (error, result) => {

            if (error) {

                console.log(error);

                return res
                    .status(500)
                    .send('Goal progress update failed');

            }


            if (result.affectedRows === 0) {

                return res
                    .status(404)
                    .send('Goal not found');

            }


            res.send(
                'Goal progress updated successfully!'
            );

        }
    );

};


module.exports = {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
    updateGoalProgress
};