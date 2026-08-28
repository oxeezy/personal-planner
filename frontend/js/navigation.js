// ============================================================
// GLOBAL NAVIGATION
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {

        // ========================================================
        // SIDEBAR NAVIGATION
        // ========================================================

        const navigationMap = {

            'Dashboard':
                '/dashboard.html',

            'Planner':
                '/planner.html',

            'Daily Planner':
                '/dailyplanner.html',

            'Job Tracker':
                '/jobtracker.html',

            'Goals':
                '/goals.html',

            'Settings':
                '/settings.html'

        };


        // ========================================================
        // FIND ALL NAV ITEMS
        // ========================================================

        const navItems =
            document.querySelectorAll(
                '.sidebar .nav-item'
            );


        navItems.forEach(
            link => {

                /*
                    Logout is a button, so don't treat it
                    as a normal navigation link.
                */

                if (
                    link.id === 'logout'
                ) {

                    return;

                }


                const text =
                    link.textContent
                        .trim()
                        .replace(
                            /\s+/g,
                            ' '
                        );


                const destination =
                    navigationMap[text];


                if (!destination) {

                    return;

                }


                // ==================================================
                // FORCE CORRECT URL
                // ==================================================

                link.setAttribute(
                    'href',
                    destination
                );


                // ==================================================
                // REMOVE OLD CLICK HANDLERS
                // ==================================================

                /*
                    We intentionally do NOT call preventDefault().
                    The browser should perform normal navigation.
                */

                link.onclick = null;

            }
        );


        // ========================================================
        // ACTIVE NAV ITEM
        // ========================================================

        const currentPath =
            window.location.pathname
                .toLowerCase();


        navItems.forEach(
            link => {

                if (
                    link.id === 'logout'
                ) {

                    return;

                }


                const href =
                    link.getAttribute(
                        'href'
                    );


                if (!href) {

                    return;

                }


                const normalizedHref =
                    href
                        .split('?')[0]
                        .split('#')[0]
                        .toLowerCase();


                const normalizedCurrent =
                    currentPath
                        .split('?')[0]
                        .split('#')[0];


                link.classList.remove(
                    'active'
                );


                if (
                    normalizedHref ===
                    normalizedCurrent
                ) {

                    link.classList.add(
                        'active'
                    );

                }

            }
        );


        // ========================================================
        // LOGOUT
        // ========================================================

        const logoutButton =
            document.querySelector(
                '#logout'
            );


        if (
            logoutButton &&
            !logoutButton.dataset.navigationBound
        ) {

            logoutButton.dataset.navigationBound =
                'true';


            logoutButton.addEventListener(
                'click',
                async event => {

                    event.preventDefault();


                    try {

                        const response =
                            await fetch(
                                'https://personal-planner-yk5w.onrender.com/api/users/logout',
                                {
                                    method:
                                        'POST',

                                    credentials:
                                        'include'
                                }
                            );


                        const result =
                            await response.text();


                        console.log(
                            'Logout status:',
                            response.status
                        );


                        console.log(
                            'Logout result:',
                            result
                        );


                        if (!response.ok) {

                            throw new Error(
                                result ||
                                `Logout failed: ${response.status}`
                            );

                        }


                        // ==================================================
                        // CLEAR LOCAL THEME CACHE
                        // ==================================================

                        localStorage.removeItem(
                            'plannerSettings'
                        );


                        localStorage.removeItem(
                            'plannerServerSettings'
                        );


                        // ==================================================
                        // GO TO LOGIN
                        // ==================================================

                        window.location.href =
                            '/login.html';


                    }
                    catch (error) {

                        console.error(
                            'Logout error:',
                            error
                        );


                        alert(
                            'Unable to logout.'
                        );

                    }

                }
            );

        }

    }
);