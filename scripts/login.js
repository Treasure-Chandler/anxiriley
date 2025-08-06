/**
 * @author Treasure Chandler
 * 
 * This allows full functionality of the login page, which includes Gmail authentation and Firebase integration
 * for account handling.
 */

import {
    setNumOfStudentClasses,
    setNumOfTeacherClasses,
    setUserName,
    setUserRole,
    setLangPref,
    setSignedInLang
} from './userInfo.js';

import {
    isBrowserOnline,
    monitorConnectionStatus
} from './connectionUtils.js';

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', async function () {
    // Declaring variables
    const credAlert = document.getElementById('credIssues');
    const resetSuccess = document.getElementById('resetSuccessAlert');

    let tempObject, userRole, userName, storedStudentInfo, studentID, teacherID, storedTeacherInfo;

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

    const body = document.getElementById('background');

    // Hide page and background at first
    body.style.display = 'none';
    body.classList.add('no-background');

    /**
     * Shows sign up/log in/forgot password alerts with a specific title and message depending on the condition
     * 
     * @param {string} title        Alert title 
     * @param {string} message      Alert message
     */
    function showAlert(title, message) {
        const alert = document.getElementById('universalAlert');
        document.getElementById('universalAlertTitle').textContent = title;
        document.getElementById('universalAlertMessage').innerHTML = message.replace(/\n/g, '<br>');
        alert.showModal();
    }

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

    /**
     * Determine the user's role by their email
     * 
     * @param {string} email    User's email
     * @returns                 User's role
     */
    function inferRoleFromEmail(email) {
        if (email.includes('teacher')) return 'Teacher';
        return 'Student';
    }

    // Show/hide the loading spinner before retrieving Firestore stuff
    function showSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        spinner.classList.add('active');
    }

    function hideSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        spinner.classList.remove('active');
    }

    // Load student/teacher data
    async function loadStudentData(studentID) {
        const docRef = doc(db, "students", studentID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data["Student Name"]);
            setNumOfStudentClasses(data["Number of Classes"]);
            setLangPref(data["Language Preference"]);
            setUserRole("Student");
        }
    }

    async function loadTeacherData(teacherID) {
        const docRef = doc(db, "teachers", teacherID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data["Teacher Name"]);
            setNumOfTeacherClasses(data["Number of Classes"]);
            setLangPref(data["Language Preference"]);
            setUserRole("Teacher");
        }
    }

    // Check internet connection first
    const offline = !isBrowserOnline();

    if (offline) {
        showAlert('Offline', 'You are currently offline! Some features may not work. Please check your internet connection.');

        // Show login even if offline
        body.style.display = 'block';
        body.classList.remove('no-background');
        return;
    }

    // Alert the user if they have gone back online or if they have been disconnected
    monitorConnectionStatus(
        () => showAlert('Back Online', 'Your internet connection has been restored!'),
        () => showAlert('Disconnected', 'You have lost your internet connection.')
    );

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

    // Close the sign up form and hide the overlay when the 'X' button is clicked
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

    // When the 'Already a User?' button is clicked, open the log in form
    document.getElementById('alreadyUser').addEventListener('click', function () {
        const logInForm = document.getElementById('logIn');
        const signupForm = document.getElementById('signUp');

        // Show and transition the log in form
        logInForm.style.display = 'block';
        logInForm.style.transition = 'opacity 0.6s ease';
        logInForm.style.opacity = 0;
        logInForm.style.visibility = 'visible';

        // Force a reflow for login form as well
        void logInForm.offsetWidth;

        // Fade in the log in form
        logInForm.style.opacity = 1;

        // Hide the log in form
        signupForm.style.opacity = 0;
        signupForm.style.visibility = 'hidden';

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

    // Close the log in form and hide the overlay when the 'X' button is clicked
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

    // When the 'Forgot Password?' button is clicked, open the forgot password form
    document.getElementById('forgotPasswordButton').addEventListener('click', function (event) {
        const logInForm = document.getElementById('logIn');
        const forgotPasswordForm = document.getElementById('forgotPassword');
        const blackOverlay = document.getElementById('black-overlay');

        event.preventDefault();

        // Show and transition forgot password form
        forgotPasswordForm.style.display = 'block';
        forgotPasswordForm.style.transition = 'opacity 0.6s ease';
        forgotPasswordForm.style.opacity = 0;
        forgotPasswordForm.style.visibility = 'visible';

        // Show and activate overlay
        blackOverlay.style.visibility = 'visible';
        blackOverlay.style.pointerEvents = 'auto';

        // Force a reflow for login form as well
        void forgotPasswordForm.offsetWidth;

        // Fade in the forgot password form
        forgotPasswordForm.style.opacity = 1;

        // Hide the log in form
        logInForm.style.opacity = 0;
        logInForm.style.visibility = 'hidden';
    });

    // Close the forgot password form and hide the overlay when the 'X' button is clicked
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
    * The 'OK' button is linked to each popup; this event listener is defined for all 'OK'
    * buttons so they can close their respective popups
    */
    const okBtns = document.querySelectorAll('.ok');

    okBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const dialog = btn.closest('dialog');
            if (dialog) dialog.close();
        });
    });

    // Initialize Firestore for user data creation
    const db = getFirestore();

    // Events for signing up
    document.getElementById('suButton').addEventListener('click', function () {
        // Variable declaration
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.querySelector('input[name="role"]:checked')?.value;

        /* Custom alert events section */
        // If one or more of the fields are empty
        if (!name || !email || !password || !role) {
            credAlert.showModal();
            return;
        } else {
            // User's name validity
            if (!isValidFullName(name)) {
                showAlert('Incorrect Name', 'You must have your first AND last name!');
                return;
            }

            // Email validation
            if ((document.getElementById('isStudent').checked && !email.includes('@gmail.com'))) {
                showAlert('Incorrect Student Email', 'You must enter your student email!');
                return;
            } else if ((document.getElementById('isTeacher').checked && !email.includes('@gmail.com'))) {
                showAlert('Incorrect Teacher Email', 'You must enter your teacher email!');
                return;
            }

            // If neither radio buttons are checked
            if (!document.getElementById('isStudent').checked && !document.getElementById('isTeacher').checked) {
                showAlert('No Option Selected', 'You need to select if you are student or a teacher!');
                return;
            }

            // If the password is too weak
            if (!strongPasswordRegex.test(password)) {
                showAlert('Weak Password',
                        'You will need a stronger password with this account!\n\n' +
                        'A strong password requires at least one uppercase letter,\n' +
                        'one lowercase letter, a number, and must be at least 6\n' +
                        'characters long.');
                return;
            }
        }
        /* End of custom alert events section */

        // Signing up with Firebase and Firestore
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(() => {
                return firebase.auth().createUserWithEmailAndPassword(email, password);
            })
            .then(async (userCredential) => {
                // Initialize the user
                const user = userCredential.user;

                // Activate the tour trigger
                localStorage.setItem('firstTimeSigningInTour', 'true');

                // Declare and store user name and update Firebase profile
                const userName = document.getElementById('name').value;
                await user.updateProfile({ displayName: userName });

                // Declare and store the user role
                const userRole = document.getElementById('isTeacher').checked ? 'Teacher' : 'Student';
                localStorage.setItem('userRole', userRole);

                // Set a temporary name in the local storage for the confirmation page
                localStorage.setItem('tempUserName', name);

                // Create Firestore document using UID as document ID
                const collectionName = userRole === 'Teacher' ? 'teachers' : 'students';
                await setDoc(doc(db, collectionName, user.uid), {
                    [`${userRole} Name`]: userName,
                    [`${userRole} Email`]: email,
                    [`${userRole} ID`]: user.uid,
                    "Number of Classes": 0,
                    "Language Preference": "eng",
                    "Dark Mode": false
                });

                // Send verification email
                await user.sendEmailVerification();

                // Sign the user out immediately after sending the email
                await firebase.auth().signOut();

                // Redirect to the confirmation page
                window.location.replace('confirmation.html');
            })
            .catch((error) => {
                // Log any Firebase errors
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        // If the email is already in use
                        showAlert('Email Already Registered', 'This email is already in use! Why not try signing in?');
                        break;
                    case 'auth/invalid-email':
                        // If the email is invalid
                        showAlert('Invalid Email', 'This email address is not valid! Please enter a correct email.');
                        break;
                    case 'auth/internal-error':
                        // If there has been an internal error
                        showAlert('Error', 'Something has gone wrong! Please try again, or contact us for support.');
                        break;
                    default:
                        // If there has been any other error
                        showAlert('Error', 'Something has gone wrong! Please try again, or contact us for support.');
                        break;
                }
            });
    });

    // Events for logging in
    document.getElementById('liButton').addEventListener('click', async function () {
        // Toggle persistent log in
        let keepMeLoggedIn = document.getElementById('stayLoggedIn').checked;

        // Declare email and password values
        const email = document.getElementById('logInEmail').value;
        const password = document.getElementById('logInPassword').value;

        /* Custom alert events section */
        // If one or both of the fields are empty
        if (!email || !password) {
            credAlert.showModal();
            return;
        } else {
            // If the email does not contain the correct email address upon logging in
            if (!email.includes('@gmail.com')) {
                showAlert('Incorrect Email', 'You must enter a school email!');
                return;
            }
        }
        /* End of custom alert events section */

        // Remember details if it is toggled
        const persistence = keepMeLoggedIn
                            ? firebase.auth.Auth.Persistence.LOCAL    // LOCAL stays after the tab closes
                            : firebase.auth.Auth.Persistence.SESSION; // SESSION clears when the tab closes

        // Logging in with Firebase
        try {
            await firebase.auth().setPersistence(persistence);
            await firebase.auth().signInWithEmailAndPassword(email, password);

            // Initialize current user
            const user = firebase.auth().currentUser;

            // Check if email is verified
            if (!user.emailVerified) {
                showAlert('Unverified Email', 'You need to verify your email before logging in!');

                // Sign out unverified users
                await firebase.auth().signOut();
                return;
            }

            // Declare common values
            const userRole = localStorage.getItem('userRole') || inferRoleFromEmail(user.email);
            const uid = user.uid;

            // Hide the login popup and show the spinner before any network calls
            document.getElementById('logIn').style.display = 'none';
            showSpinner();
            await new Promise(requestAnimationFrame);

            // Firestore document check (read only)
            const collectionName = userRole === "Student" ? "students" : "teachers";
            const docRef = doc(db, collectionName, uid);
            const docSnap = await getDoc(docRef);

            // If the document does not exist, throw an error
            if (!docSnap.exists()) {
                showAlert("Account Error", "Your account data could not be found. Please contact us for support.");
                hideSpinner();
                document.getElementById('logIn').style.display = 'block';
                return;
            }

            // Load data from Firestore depending on the user's role
            if (userRole === "Student") {
                await loadStudentData(uid);
                setSignedInLang(true);
                if (keepMeLoggedIn) {
                    localStorage.setItem('studentInfo', JSON.stringify({ role: userRole, email, studentID: uid }));
                }
            } else {
                await loadTeacherData(uid);
                setSignedInLang(true);
                if (keepMeLoggedIn) {
                    localStorage.setItem('teacherInfo', JSON.stringify({ role: userRole, email, teacherID: uid }));
                }
            }

            // Finally, hide the spinner and navigate to the home screen
            hideSpinner();
            window.location.replace('home.html');
        } catch (error) {
            // Log any Firebase errors
            hideSpinner();
            document.getElementById('logIn').style.display = 'block';
            switch (error.code) {
                case 'auth/invalid-credential':
                    // If the email/password is incorrect
                    showAlert('Incorrect Credentials', 'Your email or password is incorrect, or your email does not exist.\nYou can try' +
                        ' retyping your email/password, resetting your password, or signing up if your' +
                        ' email really does not exist.');
                    break;
                case 'auth/too-many-requests':
                    // If too many requests have been made
                    showAlert('Too Many Attempts', 'There have been too many login attempts! Please try again later.');
                    break;
                case 'auth/user-disabled':
                    // If the account has been disabled
                    showAlert('Account Disabled', 'This account has been disabled! Please contact us for support.');
                    break;
                default:
                    // If there has been any other error
                    showAlert('Error', 'Something has gone wrong! Please try again, or contact us for support.');
                    break;
            }
        }
    });

    // Events for password reset
    document.getElementById('forgotPasswordForm').addEventListener('submit', function (e) {
        const blackOverlay = document.getElementById('black-overlay');

        // Prevent form submission
        e.preventDefault();

        const email = document.getElementById('resetEmail').value;

        if (!email) {
            showAlert('No Email', 'You must enter your email!');
            return;
        }

        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                // Email successfully sent
                resetSuccess.showModal();

                // Wait 3 seconds before hiding the form and alert
                setTimeout(() => {
                    const forgotPasswordForm = document.getElementById('forgotPassword');
                    const resetSuccess = document.getElementById('resetSuccessAlert');

                    // Start fading out black overlay, form, and alert
                    blackOverlay.style.opacity = 0;
                    forgotPasswordForm.style.opacity = 0;
                    resetSuccess.style.opacity = 0;

                    setTimeout(() => {
                        forgotPasswordForm.style.display = 'none';
                        forgotPasswordForm.style.visibility = 'hidden';

                        document.getElementById('resetSuccessAlert').close();

                        blackOverlay.style.visibility = 'hidden';
                        blackOverlay.style.pointerEvents = 'none';

                        resetSuccess.style.display = 'none';
                        resetSuccess.style.visibility = 'hidden';
                    }, 600);
                }, 3000);
            })
            .catch(() => {
                // Error sending the email
                showAlert('Error', 'An error has occurred. You can try retyping your email.');
                return;
            });
    });

    // Automatically redirect to the home screen if details are remembered
    firebase.auth().onAuthStateChanged(async (user) => {
        const body = document.getElementById('background');

        // User is signed in, along with checking for a verified email
        if (user && user.emailVerified) {
            const studentInfoStr = localStorage.getItem('studentInfo');
            const teacherInfoStr = localStorage.getItem('teacherInfo');

            const storedStudentInfo = studentInfoStr ? JSON.parse(studentInfoStr) : null;
            const storedTeacherInfo = teacherInfoStr ? JSON.parse(teacherInfoStr) : null;

            // Determine user role based on what exists
            let storedUserInfo = null;
            let userRole = null;

            if (storedStudentInfo) {
                storedUserInfo = storedStudentInfo;
                userRole = storedStudentInfo.role;
            } else if (storedTeacherInfo) {
                storedUserInfo = storedTeacherInfo;
                userRole = storedTeacherInfo.role;
            }

            try {
                const uid = firebase.auth().currentUser.uid;
                let collectionName = null;
                let nameField = null;

                if (userRole === 'Student') {
                    collectionName = "students";
                    nameField = "Student Name";
                } else if (userRole === 'Teacher') {
                    collectionName = "teachers";
                    nameField = "Teacher Name";
                }

                if (collectionName) {
                    // Get Firestore document for the user
                    const userDocRef = doc(db, collectionName, uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();

                        // Set variables from Firestore
                        setUserName(userData[nameField]);
                        setNumOfStudentClasses?.(parseInt(userData["Number of Classes"]));
                        setNumOfTeacherClasses?.(parseInt(userData["Number of Classes"]));
                        setLangPref(userData["Language Preference"]);
                        setSignedInLang(true);

                        // Redirect
                        window.location.replace('home.html');
                    } else {
                        showAlert("Error", "Your account data could not be found. Please contact us for support.");
                    }
                } else {
                    // If no info is saved, just redirect
                    window.location.replace('home.html');
                }
            } catch (e) {
                showAlert("Error", "There was a problem loading your account data. Please try again by refreshing or contact us for support.");
                return;
            }
        } else {
            // Show the login screen only after the auth check
            body.style.display = 'block';
            body.classList.remove('no-background');
        }
    });
});