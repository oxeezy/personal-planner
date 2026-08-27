const express = require('express');

const router = express.Router();

const goalMilestoneController =
    require('../controllers/goalMilestoneController');

const auth =
    require('../middleware/auth');


// ================================================================
// CREATE
// ================================================================

router.post(
    '/:goalId/milestones',
    auth,
    goalMilestoneController.createMilestone
);


// ================================================================
// GET
// ================================================================

router.get(
    '/:goalId/milestones',
    auth,
    goalMilestoneController.getMilestones
);


// ================================================================
// UPDATE / TOGGLE
// ================================================================

router.put(
    '/:goalId/milestones/:id',
    auth,
    goalMilestoneController.toggleMilestone
);


// ================================================================
// EDIT TITLE
// ================================================================

router.patch(
    '/:goalId/milestones/:id',
    auth,
    goalMilestoneController.updateMilestone
);


// ================================================================
// DELETE
// ================================================================

router.delete(
    '/:goalId/milestones/:id',
    auth,
    goalMilestoneController.deleteMilestone
);


module.exports = router;