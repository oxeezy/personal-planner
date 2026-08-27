const UserSettings =
    require('../models/UserSettings');


// ================================================================
// GET SETTINGS
// ================================================================

const getSettings = (req, res) => {

    const userId =
        req.session.userId;


    UserSettings.getByUser(
        userId,
        (error, result) => {

            if (error) {

                console.error(
                    'Get settings error:',
                    error
                );

                return res
                    .status(500)
                    .send(
                        'Failed to load settings'
                    );

            }


            // ==================================================
            // CREATE DEFAULT SETTINGS
            // ==================================================

            if (
                result.length === 0
            ) {

                UserSettings.createDefault(
                    userId,
                    createError => {

                        if (createError) {

                            console.error(
                                'Create settings error:',
                                createError
                            );

                            return res
                                .status(500)
                                .send(
                                    'Failed to create default settings'
                                );

                        }


                        UserSettings.getByUser(
                            userId,
                            (getError, settings) => {

                                if (getError) {

                                    console.error(
                                        'Reload settings error:',
                                        getError
                                    );

                                    return res
                                        .status(500)
                                        .send(
                                            'Failed to load settings'
                                        );

                                }


                                return res.json(
                                    settings[0]
                                );

                            }
                        );

                    }
                );

                return;

            }


            res.json(
                result[0]
            );

        }
    );

};


// ================================================================
// UPDATE SETTINGS
// ================================================================

const updateSettings = (req, res) => {

    const userId =
        req.session.userId;


    const {
        theme,
        backgroundType,
        backgroundColor,
        backgroundImage,
        showPlanner,
        showJobTracker,
        showDailyPlanner,
        showGoals
    } = req.body;


    // ==================================================
    // VALID THEMES
    // ==================================================

    const validThemes = [
        'light',
        'dark',
        'ocean',
        'forest',
        'purple',
        'midnight'
    ];


    const selectedTheme =
        validThemes.includes(theme)
            ? theme
            : 'light';


    // ==================================================
    // VALID BACKGROUND TYPES
    // ==================================================

    const validBackgroundTypes = [
        'default',
        'color',
        'image'
    ];


    const selectedBackgroundType =
        validBackgroundTypes.includes(
            backgroundType
        )
            ? backgroundType
            : 'default';


    // ==================================================
    // PREPARE VALUES
    // ==================================================

    const selectedBackgroundColor =
        backgroundColor ||
        '#f4f5f7';


    const selectedBackgroundImage =
        backgroundImage ||
        null;


    const plannerValue =
        showPlanner ? 1 : 0;


    const jobTrackerValue =
        showJobTracker ? 1 : 0;


    const dailyPlannerValue =
        showDailyPlanner ? 1 : 0;


    const goalsValue =
        showGoals ? 1 : 0;


    console.log(
        'Updating settings for user:',
        userId
    );


    console.log({
        theme: selectedTheme,
        backgroundType: selectedBackgroundType,
        backgroundColor:
            selectedBackgroundColor,
        backgroundImage:
            selectedBackgroundImage,
        showPlanner:
            plannerValue,
        showJobTracker:
            jobTrackerValue,
        showDailyPlanner:
            dailyPlannerValue,
        showGoals:
            goalsValue
    });


    // ==================================================
    // UPDATE DATABASE
    // ==================================================

    UserSettings.update(
        userId,
        selectedTheme,
        selectedBackgroundType,
        selectedBackgroundColor,
        selectedBackgroundImage,
        plannerValue,
        jobTrackerValue,
        dailyPlannerValue,
        goalsValue,
        (error, result) => {

            if (error) {

                console.error(
                    'Update settings error:',
                    error
                );

                return res
                    .status(500)
                    .send(
                        'Failed to update settings'
                    );

            }


            if (
                result.affectedRows === 0
            ) {

                return res
                    .status(404)
                    .send(
                        'User settings not found'
                    );

            }


            console.log(
                'Settings updated:',
                result
            );


            res.send(
                'Settings updated successfully!'
            );

        }
    );

};


module.exports = {
    getSettings,
    updateSettings
};