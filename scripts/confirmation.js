/**
 * @author Treasure Chandler
 * 
 * This allows full functionality of the confirmation page, which includes replacing the placeholder [name] with the user's name,
 * and redirecting them back to the login page (so the user can actually log in to their account).
 */

document.addEventListener('DOMContentLoaded', () => {
    // Declare variables
    const replaceName = document.getElementById('replacePlaceholderName');
    const replacedName = localStorage.getItem('tempUserName');
    const confetti = document.getElementById('confetti');

    // When "Continue" is clicked, navigate back to the login page
    document.getElementById('continue').addEventListener('click', function () {
        location.href = 'login.html';
    });

    // Replace the placeholder [name] with the user's name
    if (replaceName && replacedName) {
        replaceName.innerHTML = `Welcome, ${replacedName} <3`;
        localStorage.removeItem('tempUserName');
    }

    // Show then hide the confetti GIF after it finishes playing
    setTimeout(() => {
        confetti.style.display = 'block';
    
        setTimeout(() => {
            confetti.style.display = 'none';
        }, 1500);
    }, 50);
});