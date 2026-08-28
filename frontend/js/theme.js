const AVAILABLE_THEMES = [
    'light',
    'dark',
    'ocean',
    'forest',
    'purple',
    'midnight'
];


// ================================================================
// NORMALIZE SETTINGS
// ================================================================

function normalizeThemeSettings(settings) {

    return {

        theme:
            AVAILABLE_THEMES.includes(
                settings?.theme
            )
                ? settings.theme
                : 'light',

        backgroundType:
            settings?.backgroundType ??
            settings?.background_type ??
            'default',

        backgroundColor:
            settings?.backgroundColor ??
            settings?.background_color ??
            '#f4f5f7',

        backgroundImage:
            settings?.backgroundImage ??
            settings?.background_image ??
            ''

    };

}


// ================================================================
// GET CURRENT THEME
// ================================================================

function getCurrentThemeSettings() {

    const stored =
        localStorage.getItem(
            'plannerSettings'
        );

    if (!stored) {
        return null;
    }

    try {

        return normalizeThemeSettings(
            JSON.parse(stored)
        );

    } catch (error) {

        console.error(
            'Unable to read current theme:',
            error
        );

        return null;

    }

}


// ================================================================
// CHECK IF SETTINGS ARE DIFFERENT
// ================================================================

function themeSettingsAreDifferent(
    first,
    second
) {

    if (!first || !second) {
        return true;
    }

    return (
        first.theme !== second.theme ||
        first.backgroundType !== second.backgroundType ||
        first.backgroundColor !== second.backgroundColor ||
        first.backgroundImage !== second.backgroundImage
    );

}


// ================================================================
// APPLY GLOBAL THEME
// ================================================================

function applyGlobalTheme(
    settings,
    options = {}
) {

    const normalized =
        normalizeThemeSettings(
            settings
        );


    const force =
        options.force === true;


    const current =
        getCurrentThemeSettings();


    // ============================================================
    // DON'T RE-APPLY THE SAME THEME
    // ============================================================

    if (
        !force &&
        current &&
        !themeSettingsAreDifferent(
            current,
            normalized
        )
    ) {

        return;

    }


    // ============================================================
    // REMOVE ALL THEMES
    // ============================================================

    AVAILABLE_THEMES.forEach(
        theme => {

            document.body.classList.remove(
                `theme-${theme}`
            );

        }
    );


    // ============================================================
    // REMOVE LEGACY CLASSES
    // ============================================================

    document.body.classList.remove(
        'light-theme',
        'dark-theme'
    );


    // ============================================================
    // APPLY THEME
    // ============================================================

    document.body.classList.add(
        `theme-${normalized.theme}`
    );


    // ============================================================
    // RESET BACKGROUND
    // ============================================================

    document.body.classList.remove(
        'custom-background'
    );

    document.body.style.backgroundColor =
        '';

    document.body.style.backgroundImage =
        '';


    // ============================================================
    // CUSTOM COLOR
    // ============================================================

    if (
        normalized.backgroundType === 'color'
    ) {

        document.body.style.backgroundColor =
            normalized.backgroundColor;

    }


    // ============================================================
    // CUSTOM IMAGE
    // ============================================================

    if (
        normalized.backgroundType === 'image' &&
        normalized.backgroundImage
    ) {

        document.body.classList.add(
            'custom-background'
        );


        document.body.style.backgroundImage =
            `url("${normalized.backgroundImage}")`;

    }


    // ============================================================
    // SAVE LOCALLY
    // ============================================================

    localStorage.setItem(
        'plannerSettings',
        JSON.stringify(
            normalized
        )
    );


    // ============================================================
    // NOTIFY PAGE
    // ============================================================

    window.dispatchEvent(
        new CustomEvent(
            'plannerThemeApplied',
            {
                detail: normalized
            }
        )
    );

}


// ================================================================
// MAKE GLOBAL
// ================================================================

window.applyGlobalTheme =
    applyGlobalTheme;


// ================================================================
// APPLY LOCAL THEME
// ================================================================

function applyLocalTheme() {

    const stored =
        localStorage.getItem(
            'plannerSettings'
        );


    if (!stored) {

        return false;

    }


    try {

        const settings =
            JSON.parse(
                stored
            );


        /*
         * FORCE HERE BECAUSE THIS IS
         * THE INITIAL PAGE LOAD.
         */

        applyGlobalTheme(
            settings,
            {
                force: true
            }
        );


        return true;

    } catch (error) {

        console.error(
            'Local theme error:',
            error
        );

        return false;

    }

}


// ================================================================
// LOAD SERVER THEME
// ================================================================

async function loadServerTheme() {

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
                `Settings request failed: ${response.status}`
            );

        }


        const settings =
            await response.json();


        const normalized =
            normalizeThemeSettings(
                settings
            );


        const localSettings =
            getCurrentThemeSettings();


        // ========================================================
        // SERVER AND LOCAL ARE ALREADY THE SAME
        // ========================================================

        if (
            localSettings &&
            !themeSettingsAreDifferent(
                localSettings,
                normalized
            )
        ) {

            /*
             * Nothing needs to change.
             *
             * This is the important part that prevents
             * the theme from being visually applied twice.
             */

            return;

        }


        // ========================================================
        // SERVER HAS A DIFFERENT THEME
        // ========================================================

        applyGlobalTheme(
            normalized
        );


    } catch (error) {

        console.error(
            'Server theme error:',
            error
        );

    }

}


// ================================================================
// SETTINGS PAGE / SAVE EVENT
// ================================================================

window.addEventListener(
    'plannerSettingsChanged',
    event => {

        if (
            !event.detail
        ) {

            return;

        }


        /*
         * FORCE = TRUE
         *
         * When the user clicks Save in Settings,
         * the theme must change immediately.
         */

        applyGlobalTheme(
            event.detail,
            {
                force: true
            }
        );

    }
);


// ================================================================
// CROSS-TAB THEME CHANGES
// ================================================================

window.addEventListener(
    'storage',
    event => {

        if (
            event.key !==
            'plannerSettings'
        ) {

            return;

        }


        if (
            !event.newValue
        ) {

            return;

        }


        try {

            const settings =
                JSON.parse(
                    event.newValue
                );


            applyGlobalTheme(
                settings,
                {
                    force: true
                }
            );


        } catch (error) {

            console.error(
                'Storage theme error:',
                error
            );

        }

    }
);


// ================================================================
// START
// ================================================================

/*
 * 1. Apply saved theme immediately.
 * 2. Then verify it against the server.
 */

applyLocalTheme();

loadServerTheme();