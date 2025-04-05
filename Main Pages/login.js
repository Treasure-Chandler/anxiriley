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

    // Show the black overlay
    blackOverlay.style.visibility = 'visible';
    blackOverlay.style.opacity = 1;

    // Show the sign up form
    signUpForm.style.visibility = 'visible';
    signUpForm.style.opacity = 1;
    signUpForm.style.display = 'block';

    // Delay the transition so the opacity can take effect
    setTimeout(() => {
        blackOverlay.style.transition = 'opacity 0.6s ease';
        signUpForm.style.transition = 'opacity 0.6s ease';
    }, 10);
});

// Close the sign up form and hide the overlay when the "X" button is clicked
document.getElementById('closeSignUpButton').addEventListener('click', function() {
    const signUpForm = document.getElementById('signUp');
    const blackOverlay = document.getElementById('black-overlay');

    // Hide the black overlay with transition
    blackOverlay.style.opacity = 0;
    blackOverlay.style.visibility = 'hidden';

    // Hide the sign up form with transition
    signUpForm.style.opacity = 0;
    signUpForm.style.visibility = 'hidden';

    // Delay hiding the sign up form to allow for opacity transition
    setTimeout(() => {
        signUpForm.style.display = 'none';
    }, 600);
});

// Show log in form and overlay when the log in button is clicked
document.getElementById('logInButton').addEventListener('click', function() {
    const logInForm = document.getElementById('logIn');
    const blackOverlay = document.getElementById('black-overlay');

    // Show the black overlay
    blackOverlay.style.visibility = 'visible';
    blackOverlay.style.opacity = 1;

    // Show the log in form
    logInForm.style.visibility = 'visible';
    logInForm.style.opacity = 1;
    logInForm.style.display = 'block';

    // Delay the transisiton so the opacity can take effect
    setTimeout(() => {
        blackOverlay.style.transition = 'opacity 0.6s ease';
        logInForm.style.transition = 'opacity 0.6s ease';
    }, 10);
});

// Close the log in form and hide the overlay when the "X" button is clicked
document.getElementById('closeLogInButton').addEventListener('click', function() {
    const logInForm = document.getElementById('logIn');
    const blackOverlay = document.getElementById('black-overlay');

    // Hide the black overlay with transition
    blackOverlay.style.opacity = 0;
    blackOverlay.style.visibility = 'hidden';

    // Hide the log in form with transition
    logInForm.style.opacity = 0;
    logInForm.style.visibility = 'hidden';

    // Delay hiding the sign-up form to allow for opacity transition
    setTimeout(() => {
        logInForm.style.display = 'none';
    }, 600);
});