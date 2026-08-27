const express = require('express');

const router = express.Router();

const dailyPlanController =
    require('../controllers/dailyPlanController');

const auth =
    require('../middleware/auth');


// ================================================================
// CREATE DAILY PLAN
// ================================================================

router.post(
    '/',
    auth,
    dailyPlanController.createDailyPlan
);


// ================================================================
// GET DAILY PLANS
// ================================================================

router.get(
    '/',
    auth,
    dailyPlanController.getDailyPlans
);


// ================================================================
// UPDATE DAILY PLAN
// ================================================================

router.put(
    '/:id',
    auth,
    dailyPlanController.updateDailyPlan
);


// ================================================================
// DELETE DAILY PLAN
// ================================================================

router.delete(
    '/:id',
    auth,
    dailyPlanController.deleteDailyPlan
);


module.exports = router;