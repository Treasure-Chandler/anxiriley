/**
 * @author Treasure Chandler
 * 
 * This page is only accessible for student accounts. This allows full functionality of the add classes page, which houses the
 * features of the student being able to join a new class by using a generated class code by their teacher.
 */

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', () => {
    // Navigate back to the home screen
    document.getElementById('back').addEventListener('click', function () {
        location.href = 'home.html';
    });
});