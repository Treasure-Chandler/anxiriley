/**
 * @author Treasure Chandler
 * 
 * The main home page for Anxiriley, which includes Firestore integration for loading class data, 
 * along with all of the other main features of the extension.
 */

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', async () => {
    // Declare the user
    const user = firebase.auth().currentUser;

    // Navigate to the settings
    document.getElementById('settings').addEventListener('click', function () {
        location.href = 'settings.html';
    });

    // Wait for the firebase auth state for the below code to work
    firebase.auth().onAuthStateChanged(async (user) => {
        /* Role dependent conditions for adding a class */
        // Try to fetch from the "teachers" collection
        const teacherDoc = await firebase.firestore().collection('teachers').doc(user.uid).get();

        if (teacherDoc.exists) {
            // If the user is a teacher, navigate to the "create class" page
            document.getElementById('classAdd').addEventListener('click', function () {
                location.href = 'createClass.html';
            });
        } else {
            // If the user is a student, navicate to the "add class" page
            document.getElementById('classAdd').addEventListener('click', function () {
                location.href = 'addClass.html';
            });
        }

    });
});