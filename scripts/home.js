/**
 * @author Treasure Chandler
 * 
 * This page is only accessible for teacher accounts. This allows full functionality of the create classes page, which houses the
 * features of the teacher being able to choose the name of their class, what hour of the day their class takes place, and a
 * decorative banner image for their class.
 */

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', () => {
    // Navigate to the settings
    document.getElementById('settings').addEventListener('click', function () {
        location.href = 'settings.html';
    });

    // Role dependent conditions for adding a class
    /* Check for the user role here */
    const userRole = localStorage.getItem('userRole');

    if (userRole == 'Teacher') {
        // If the user is a teacher, navigate to the "create class" page
    } else {
        // If the user is a student, navicate to the "add class" page
    }
});