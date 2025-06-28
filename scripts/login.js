/**
 * @author Treasure Chandler
 * 
 * This allows full functionality of the login page, which includes Gmail authentation and Firebase integration
 * for account handling.
 */

// When the page is loaded, execute these events
document.addEventListener("DOMContentLoaded", function () {
    // Declaring variables
    const nameAlert = document.getElementById('nameAlert');
    const stuEmailAlert = document.getElementById('stuEmailAlert');
    const teaEmailAlert = document.getElementById('teaEmailAlert');
    const credAlert = document.getElementById('credIssues');
    const dupeEmailAlert = document.getElementById('duplicateEmailAlert');
    const noOptionAlert = document.getElementById('noRadioCheckedAlert');
    const nonStrongPasswordAlert = document.getElementById('weakPasswordAlert');
    const emailAlert = document.getElementById('emailAlert');
    const passwordAlert = document.getElementById('incorrectPasswordAlert');
    const unusedEmailAlert = document.getElementById('emailNotUsedAlert');

    let tempObject = {};
    let userRole, storedStudentInfo, studentID, teacherID, storedTeacherInfo, firstTimeSigningIn,
        firstTimeSigningInTour, numOfStudentClasses, numOfTeacherClasses, langPref;

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    document.getElementById('confirm').addEventListener('click', function () {
        // window.location.replace("confirmation.html");
        location.href = 'confirmation.html';
    });

    // Show sign up form and overlay when the sign up button is clicked
    document.getElementById('signUpButton').addEventListener('click', function () {
        const signUpForm = document.getElementById('signUp');
        const blackOverlay = document.getElementById('black-overlay');

        // Give the black overlay a transition
        blackOverlay.style.transition = 'opacity 0.6s ease';
        blackOverlay.style.opacity = 0;
        blackOverlay.style.visibility = 'visible';
        blackOverlay.style.pointerEvents = 'auto';

        // Force a reflow to register initial opacity before changing it
        void blackOverlay.offsetWidth;

        // Fade in the black overlay
        blackOverlay.style.opacity = 1;

        // Show and transition the log in form
        signUpForm.style.display = 'block';
        signUpForm.style.transition = 'opacity 0.6s ease';
        signUpForm.style.opacity = 0;
        signUpForm.style.visibility = 'visible';

        // Force a reflow for login form as well
        void signUpForm.offsetWidth;

        // Fade in the log in form
        signUpForm.style.opacity = 1;
    });

    // Close the sign up form and hide the overlay when the "X" button is clicked
    document.getElementById('closeSignUpButton').addEventListener('click', function () {
        const signUpForm = document.getElementById('signUp');
        const blackOverlay = document.getElementById('black-overlay');

        // Start a fade-out transition
        blackOverlay.style.opacity = 0;
        signUpForm.style.opacity = 0;

        // Wait for transition to finish before hiding elements
        setTimeout(() => {
            blackOverlay.style.visibility = 'hidden';
            blackOverlay.style.pointerEvents = 'none';
            signUpForm.style.visibility = 'hidden';
            signUpForm.style.display = 'none';
        }, 600);
    });

    // Show log in form and overlay when the log in button is clicked
    document.getElementById('logInButton').addEventListener('click', function () {
        const logInForm = document.getElementById('logIn');
        const blackOverlay = document.getElementById('black-overlay');

        // Give the black overlay a transition
        blackOverlay.style.transition = 'opacity 0.6s ease';
        blackOverlay.style.opacity = 0;
        blackOverlay.style.visibility = 'visible';
        blackOverlay.style.pointerEvents = 'auto';

        // Force a reflow to register initial opacity before changing it
        void blackOverlay.offsetWidth;

        // Fade in the black overlay
        blackOverlay.style.opacity = 1;

        // Show and transition the log in form
        logInForm.style.display = 'block';
        logInForm.style.transition = 'opacity 0.6s ease';
        logInForm.style.opacity = 0;
        logInForm.style.visibility = 'visible';

        // Force a reflow for login form as well
        void logInForm.offsetWidth;

        // Fade in the log in form
        logInForm.style.opacity = 1;
    });

    // Close the log in form and hide the overlay when the "X" button is clicked
    document.getElementById('closeLogInButton').addEventListener('click', function () {
        const logInForm = document.getElementById('logIn');
        const blackOverlay = document.getElementById('black-overlay');

        // Start a fade-out transition
        blackOverlay.style.opacity = 0;
        logInForm.style.opacity = 0;

        // Wait for transition to finish before hiding elements
        setTimeout(() => {
            blackOverlay.style.visibility = 'hidden';
            blackOverlay.style.pointerEvents = 'none';
            logInForm.style.visibility = 'hidden';
            logInForm.style.display = 'none';
        }, 600);
    });

    // When the "Forgot Password?" button is clicked, open the forgot password popup
    document.getElementById('forgotPasswordButton').addEventListener('click', function (event) {
        const logInForm = document.getElementById('logIn');
        const forgotPasswordForm = document.getElementById('forgotPassword');

        event.preventDefault();

        // Show and transition the log in form
        forgotPasswordForm.style.display = 'block';
        forgotPasswordForm.style.transition = 'opacity 0.6s ease';
        forgotPasswordForm.style.opacity = 0;
        forgotPasswordForm.style.visibility = 'visible';

        // Force a reflow for login form as well
        void forgotPasswordForm.offsetWidth;

        // Fade in the log in form
        forgotPasswordForm.style.opacity = 1;

        // Hide the log in form
        logInForm.style.opacity = 0;
        logInForm.style.visibility = 'hidden';
    });

    // Close the forgot password form and hide the overlay when the "X" button is clicked
    document.getElementById('closeForgotPasswordButton').addEventListener('click', function () {
        const logInForm = document.getElementById('logIn');
        const forgotPasswordForm = document.getElementById('forgotPassword');

        // Start a fade-out transition
        forgotPasswordForm.style.opacity = 0;

        // Wait for transition to finish before hiding elements
        setTimeout(() => {
            forgotPasswordForm.style.visibility = 'hidden';
            forgotPasswordForm.style.display = 'none';
        }, 600);

        // Then, show the log in form again
        logInForm.style.visibility = 'visible';
        logInForm.style.opacity = 1;
        logInForm.style.display = 'block';
    });

    /* 
    * The "OK" button is linked to each popup; this event listener is defined for all "OK"
    * buttons so they can close their respective popups
    */
    const okBtns = document.querySelectorAll('.ok');

    okBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const dialog = btn.closest('dialog');
            if (dialog) dialog.close();
        });
    });

    // Toggle persistent login
    let keepMeLoggedIn = document.getElementById('stayLoggedIn').checked;

    // Events for signing up
    document.getElementById('suButton').addEventListener('click', function () {
        /* Custom alert events section */
        // If one or more of the fields are empty
        if ((!document.getElementById('name').value) || (!document.getElementById('signUpEmail').value)
            || (!document.getElementById('signUpPassword').value)) {
            credAlert.showModal();
            return;
        } else {
            // If there is only one name instead of two upon signing up
            if (!document.getElementById('name').value.includes(" ")) {
                nameAlert.showModal();
                return;
            }

            // Email validation
            if ((document.getElementById('isStudent').checked &&
                (!document.getElementById('signUpEmail').value.includes("@gmail.com")))) {
                stuEmailAlert.showModal();
                return;
            } else if ((document.getElementById('isTeacher').checked &&
                        (!document.getElementById('signUpEmail').value.includes("@gmail.com")))) {
                teaEmailAlert.showModal();
                return;
            }

            // If neither radio buttons are checked
            if (!document.getElementById('isStudent').checked && !document.getElementById('isTeacher').checked) {
                noOptionAlert.showModal();
                return;
            }

            // Declare the user role
            userRole = document.getElementById('isTeacher').checked ? "Teacher" : "Student";

            // If the password is too weak
            if (!strongPasswordRegex.test(document.getElementById('signUpPassword').value)) {
                nonStrongPasswordAlert.showModal();
                return;
            }
        }
        /* End of custom alert events section */

        // Signing up with Firebase
        firebase.auth().createUserWithEmailAndPassword(document.getElementById('signUpEmail').value,
                                                        document.getElementById('signUpPassword').value)
        .then((userCredential) => {
            // Initialize the user ID
            if (document.getElementById('isStudent').checked) {
                studentID = userCredential.user.uid;
            } else {
                teacherID = userCredential.user.uid;
            }
            
            // Send data to the User Data sheet
            fetch('https://script.google.com/macros/s/AKfycbzvzKd3GMSLrqGrUiqSC9OLozPxIG4HorGrtrOkcsbPZ9lpUKm2ySWnSG1_MonaMD3mig/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: document.getElementById('name').value,
                    email: document.getElementById('signUpEmail').value,
                    uid: uid,
                    role: userRole
                })
                })

            // Redirect to the confirmation screen

        }).catch((error) => {
            // Log any Firebase errors
            if (error.code === 'auth/email-already-in-use') {
                // If the email is already in use
                dupeEmailAlert.showModal();
                return;
            } else if (error.code === 'auth/weak-password') {
                // If the password is too weak
                nonStrongPasswordAlert.showModal();
                return;
            }
        });
    });

    // Events for logging in
    document.getElementById('liButton').addEventListener('click', function () {
        /* Custom alert events section */
        // If one or both of the fields are empty
        if ((!document.getElementById('logInEmail').value) || (!document.getElementById('logInPassword').value)) {
            credAlert.showModal();
            return;
        } else {
            // If the email does not contain the correct email address upon logging in
            if (!document.getElementById('logInEmail').value.includes("@gmail.com")) {
                emailAlert.showModal();
                return;
            }
        }
        /* End of custom alert events section */

        // Remember details if it is toggled
        if (keepMeLoggedIn) {
            if (userRole == "Student") {
                storedStudentInfo = {
                    email: document.getElementById('logInEmail').value,
                    password: document.getElementById('logInPassword').value
                }
            } else if (userRole == "Teacher") {
                storedTeacherInfo = {
                    email: document.getElementById('logInEmail').value,
                    password: document.getElementById('logInPassword').value
                }
            }
        }

        // Logging in with Firebase
        firebase.auth().signInWithEmailAndPassword(document.getElementById('logInEmail').value,
                                                    document.getElementById('logInPassword').value)
            .then(() => {
                // Redirect to the home screen
                alert("success");
            })
            .catch((error) => {
                // Log any Firebase errors
                if (error.code === 'auth/user-not-found') {
                    // If the email is not used
                    unusedEmailAlert.showModal();
                    return;
                } else if (error.code === 'auth/wrong-password') {
                    // If the password is incorrect
                    passwordAlert.showModal();
                    return;
                }
            });
    });

    // Automatically redirect to the home screen if details are remembered
    if (keepMeLoggedIn) {
        if (userRole != null) {
            if (userRole == "Student") {
                if (storedStudentInfo != null) {
                    firebase.auth().signInWithEmailAndPassword(storedStudentInfo.email, storedStudentInfo.password)
                        .then((userCredential) => {
                            studentID = userCredential.user.uid;

                            firebase.auth().onAuthStateChanged((user) => {
                            if (user) {
                                const uid = user.uid;

                                fetch('https://script.google.com/macros/s/AKfycbz3Icf7pBrXesvXWPPoh43bXAAwY1M3ALeTTUJvVvYcs4Mc2s4fiovheL2YtCOLoa3d7A/exec', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    action: "getUserRow",
                                    uid: uid,
                                    role: userRole
                                })
                                })
                                .then(res => res.json())
                                .then(response => {
                                if (response.status === "success") {
                                    tempObject = response.data;
                                    console.log("Row Object:", tempObject);
                                } else {
                                    console.warn("User not found in sheet.");
                                }
                                })
                                .catch(err => console.error("Error fetching row:", err));
                            }

                            });
                        });
                }
            }
        }
    }
});