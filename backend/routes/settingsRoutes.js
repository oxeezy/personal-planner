const express = require('express');

const router = express.Router();

const settingsController =
    require('../controllers/settingsController');

const auth =
    require('../middleware/auth');


// ================================================================
// GET SETTINGS
// ================================================================

router.get(
    '/',
    auth,
    settingsController.getSettings
);


// ================================================================
// UPDATE SETTINGS
// ================================================================

router.put(
    '/',
    auth,
    settingsController.updateSettings
);


module.exports = router;