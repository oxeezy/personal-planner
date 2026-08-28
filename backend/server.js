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
        origin: [
            'http://127.0.0.1:5500',
            'http://127.0.0.1:8080',
            'http://192.168.100.6:8080'
        ],

        credentials: true
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

app.set('trust proxy', 1);

app.use(
    session({

        secret:
            process.env.SESSION_SECRET,

        resave:
            false,

        saveUninitialized:
            false,

        cookie: {

            httpOnly:
                true,

            sameSite:
                'none',

            secure:
                true,

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

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);