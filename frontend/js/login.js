// ============================================================
// LOGIN
// ============================================================


const loginForm =
    document.querySelector(
        '#loginForm'
    );


const emailInput =
    document.querySelector(
        '#email'
    );


const passwordInput =
    document.querySelector(
        '#password'
    );


const loginButton =
    document.querySelector(
        '#loginButton'
    );


const loginError =
    document.querySelector(
        '#loginError'
    );


// ============================================================
// CHECK IF ALREADY LOGGED IN
// ============================================================

async function checkExistingSession() {

    try {

        const response =
            await fetch(
                'http://127.0.0.1:3000/api/users/me',
                {
                    method: 'GET',

                    credentials: 'include'
                }
            );


        if (
            response.ok
        ) {

            window.location.href =
                '/dashboard.html';

        }

    }
    catch (
        error
    ) {

        console.log(
            'No active session'
        );

    }

}


checkExistingSession();


// ============================================================
// LOGIN
// ============================================================

loginForm.addEventListener(
    'submit',
    async event => {

        event.preventDefault();


        loginError.textContent =
            '';


        const email =
            emailInput.value.trim();


        const password =
            passwordInput.value;


        // ========================================================
        // VALIDATION
        // ========================================================

        if (!email) {

            loginError.textContent =
                'Please enter your email.';

            return;

        }


        if (!password) {

            loginError.textContent =
                'Please enter your password.';

            return;

        }


        // ========================================================
        // LOADING
        // ========================================================

        loginButton.disabled =
            true;


        loginButton.textContent =
            'Logging in...';


        try {

            const response =
                await fetch(
                    'http://127.0.0.1:3000/api/users/login',
                    {
                        method: 'POST',

                        credentials: 'include',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify({

                                email,

                                password

                            })
                    }
                );


            const contentType =
                response.headers.get(
                    'content-type'
                );


            let result;


            if (
                contentType &&
                contentType.includes(
                    'application/json'
                )
            ) {

                result =
                    await response.json();

            }
            else {

                result =
                    await response.text();

            }


            // ====================================================
            // ERROR
            // ====================================================

            if (!response.ok) {

                loginError.textContent =
                    typeof result === 'string'
                        ? result
                        : 'Login failed.';

                return;

            }


            // ====================================================
            // SUCCESS
            // ====================================================

            console.log(
                'Logged in user:',
                result
            );


            window.location.href =
                '/dashboard.html';

        }
        catch (
            error
        ) {

            console.error(
                'Login error:',
                error
            );


            loginError.textContent =
                'Unable to connect to the server.';

        }
        finally {

            loginButton.disabled =
                false;


            loginButton.textContent =
                'Login';

        }

    }
);