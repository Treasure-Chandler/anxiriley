/**
 * @author Treasure Chandler
 * 
 * This allows full functionality of the login page, which includes Gmail authentation and Firebase integration
 * for account handling.
 */

// Show sign up form and overlay when the sign up button is clicked
document.getElementById('signUpButton').addEventListener('click', function() {
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
document.getElementById('closeSignUpButton').addEventListener('click', function() {
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
document.getElementById('logInButton').addEventListener('click', function() {
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
document.getElementById('closeLogInButton').addEventListener('click', function() {
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
document.getElementById('forgotPasswordButton').addEventListener('click', function(event) {
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
document.getElementById('closeForgotPasswordButton').addEventListener('click', function() {
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

/* Alerts section */
document.addEventListener("DOMContentLoaded", function() {
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

    document.getElementById('suButton').addEventListener('click', function() {
        // Declaring variables
        const nameAlert = document.getElementById('nameAlert');
        const stuEmailAlert = document.getElementById('stuEmailAlert');
        const name = document.getElementById('name').value;
        const signUpEmail = document.getElementById('signUpEmail').value;
        const signUpPassword = document.getElementById('signUpPassword').value;
        const isStudent = document.getElementById('isStudent');
        const isTeacher = document.getElementById('isTeacher');

        // If there is only one name instead of two upon signing up
        if (!name.includes(" ")) nameAlert.showModal();

        // If the email does not contain the correct email address upon signing up
        if (isStudent.checked) {
            stuEmailAlert.showModal();
        }
    });
});


/* End of alerts section */