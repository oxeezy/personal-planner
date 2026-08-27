const express =
    require('express');

const router =
    express.Router();


const jobApplicationController =
    require('../controllers/jobApplicationController');


const auth =
    require('../middleware/auth');


// ================================================================
// CREATE
// ================================================================

router.post(
    '/',
    auth,
    jobApplicationController.createJobApplication
);


// ================================================================
// GET
// ================================================================

router.get(
    '/',
    auth,
    jobApplicationController.getJobApplications
);


// ================================================================
// UPDATE
// ================================================================

router.put(
    '/:id',
    auth,
    jobApplicationController.updateJobApplication
);


// ================================================================
// DELETE
// ================================================================

router.delete(
    '/:id',
    auth,
    jobApplicationController.deleteJobApplication
);


module.exports = router;