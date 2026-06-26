/**
 * @author Treasure Chandler
 * 
 * The main home page for Anxiriley, which includes Firestore integration for loading class data, 
 * along with all of the other main features of the extension.
 */

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', async () => {
    const classCodeBox = document.getElementById('latestClassCodeBox');
    const classCodeDisplay = document.getElementById('latestClassCode');
    const classCodeOkBtn = document.getElementById('latestClassCodeOK');
    const db = firebase.firestore();

    function clearStoredClassCode() {
        localStorage.removeItem('latestClassCode');
        localStorage.removeItem('latestClassName');
        if (classCodeDisplay) {
            classCodeDisplay.textContent = 'No class code yet';
        }
    }

    if (classCodeBox) {
        classCodeBox.style.display = 'none';
    }

    if (classCodeDisplay) {
        classCodeDisplay.textContent = localStorage.getItem('latestClassCode') || 'No class code yet';
    }

    if (classCodeOkBtn && classCodeBox) {
        classCodeOkBtn.addEventListener('click', () => {
            classCodeBox.close();
        });
    }

    // Navigate to the settings
    document.getElementById('settings').addEventListener('click', function () {
        location.href = 'settings.html';
    });

    // Wait for the firebase auth state for the below code to work
    firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) return;

        /* Role dependent conditions for adding a class */
        // Try to fetch from the "teachers" collection for starters
        const teacherDoc = await db.collection('teachers').doc(user.uid).get();

        if (teacherDoc.exists) {
            const storedClassCode = localStorage.getItem('latestClassCode');

            if (storedClassCode) {
                const classDoc = await db.collection('classData').doc(storedClassCode).get();
                if (!classDoc.exists) {
                    clearStoredClassCode();
                }
            }

            const hasClassCode = Boolean(localStorage.getItem('latestClassCode'));

            if (classCodeBox) {
                if (hasClassCode) {
                    classCodeDisplay.textContent = localStorage.getItem('latestClassCode');
                    classCodeBox.showModal();
                } else {
                    classCodeDisplay.textContent = 'No class code yet';
                    classCodeBox.showModal();
                }
            }

            // If the user is a teacher, navigate to the "create class" page
            document.getElementById('classAdd').addEventListener('click', function () {
                location.href = 'createClass.html';
            });
        } else {
            if (classCodeBox) {
                classCodeBox.style.display = 'none';
            }

            // If the user is a student, navicate to the "add class" page
            document.getElementById('classAdd').addEventListener('click', function () {
                location.href = 'addClass.html';
            });
        }
    });
});
