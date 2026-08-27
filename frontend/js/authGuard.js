// ============================================================
// AUTH GUARD
// ============================================================

(async function () {

    try {

        const response =
            await fetch(
                'http://127.0.0.1:3000/api/users/me',
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