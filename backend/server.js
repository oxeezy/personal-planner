const express =
    require('express');

const session =
    require('express-session');

const cors =
    require('cors');


const app =
    express();


// ================================================================
// CORS
// ================================================================

app.use(
    cors({
        origin:
            'http://127.0.0.1:5500',

        credentials:
            true
    })
);


// ================================================================
// JSON
// ================================================================

app.use(
    express.json()
);


// ================================================================
// SESSION
// ================================================================

app.use(
    session({

        secret:
            'my-secret-key',

        resave:
            false,

        saveUninitialized:
            false,

        cookie: {

            httpOnly:
                true,

            sameSite:
                'lax',

            secure:
                false,

            maxAge:
                1000 *
                60 *
                60 *
                24 *
                7

        }

    })
);


// ================================================================
// ROUTES
// ================================================================

const userRoutes =
    require('./routes/userRoutes');


const taskRoutes =
    require('./routes/taskRoutes');


const jobApplicationRoutes =
    require('./routes/jobApplicationRoutes');


const dailyPlanRoutes =
    require('./routes/dailyPlanRoutes');


const goalRoutes =
    require('./routes/goalRoutes');


const goalMilestoneRoutes =
    require('./routes/goalMilestoneRoutes');


const settingsRoutes =
    require('./routes/settingsRoutes');


// ================================================================
// API ROUTES
// ================================================================

app.use(
    '/api/users',
    userRoutes
);


app.use(
    '/api/tasks',
    taskRoutes
);


app.use(
    '/api/jobs',
    jobApplicationRoutes
);


app.use(
    '/api/daily-plans',
    dailyPlanRoutes
);


app.use(
    '/api/goals',
    goalRoutes
);


app.use(
    '/api/goals',
    goalMilestoneRoutes
);


app.use(
    '/api/settings',
    settingsRoutes
);


// ================================================================
// ROOT
// ================================================================

app.get(
    '/',
    (
        req,
        res
    ) => {

        res.send(
            'Personal Planner API is working!'
        );

    }
);


// ================================================================
// START SERVER
// ================================================================

app.listen(
    3000,
    () => {

        console.log(
            'Server running on port 3000'
        );

    }
);