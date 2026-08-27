const User = require('../models/User');


// ================================================================
// REGISTER
// ================================================================

const register = (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;


    // ============================================================
    // VALIDATION
    // ============================================================

    if (!name || !name.trim()) {

        return res
            .status(400)
            .send('Name is required');

    }


    if (!email || !email.trim()) {

        return res
            .status(400)
            .send('Email is required');

    }


    if (!password || password.length < 6) {

        return res
            .status(400)
            .send(
                'Password must be at least 6 characters'
            );

    }


    // ============================================================
    // CREATE USER
    // ============================================================

    User.create(

        name.trim(),

        email.trim().toLowerCase(),

        password,

        (
            error,
            result
        ) => {

            if (error) {

                console.error(
                    'Registration error:',
                    error
                );


                if (error.code === 'ER_DUP_ENTRY') {

                    return res
                        .status(409)
                        .send(
                            'An account with this email already exists'
                        );

                }


                return res
                    .status(500)
                    .send(
                        'Registration failed'
                    );

            }


            // ====================================================
            // CLEAR EXISTING SESSION
            // ====================================================

            if (req.session) {

                req.session.destroy(
                    (
                        sessionError
                    ) => {

                        if (sessionError) {

                            console.error(
                                'Session cleanup error:',
                                sessionError
                            );

                            return res
                                .status(500)
                                .send(
                                    'Registration successful, but session cleanup failed'
                                );

                        }


                        res.clearCookie(
                            'connect.sid'
                        );


                        return res
                            .status(201)
                            .send(
                                'Registration successful!'
                            );

                    }
                );

                return;

            }


            res
                .status(201)
                .send(
                    'Registration successful!'
                );

        }

    );

};


// ================================================================
// LOGIN
// ================================================================

const login = (req, res) => {

    // ============================================================
    // PREVENT LOGIN WHEN ALREADY LOGGED IN
    // ============================================================

    if (req.session.userId) {

        return res
            .status(409)
            .send(
                'You are already logged in. Please log out first.'
            );

    }


    const {
        email,
        password
    } = req.body;


    // ============================================================
    // VALIDATION
    // ============================================================

    if (!email || !email.trim()) {

        return res
            .status(400)
            .send(
                'Email is required'
            );

    }


    if (!password) {

        return res
            .status(400)
            .send(
                'Password is required'
            );

    }


    // ============================================================
    // CHECK LOGIN
    // ============================================================

    User.login(

        email.trim().toLowerCase(),

        password,

        (
            error,
            result
        ) => {

            if (error) {

                console.error(
                    'Login error:',
                    error
                );


                return res
                    .status(500)
                    .send(
                        'Login failed'
                    );

            }


            if (
                !result ||
                result.length === 0
            ) {

                return res
                    .status(401)
                    .send(
                        'Invalid email or password'
                    );

            }


            const user =
                result[0];


            // ====================================================
            // CREATE NEW SESSION
            // ====================================================

            req.session.regenerate(
                (
                    sessionError
                ) => {

                    if (sessionError) {

                        console.error(
                            'Session regeneration error:',
                            sessionError
                        );


                        return res
                            .status(500)
                            .send(
                                'Login failed'
                            );

                    }


                    req.session.userId =
                        user.id;


                    req.session.save(
                        (
                            saveError
                        ) => {

                            if (saveError) {

                                console.error(
                                    'Session save error:',
                                    saveError
                                );


                                return res
                                    .status(500)
                                    .send(
                                        'Login failed'
                                    );

                            }


                            res.json({

                                id:
                                    user.id,

                                name:
                                    user.name,

                                email:
                                    user.email

                            });

                        }
                    );

                }
            );

        }

    );

};


// ================================================================
// CURRENT USER
// ================================================================

const me = (
    req,
    res
) => {

    if (!req.session.userId) {

        return res
            .status(401)
            .send(
                'You are not logged in'
            );

    }


    User.getById(

        req.session.userId,

        (
            error,
            result
        ) => {

            if (error) {

                console.error(
                    'Get current user error:',
                    error
                );


                return res
                    .status(500)
                    .send(
                        'Unable to get current user'
                    );

            }


            if (
                !result ||
                result.length === 0
            ) {

                return res
                    .status(404)
                    .send(
                        'User not found'
                    );

            }


            res.json({

                id:
                    result[0].id,

                name:
                    result[0].name,

                email:
                    result[0].email

            });

        }

    );

};


// ================================================================
// LOGOUT
// ================================================================

const logout = (
    req,
    res
) => {

    req.session.destroy(
        (
            error
        ) => {

            if (error) {

                console.error(
                    'Logout error:',
                    error
                );


                return res
                    .status(500)
                    .send(
                        'Logout failed'
                    );

            }


            res.clearCookie(
                'connect.sid'
            );


            res.send(
                'Logout successful'
            );

        }
    );

};


// ================================================================
// EXPORT
// ================================================================

module.exports = {

    register,

    login,

    me,

    logout

};