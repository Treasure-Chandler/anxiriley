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

    let tempObject, userRole, userName, storedStudentInfo, studentID, teacherID, storedTeacherInfo,
        firstTimeSigningInTour, numOfStudentClasses, numOfTeacherClasses, langPref, signedInLang;

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
     * 
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

        // Signing up with Firebase
        firebase.auth().createUserWithEmailAndPassword(document.getElementById('signUpEmail').value,
                                                        document.getElementById('signUpPassword').value)
        .then((userCredential) => {
            // Initialize the user
            const user = userCredential.user;

            // Declare and store the user role for future login
            userRole = document.getElementById('isTeacher').checked ? "Teacher" : "Student";
            localStorage.setItem("userRole", userRole);

            // Declare and store the user name for future login
            userName = document.getElementById('name').value;
            localStorage.setItem("userName", userName);

            // Send verification email
            user.sendEmailVerification().then(() => {
                // Redirect to the confirmation page
                location.href = "confirmation.html";
            });
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

    /**
     * Returns the user's name from the corresponding Google Sheet
     * 
     * @param {string} firebaseUID      User ID
     * @param {string} userRole         User's role
     * @returns                         User's name
     */
    async function fetchUserName(firebaseUID, userRole) {
        const userSheetURL = "https://script.google.com/macros/s/AKfycbzevWfE_vLX-WYH6SvgNsQlEpZ2qIJao3-p4AE5bEdc9pFMqyZQSowOQFmWbLiRwhhiQQ/exec";

        try {
            const response = await fetch(`${userSheetURL}?role=${userRole}`);
            const data = await response.json();

            const idKey = userRole === "Teacher" ? "Teacher ID" : "Student ID";
            const nameKey = userRole === "Teacher" ? "Teacher Name" : "Student Name";

            const matchingEntry = data.find(entry => entry[idKey] === firebaseUID);

            if (matchingEntry) {
                return matchingEntry[nameKey];
            } else {
                console.warn(`User ID not found in ${userRole} data.`);
                return null;
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            return null;
        }
    }

    /**
     * Returns the user's amount of classes from the corresponding Google Sheet
     * 
     * @param {string} firebaseUID      User ID
     * @param {string} userRole         User's role
     * @returns                         User's class amount
     */
    async function fetchClassAmount(firebaseUID, userRole) {
        const userSheetURL = "https://script.google.com/macros/s/AKfycbzevWfE_vLX-WYH6SvgNsQlEpZ2qIJao3-p4AE5bEdc9pFMqyZQSowOQFmWbLiRwhhiQQ/exec";

        try {
            const response = await fetch(`${userSheetURL}?role=${userRole}`);
            const data = await response.json();

            const idKey = userRole === "Teacher" ? "Teacher ID" : "Student ID";
            const numClassesKey = "Number of Classes";

            const matchingEntry = data.find(entry => entry[idKey] === firebaseUID);

            if (matchingEntry) {
                return matchingEntry[numClassesKey];
            } else {
                console.warn(`User ID not found in ${userRole} data.`);
                return null;
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            return null;
        }
    }

    /**
     * Returns the user's language preference from the corresponding Google Sheet
     * 
     * @param {string} firebaseUID      User ID
     * @param {string} userRole         User's role
     * @returns                         User's language preference
     */
    async function fetchLangPref(firebaseUID, userRole) {
        const userSheetURL = "https://script.google.com/macros/s/AKfycbzevWfE_vLX-WYH6SvgNsQlEpZ2qIJao3-p4AE5bEdc9pFMqyZQSowOQFmWbLiRwhhiQQ/exec";

        try {
            const response = await fetch(`${userSheetURL}?role=${userRole}`);
            const data = await response.json();

            const idKey = userRole === "Teacher" ? "Teacher ID" : "Student ID";
            const langKey = "Language Preference";

            const matchingEntry = data.find(entry => entry[idKey] === firebaseUID);

            if (matchingEntry) {
                return matchingEntry[langKey];
            } else {
                console.warn(`User ID not found in ${userRole} data.`);
                return null;
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            return null;
        }
    }

    /**
     * Returns the user's role depending on where their ID is located
     * 
     * @param {string} firebaseUID                  User's ID
     * @returns                                     User's role
     */
    async function fetchUserRole(firebaseUID) {
        const userSheetURL = "https://script.google.com/macros/s/AKfycbzevWfE_vLX-WYH6SvgNsQlEpZ2qIJao3-p4AE5bEdc9pFMqyZQSowOQFmWbLiRwhhiQQ/exec";

        try {
            const [studentRes, teacherRes] = await Promise.all([
                fetch(`${userSheetURL}?role=Student`).then(res => res.json()),
                fetch(`${userSheetURL}?role=Teacher`).then(res => res.json())
            ]);

            const isStudent = studentRes.some(entry => entry["Student ID"] === firebaseUID);
            if (isStudent) return "Student";

            const isTeacher = teacherRes.some(entry => entry["Teacher ID"] === firebaseUID);
            if (isTeacher) return "Teacher";

            return null;
        } catch (err) {
            console.error("Error fetching user role:", err);
            return null;
        }
    }

    // Events for logging in
    document.getElementById('liButton').addEventListener('click', function () {
        // Toggle persistent log in
        let keepMeLoggedIn = document.getElementById('stayLoggedIn').checked;

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
        const persistence = keepMeLoggedIn
                            ? firebase.auth.Auth.Persistence.LOCAL    // LOCAL stays after the tab closes
                            : firebase.auth.Auth.Persistence.SESSION; // SESSION clears when the tab closes

        // Logging in with Firebase
        firebase.auth().setPersistence(persistence)
            .then(() => {
                return firebase.auth().signInWithEmailAndPassword(document.getElementById('logInEmail').value,
                                                                    document.getElementById('logInPassword').value)
            })
            .then(() => {
                // Optional for the user: store the role and email
                if (userRole === "Student") {
                    storedStudentInfo = {
                        role: userRole,
                        email: document.getElementById('logInEmail').value
                    };
                } else if (userRole === "Teacher") {
                    storedTeacherInfo = {
                        role: userRole,
                        email: document.getElementById('logInEmail').value
                    };
                }

                // Retrieve the user name and user role from local storage
                userRole = localStorage.getItem("userRole");
                userName = localStorage.getItem("userName");

                // Role dependent conditionals
                if (userRole === "Student") {
                    // Set the user's ID
                    studentID = firebase.auth().currentUser.uid;

                    // Add user's data to the User and Class Data sheets
                    const userSheetURL = "https://script.google.com/macros/s/AKfycbztTCULNWyZ35_yJKWUqFYGXCIIvThW9XS5D1rrdHqa2eo622rH5RbO_MLRk-pWTWbQ/exec";

                    fetch(`${userSheetURL}?role=${userRole}`)
                        .then(res => {
                            if (!res.ok) {
                                throw new Error(`HTTP error! Status: ${res.status}`);
                            }
                            return res.json();
                        })
                        .then(data => {
                            // Check if user already exists in User Data sheet
                            const exists = data.some(entry => entry[`${userRole} ID`] === studentID);
                            if (!exists) {
                                // If not, first, add to User Data
                                fetch(userSheetURL, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        role: userRole,
                                        name: userName,
                                        email: document.getElementById('logInEmail').value,
                                        uid: studentID
                                    })
                                });

                                // Then, add to Class Data
                                const classSheetURL = "https://script.google.com/macros/s/AKfycbw4uDIl9vojIWutYF08QEQvJAXklzzNHu1rRBItaS_q06I9OmOyOCBujTzLU-in794R8w/exec";
                                fetch(classSheetURL, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        role: userRole,
                                        action: "addToClassSheet",
                                        userID: studentID,
                                        inboxCount: 0,
                                        class1: "x",
                                        class2: "x",
                                        class3: "x",
                                        class4: "x",
                                        class5: "x",
                                        class6: "x",
                                        class7: "x",
                                    })
                                });

                                // TODO: Then, navigate to home
                                location.href = 'confirmation.html';
                            } else {
                                // Fetch the user's name
                                fetchUserName(studentID, "Student");

                                // Set user's number of classes
                                numOfStudentClasses = fetchClassAmount(studentID, "Student");

                                // Set user's language preference
                                langPref = fetchLangPref(studentID, "Student");

                                // Set user's role
                                userRole = fetchUserRole(studentID);

                                // Set signedInLang
                                signedInLang = true;

                                // Store the info if they want it stored
                                if (keepMeLoggedIn) {
                                    localStorage.setItem("studentInfo", JSON.stringify(storedStudentInfo));
                                } else {
                                    localStorage.removeItem("studentInfo");
                                }

                                // TODO: Navigate to home
                                location.href = 'confirmation.html';
                            }
                        });
                } else if (userRole === "Teacher") {
                    // Set the user's ID
                    teacherID = firebase.auth().currentUser.uid;

                    // Add user's data to the User and Class Data sheets
                    const userSheetURL = "https://script.google.com/macros/s/AKfycbztTCULNWyZ35_yJKWUqFYGXCIIvThW9XS5D1rrdHqa2eo622rH5RbO_MLRk-pWTWbQ/exec";

                    fetch(`${userSheetURL}?role=${userRole}`)
                        .then(res => {
                            if (!res.ok) {
                                throw new Error(`HTTP error! Status: ${res.status}`);
                            }
                            return res.json();
                        })
                        .then(data => {
                            // Check if user already exists in User Data sheet
                            const exists = data.some(entry => entry[`${userRole} ID`] === teacherID);
                            if (!exists) {
                                // If not, first, add to User Data
                                fetch(userSheetURL, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        role: userRole,
                                        name: userName,
                                        email: document.getElementById('logInEmail').value,
                                        uid: teacherID
                                    })
                                });

                                // Then, add to Class Data
                                const classSheetURL = "https://script.google.com/macros/s/AKfycbw4uDIl9vojIWutYF08QEQvJAXklzzNHu1rRBItaS_q06I9OmOyOCBujTzLU-in794R8w/exec";
                                fetch(classSheetURL, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        role: userRole,
                                        action: "addToClassSheet",
                                        userID: teacherID,
                                        inboxCount: 0,
                                        class1: "x",
                                        class2: "x",
                                        class3: "x",
                                        class4: "x",
                                        class5: "x",
                                        class6: "x",
                                        class7: "x",
                                    })
                                });

                                // TODO: Then, navigate to home
                                location.href = 'confirmation.html';
                            } else {
                                // Fetch the user's name
                                fetchUserName(teacherID, "Teacher");

                                // Set user's number of classes
                                numOfStudentClasses = fetchClassAmount(teacherID, "Teacher");

                                // Set user's language preference
                                langPref = fetchLangPref(teacherID, "Teacher");

                                // Set user's role
                                userRole = fetchUserRole(teacherID);

                                // Set signedInLang
                                signedInLang = true;

                                // Store the info if they want it stored
                                if (keepMeLoggedIn) {
                                    localStorage.setItem("teacherInfo", JSON.stringify(storedTeacherInfo));
                                } else {
                                    localStorage.removeItem("teacherInfo");
                                }

                                // TODO: Navigate to home
                                location.href = 'confirmation.html';
                            }
                        });
                }            
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
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            // Check if their email is verified
            if (user.emailVerified) {
                // Navigate to home page or dashboard
                window.location.href = "home.html";
            } else {
                // Force email verification before redirecting
                user.sendEmailVerification().then(() => {
                    // Redirect to the confirmation page
                    location.href = "confirmation.html";
                });
            }
        } else {
            // No user is signed in, stay on login
            console.log("No user is currently signed in.");
        }
    });
});