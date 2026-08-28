// ============================================================
// AUTH GUARD
// ============================================================

(async function () {

    try {

        const response =
            await fetch(
                'https://personal-planner-yk5w.onrender.com/api/users/me',
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );


        // ========================================================
        // USER IS NOT LOGGED IN
        // ========================================================

        if (!response.ok) {

            window.location.replace(
                '/login.html'
            );

            return;

        }


        // ========================================================
        // USER IS LOGGED IN
        // ========================================================

        const user =
            await response.json();


        console.log(
            'Authenticated user:',
            user
        );

    }
    catch (error) {

        console.error(
            'Authentication check failed:',
            error
        );


        window.location.replace(
            '/login.html'
        );

    }

})();