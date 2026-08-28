// ============================================================
// REGISTER
// ============================================================


// ============================================================
// CHECK EXISTING SESSION
// ============================================================

async function checkExistingSession() {

    try {

        const response =
            await fetch(
                'https://personal-planner-yk5w.onrender.com/api/users/me',
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );


        if (response.ok) {

            // User is already logged in.
            // Send them directly to the dashboard.

            window.location.href =
                '/dashboard.html';

            return true;

        }

    }
    catch (error) {

        console.log(
            'No active session.'
        );

    }


    return false;

}


// ============================================================
// RUN SESSION CHECK FIRST
// ============================================================

checkExistingSession();


// ============================================================
// DOM ELEMENTS
// ============================================================

const registerForm =
    document.querySelector(
        '#registerForm'
    );


const nameInput =
    document.querySelector(
        '#name'
    );


const emailInput =
    document.querySelector(
        '#email'
    );


const passwordInput =
    document.querySelector(
        '#password'
    );


const confirmPasswordInput =
    document.querySelector(
        '#confirmPassword'
    );


const registerButton =
    document.querySelector(
        '#registerButton'
    );


const registerError =
    document.querySelector(
        '#registerError'
    );


const registerSuccess =
    document.querySelector(
        '#registerSuccess'
    );


// ============================================================
// REGISTER
// ============================================================

registerForm.addEventListener(
    'submit',
    async event => {

        event.preventDefault();


        registerError.textContent =
            '';


        registerSuccess.textContent =
            '';


        const name =
            nameInput.value.trim();


        const email =
            emailInput.value.trim();


        const password =
            passwordInput.value;


        const confirmPassword =
            confirmPasswordInput.value;


        // ========================================================
        // VALIDATION
        // ========================================================

        if (!name) {

            registerError.textContent =
                'Please enter your name.';

            return;

        }


        if (!email) {

            registerError.textContent =
                'Please enter your email.';

            return;

        }


        if (
            password.length < 6
        ) {

            registerError.textContent =
                'Password must be at least 6 characters.';

            return;

        }


        if (
            password !==
            confirmPassword
        ) {

            registerError.textContent =
                'Passwords do not match.';

            return;

        }


        // ========================================================
        // LOADING
        // ========================================================

        registerButton.disabled =
            true;


        registerButton.textContent =
            'Creating account...';


        try {

            const response =
                await fetch(
                    'https://personal-planner-yk5w.onrender.com/api/users/register',
                    {
                        method: 'POST',

                        credentials: 'include',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify({

                                name,

                                email,

                                password

                            })
                    }
                );


            const result =
                await response.text();


            // ====================================================
            // ERROR
            // ====================================================

            if (!response.ok) {

                registerError.textContent =
                    result ||
                    'Registration failed.';

                return;

            }


            // ====================================================
            // SUCCESS
            // ====================================================

            registerSuccess.textContent =
                'Registration successful! Redirecting to login...';


            registerForm.reset();


            setTimeout(
                () => {

                    window.location.href =
                        '/login.html?registered=1';

                },
                1200
            );

        }
        catch (error) {

            console.error(
                'Registration error:',
                error
            );


            registerError.textContent =
                'Unable to connect to the server.';

        }
        finally {

            registerButton.disabled =
                false;


            registerButton.textContent =
                'Create Account';

        }

    }
);