const express = require('express');

const router = express.Router();

const goalController =
    require('../controllers/goalController');

const auth =
    require('../middleware/auth');


// ================================================================
// CREATE
// ================================================================

router.post(
    '/',
    auth,
    goalController.createGoal
);


// ================================================================
// GET
// ================================================================

router.get(
    '/',
    auth,
    goalController.getGoals
);


// ================================================================
// UPDATE
// ================================================================

router.put(
    '/:id',
    auth,
    goalController.updateGoal
);


// ================================================================
// DELETE
// ================================================================

router.delete(
    '/:id',
    auth,
    goalController.deleteGoal
);

router.put(
    '/:id/progress',
    auth,
    goalController.updateGoalProgress
);


module.exports = router;