/**
 * @author Treasure Chandler
 * 
 * This page is only accessible for student accounts. This allows full functionality of the add classes page, which houses the
 * features of the student being able to join a new class by using a generated class code by their teacher.
 */

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', () => {
    // Declare components
    const classCodeInput = document.getElementById('classCode');
    const addClassBtn = document.getElementById('addClass');

    // Navigate back to the home screen
    document.getElementById('back').addEventListener('click', function () {
        location.href = 'home.html';
    });

    // Navigate to the settings page
    document.getElementById('settings').addEventListener('click', function () {
        location.href = 'settings.html';
    });

    // The "submit" button is initially disabled
    addClassBtn.disabled = true;

    // Automatically toggle the enabling/disabling of the "submit" button
    classCodeInput.addEventListener("input", () => {
        if (classCodeInput.value.length >= 6) {
            addClassBtn.disabled = false;
        } else {
            addClassBtn.disabled = true;
        }
    });
});