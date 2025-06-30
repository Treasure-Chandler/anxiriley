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

    let tempObject, userRole, userName, storedStudentInfo, studentID, teacherID, storedTeacherInfo, firstTimeSigningIn,
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

    /**
     * Checks if the user's name is valid
     * @param {string} name     User's name
     * @returns                 Validity
     */
    function isValidFullName(name) {
        const trimmed = name.trim();
        return /^[A-Za-z]+ [A-Za-z]+$/.test(trimmed);
    }

    // Events for signing up
    document.getElementById('suButton').addEventListener('click', function () {
        /* Custom alert events section */
        // If one or more of the fields are empty
        if ((!document.getElementById('name').value) || (!document.getElementById('signUpEmail').value)
            || (!document.getElementById('signUpPassword').value)) {
            credAlert.showModal();
            return;
        } else {
            // User's name validity
            if (!isValidFullName(document.getElementById('name').value)) {
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

            // If the password is too weak
            if (!strongPasswordRegex.test(document.getElementById('signUpPassword').value)) {
                nonStrongPasswordAlert.showModal();
                return;
            }
        }
        /* End of custom alert events section */

        // Declare and store the user role for future login
        // userRole = document.getElementById('isTeacher').checked ? "Teacher" : "Student";
        // localStorage.setItem("userRole", userRole);

        // Signing up with Firebase
        firebase.auth().createUserWithEmailAndPassword(document.getElementById('signUpEmail').value,
                                                        document.getElementById('signUpPassword').value)
        .then((userCredential) => {
            // Initialize the user ID
            const uid = userCredential.user.uid;

            if (document.getElementById('isStudent').checked) {
                studentID = uid;
            } else if (document.getElementById('isTeacher').checked) {
                teacherID = uid;
            }
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
    // document.getElementById('liButton').addEventListener('click', function () {
    //     // Toggle persistent log in
    //     let keepMeLoggedIn = document.getElementById('stayLoggedIn').checked;

    //     /* Custom alert events section */
    //     // If one or both of the fields are empty
    //     if ((!document.getElementById('logInEmail').value) || (!document.getElementById('logInPassword').value)) {
    //         credAlert.showModal();
    //         return;
    //     } else {
    //         // If the email does not contain the correct email address upon logging in
    //         if (!document.getElementById('logInEmail').value.includes("@gmail.com")) {
    //             emailAlert.showModal();
    //             return;
    //         }
    //     }
    //     /* End of custom alert events section */

    //     // Remember details if it is toggled
    //     if (keepMeLoggedIn) {
    //         if (userRole == "Student") {
    //             storedStudentInfo = {
    //                 email: document.getElementById('logInEmail').value,
    //                 password: document.getElementById('logInPassword').value
    //             }

    //             localStorage.setItem("studentEmail", storedStudentInfo.email);
    //             localStorage.setItem("studentPassword", storedStudentInfo.password);
    //         } else if (userRole == "Teacher") {
    //             storedTeacherInfo = {
    //                 email: document.getElementById('logInEmail').value,
    //                 password: document.getElementById('logInPassword').value
    //             }

    //             localStorage.setItem("teacherEmail", storedTeacherInfo.email);
    //             localStorage.setItem("teacherPassword", storedTeacherInfo.password);
    //         }
    //     }

    //     // Logging in with Firebase
    //     firebase.auth().signInWithEmailAndPassword(document.getElementById('logInEmail').value,
    //                                                 document.getElementById('logInPassword').value)
    //         .then(() => {
    //             localStorage.setItem("userRole", userRole);

    //             // Save to localStorage if "Keep me logged in" is checked
    //             if (keepMeLoggedIn) {
    //                 if (userRole === "Student") {
    //                     localStorage.setItem("studentEmail", document.getElementById('logInEmail').value);
    //                     localStorage.setItem("studentPassword", document.getElementById('logInPassword').value);
    //                 } else if (userRole === "Teacher") {
    //                     localStorage.setItem("teacherEmail", document.getElementById('logInEmail').value);
    //                     localStorage.setItem("teacherPassword", document.getElementById('logInPassword').value);
    //                 }
    //             }

    //             // Redirect to the home screen
    //             alert("success");
    //         })
    //         .catch((error) => {
    //             // Log any Firebase errors
    //             if (error.code === 'auth/user-not-found') {
    //                 // If the email is not used
    //                 unusedEmailAlert.showModal();
    //                 return;
    //             } else if (error.code === 'auth/wrong-password') {
    //                 // If the password is incorrect
    //                 passwordAlert.showModal();
    //                 return;
    //             }
    //         });
    // });

    // // Automatically redirect to the home screen if details are remembered
    // firebase.auth().onAuthStateChanged(function(user) {
    //     console.log("onAuthStateChanged triggered", user);

    //     if (user) {
    //         console.log("User is logged in:", user);
    //         let firebaseUID = user.uid;

    //         // Get persisted login info
    //         const storedRole = localStorage.getItem("userRole");
    //         let storedEmail, storedPassword;

    //         if (storedRole === "Student") {
    //             storedEmail = localStorage.getItem("studentEmail");
    //             storedPassword = localStorage.getItem("studentPassword");
    //         } else if (storedRole === "Teacher") {
    //             storedEmail = localStorage.getItem("teacherEmail");
    //             storedPassword = localStorage.getItem("teacherPassword");
    //         }

    //         console.log("Stored role:", storedRole);
    //         console.log("Stored email:", storedEmail);
    //         console.log("Stored password:", storedPassword);

    //         if (storedRole === "Student" && storedEmail && storedPassword) {
    //             fetch("https://script.google.com/macros/s/AKfycbw933FT1M7rC7oTnpzr5oKPNoy7H54iZ1JbB1ra8QDKIBRaQaAwOuBvWv9Xvgtqt-dn-w/exec")
    //                 .then(res => {
    //                 console.log("Got response:", res);
    //                 return res.text(); // test if we even get a body
    //                 })
    //                 .then(text => {
    //                 console.log("Raw response text:", text);
    //                 try {
    //                     const json = JSON.parse(text);
    //                     console.log("Parsed JSON:", json);
    //                 } catch (e) {
    //                     console.error("Could not parse JSON", e);
    //                 }
    //                 })
    //                 .catch(err => {
    //                 console.error("Top-level fetch error:", err);
    //                 })
    //                 .then(data => {
    //                     const relevantRows = data.slice(2);
    //                     console.log("Fetched data:", data);
    //                     console.log("Firebase UID:", firebaseUID);
    //                     console.log("Relevant rows:", relevantRows);

    //                     relevantRows.forEach(student => {
    //                         console.log("Student ID in row:", student["Student ID"]);
    //                     });


    //                     tempObject = relevantRows.find(student => student["Student ID"] === firebaseUID);

    //                     console.log("Does this match?", student["Student ID"] === firebaseUID);

    //                     if (!tempObject) {
    //                         console.warn("No matching student found for UID:", firebaseUID);
    //                         return;
    //                     }


    //                     if (tempObject) {
    //                         userName = tempObject["Student Name"];
    //                         numOfStudentClasses = tempObject["Number of Classes"];
    //                         langPref = tempObject["Language Preference"];

    //                         location.href = 'confirmation.html';
    //                     } else {
    //                         console.warn("No matching student found");
    //                     }
    //                 })
    //                 .catch(err => {
    //                     console.error("Fetch error (caught):", err);
    //                 });
    //         }
    //     } else {
    //         console.log("No user is logged in");
    //     }
    // });
});