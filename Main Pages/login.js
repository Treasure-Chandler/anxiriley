/**
 * @author Treasure Chandler
 * 
 * This allows full functionality of the login page, which includes Gmail authentation and Firebase integration
 * for account handling.
 */

// Initialize an event listener for all of the buttons on the page
document.addEventListener('DOMContentLoaded', function() {
    // Sign up button
    document.getElementById('signUpButton').addEventListener('click', openSignUp);

    // Close sign up button
    document.getElementById('closeSignUpButton').addEventListener('click', closeSignUp);
});

// Open the sign up form when the "Sign Up" button is clicked
function openSignUp() {
    document.getElementById("signUp").style.display = "block";
}

// Close the sign up form when the "X" button is clicked
function closeSignUp() {
    document.getElementById("signUp").style.display = "none";
}