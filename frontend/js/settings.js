const saveSettingsButton =
    document.querySelector(
        '#saveSettings'
    );

const settingsMessage =
    document.querySelector(
        '#settingsMessage'
    );

const colorSettings =
    document.querySelector(
        '#colorSettings'
    );

const imageSettings =
    document.querySelector(
        '#imageSettings'
    );


// ============================================================
// BACKGROUND OPTIONS
// ============================================================

function updateBackgroundOptions() {

    if (colorSettings) {

        colorSettings.classList.remove(
            'active'
        );

    }


    if (imageSettings) {

        imageSettings.classList.remove(
            'active'
        );

    }


    const selected =
        document.querySelector(
            'input[name="backgroundType"]:checked'
        );


    if (!selected) {
        return;
    }


    if (
        selected.value === 'color' &&
        colorSettings
    ) {

        colorSettings.classList.add(
            'active'
        );

    }


    if (
        selected.value === 'image' &&
        imageSettings
    ) {

        imageSettings.classList.add(
            'active'
        );

    }

}


document
    .querySelectorAll(
        'input[name="backgroundType"]'
    )
    .forEach(
        input => {

            input.addEventListener(
                'change',
                updateBackgroundOptions
            );

        }
    );


// ============================================================
// GET FORM SETTINGS
// ============================================================

function getSettingsFromForm() {

    const selectedTheme =
        document.querySelector(
            'input[name="theme"]:checked'
        );


    const selectedBackground =
        document.querySelector(
            'input[name="backgroundType"]:checked'
        );


    return {

        theme:
            selectedTheme
                ? selectedTheme.value
                : 'light',

        backgroundType:
            selectedBackground
                ? selectedBackground.value
                : 'default',

        backgroundColor:
            document.querySelector(
                '#backgroundColor'
            ).value,

        backgroundImage:
            document.querySelector(
                '#backgroundImage'
            ).value.trim(),

        showPlanner:
            document.querySelector(
                '#showPlanner'
            ).checked,

        showJobTracker:
            document.querySelector(
                '#showJobTracker'
            ).checked,

        showDailyPlanner:
            document.querySelector(
                '#showDailyPlanner'
            ).checked,

        showGoals:
            document.querySelector(
                '#showGoals'
            ).checked

    };

}


// ============================================================
// SAVE
// ============================================================

saveSettingsButton.addEventListener(
    'click',
    async () => {

        const settings =
            getSettingsFromForm();


        settingsMessage.textContent =
            'Saving...';


        saveSettingsButton.disabled =
            true;


        try {

            const response =
                await fetch(
                    'https://personal-planner-yk5w.onrender.com/api/settings',
                    {
                        method: 'PUT',

                        credentials: 'include',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(
                                settings
                            )
                    }
                );


            const result =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    result ||
                    `Save failed: ${response.status}`
                );

            }


            // ==================================================
            // IMMEDIATE LOCAL UPDATE
            // ==================================================

            localStorage.setItem(
                'plannerSettings',
                JSON.stringify(
                    settings
                )
            );


            // ==================================================
            // IMMEDIATE THEME UPDATE
            // ==================================================

            if (
                typeof window.applyGlobalTheme ===
                'function'
            ) {

                window.applyGlobalTheme(
                    settings
                );

            }


            // ==================================================
            // NOTIFY CURRENT PAGE
            // ==================================================

            window.dispatchEvent(
                new CustomEvent(
                    'plannerSettingsChanged',
                    {
                        detail:
                            settings
                    }
                )
            );


            settingsMessage.textContent =
                'Settings saved successfully!';


            // ==================================================
            // VERIFY
            // ==================================================

            try {

                const verifyResponse =
                    await fetch(
                        'https://personal-planner-yk5w.onrender.com/api/settings',
                        {
                            method: 'GET',
                            credentials: 'include'
                        }
                    );


                if (verifyResponse.ok) {

                    const savedSettings =
                        await verifyResponse.json();


                    console.log(
                        'Verified settings:',
                        savedSettings
                    );

                }

            } catch (error) {

                console.warn(
                    'Verification error:',
                    error
                );

            }


            setTimeout(
                () => {

                    settingsMessage.textContent =
                        '';

                },
                2500
            );


        } catch (error) {

            console.error(
                'Save settings error:',
                error
            );


            settingsMessage.textContent =
                `Unable to save settings: ${error.message}`;

        } finally {

            saveSettingsButton.disabled =
                false;

        }

    }
);


// ============================================================
// LOAD SETTINGS
// ============================================================

async function loadSettings() {

    try {

        const response =
            await fetch(
                'https://personal-planner-yk5w.onrender.com/api/settings',
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load settings: ${response.status}`
            );

        }


        const settings =
            await response.json();


        // Theme

        const themeRadio =
            document.querySelector(
                `input[name="theme"][value="${settings.theme}"]`
            );


        if (themeRadio) {

            themeRadio.checked =
                true;

        }


        // Background

        const backgroundRadio =
            document.querySelector(
                `input[name="backgroundType"][value="${settings.background_type}"]`
            );


        if (backgroundRadio) {

            backgroundRadio.checked =
                true;

        }


        // Color

        const backgroundColor =
            document.querySelector(
                '#backgroundColor'
            );


        if (backgroundColor) {

            backgroundColor.value =
                settings.background_color ||
                '#f4f5f7';

        }


        // Image

        const backgroundImage =
            document.querySelector(
                '#backgroundImage'
            );


        if (backgroundImage) {

            backgroundImage.value =
                settings.background_image ||
                '';

        }


        // Modules

        document.querySelector(
            '#showPlanner'
        ).checked =
            Number(
                settings.show_planner
            ) === 1;


        document.querySelector(
            '#showJobTracker'
        ).checked =
            Number(
                settings.show_job_tracker
            ) === 1;


        document.querySelector(
            '#showDailyPlanner'
        ).checked =
            Number(
                settings.show_daily_planner
            ) === 1;


        document.querySelector(
            '#showGoals'
        ).checked =
            Number(
                settings.show_goals
            ) === 1;


        updateBackgroundOptions();


        // Apply immediately

        if (
            typeof window.applyGlobalTheme ===
            'function'
        ) {

            window.applyGlobalTheme(
                settings
            );

        }

    } catch (error) {

        console.error(
            'Load settings error:',
            error
        );


        if (settingsMessage) {

            settingsMessage.textContent =
                'Unable to load settings.';

        }

    }

}


loadSettings();