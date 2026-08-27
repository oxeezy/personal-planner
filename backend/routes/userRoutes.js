const express =
    require('express');

const router =
    express.Router();


const userController =
    require('../controllers/userController');


const auth =
    require('../middleware/auth');


// ================================================================
// REGISTER
// ================================================================

router.post(
    '/register',
    userController.register
);


// ================================================================
// LOGIN
// ================================================================

router.post(
    '/login',
    userController.login
);


// ================================================================
// CURRENT USER
// ================================================================

router.get(
    '/me',
    auth,
    userController.me
);


// ================================================================
// LOGOUT
// ================================================================

router.post(
    '/logout',
    userController.logout
);


module.exports =
    router;