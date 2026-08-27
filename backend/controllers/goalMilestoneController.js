const GoalMilestone = require('../models/GoalMilestone');


// ================================================================
// CREATE MILESTONE
// ================================================================

const createMilestone = (req, res) => {

    const goalId = req.params.goalId;

    const {
        title
    } = req.body;


    if (!title || title.trim() === '') {

        return res
            .status(400)
            .send('Milestone title is required');

    }


    GoalMilestone.create(
        goalId,
        title.trim(),
        (error, result) => {

            if (error) {

                console.log(error);

                return res
                    .status(500)
                    .send('Milestone creation failed');

            }


            res.send(
                'Milestone added successfully!'
            );

        }
    );

};


// ================================================================
// GET MILESTONES
// ================================================================

const getMilestones = (req, res) => {

    const goalId = req.params.goalId;


    GoalMilestone.getByGoal(
        goalId,
        (error, result) => {

            if (error) {

                console.log(error);

                return res
                    .status(500)
                    .send('Failed to load milestones');

            }


            res.send(result);

        }
    );

};


// ================================================================
// TOGGLE MILESTONE
// ================================================================

const toggleMilestone = (req, res) => {

    const goalId =
        req.params.goalId;

    const milestoneId =
        req.params.id;

    const {
        completed
    } = req.body;


    GoalMilestone.toggle(
        milestoneId,
        goalId,
        completed ? 1 : 0,
        (error, result) => {

            if (error) {

                console.log(error);

                return res
                    .status(500)
                    .send('Milestone update failed');

            }


            if (
                result.affectedRows === 0
            ) {

                return res
                    .status(404)
                    .send('Milestone not found');

            }


            res.send(
                'Milestone updated successfully!'
            );

        }
    );

};


// ================================================================
// UPDATE MILESTONE
// ================================================================

const updateMilestone = (req, res) => {

    const goalId =
        req.params.goalId;

    const milestoneId =
        req.params.id;

    const {
        title
    } = req.body;


    if (!title || title.trim() === '') {

        return res
            .status(400)
            .send('Milestone title is required');

    }


    GoalMilestone.update(
        milestoneId,
        goalId,
        title.trim(),
        (error, result) => {

            if (error) {

                console.log(error);

                return res
                    .status(500)
                    .send('Milestone update failed');

            }


            if (
                result.affectedRows === 0
            ) {

                return res
                    .status(404)
                    .send('Milestone not found');

            }


            res.send(
                'Milestone updated successfully!'
            );

        }
    );

};


// ================================================================
// DELETE MILESTONE
// ================================================================

const deleteMilestone = (req, res) => {

    const goalId =
        req.params.goalId;

    const milestoneId =
        req.params.id;


    GoalMilestone.delete(
        milestoneId,
        goalId,
        (error, result) => {

            if (error) {

                console.log(error);

                return res
                    .status(500)
                    .send('Milestone deletion failed');

            }


            if (
                result.affectedRows === 0
            ) {

                return res
                    .status(404)
                    .send('Milestone not found');

            }


            res.send(
                'Milestone deleted successfully!'
            );

        }
    );

};


module.exports = {
    createMilestone,
    getMilestones,
    toggleMilestone,
    updateMilestone,
    deleteMilestone
};