/**
 * @author Treasure Chandler
 * 
 * This page is only accessible for student accounts. This allows full functionality of the add classes page, which houses the
 * features of the student being able to join a new class by using a generated class code by their teacher.
 */

import {
    setNumOfStudentClasses,
    numOfStudentClasses
} from './utils/userInfo.js';

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', async () => {
    // Declare components
    let user = null;
    let currentClassCount = 0;
    let listOfCodes = [];
    const db = firebase.firestore();
    const classCodeInput = document.getElementById('classCode');
    const addClassBtn = document.getElementById('addClass');
    const spinner = document.getElementById('spinner');
    const wrongCodeAlert = document.getElementById('wrongCodeAlert');
    const wrongCodeAlertBtn = document.getElementById('wrongCodeAlertBtn');
    const addClassError = document.getElementById('addClassError');
    const maxClasses = document.getElementById('maxClasses');
    const success = document.getElementById('success');

    /**
    * Adds the class code to the corresponding hour depending on the student's input
    */
    async function addHour(code) {
        // Find the class data for this code
        const classData = listOfCodes.find(c => c.id === code);
        if (!classData) return;
        
        // Extract the hour and parse it (e.g., "1st" → 1)
        const classHour = classData['Class Hour'];
        const classNumber = parseInt(classHour, 10);
        
        await db
            .collection('studentClasses')
            .doc(user.uid)
            .update({
                [`Class ${classNumber}`]: code
            });
    }

    // Set up auth state listener
    firebase.auth().onAuthStateChanged(async (currentUser) => {
        user = currentUser;

        if (!user) return;

        // Get the student's number of classes
        const studentDoc = await db.collection('students').doc(user.uid).get();
        currentClassCount = studentDoc.data()['Number of Classes'] || 0;

        // Get the list of all class codes for validation
        listOfCodes = (await db.collection('classData').get()).docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });

    // Navigate back to the home screen
    document.getElementById('back').addEventListener('click', function () {
        location.href = 'home.html';
    });

    // Navigate to the settings page
    document.getElementById('settings').addEventListener('click', function () {
        location.href = 'settings.html';
    });

    // Close the wrong code alert
    if (wrongCodeAlertBtn && wrongCodeAlert) {
        wrongCodeAlertBtn.addEventListener('click', () => {
            wrongCodeAlert.close();
        });
    }

    // Automatically toggle the enabling/disabling of the "submit" button
    classCodeInput.addEventListener("input", () => {
        if (classCodeInput.value.length >= 6) {
            addClassBtn.disabled = false;
        } else {
            addClassBtn.disabled = true;
        }
    });

    // Student joins the class
    addClassBtn.addEventListener("click", async () => {
        spinner.style.display = 'flex';
        const enteredCode = classCodeInput.value.trim();
        const updatedClassCount = currentClassCount + 1;

        // Input validation
        const codeExists = listOfCodes.some(classData => classData.id === enteredCode);
        if (!codeExists) {
            // Check if the entered code exists in the list of codes
            spinner.style.display = 'none';
            wrongCodeAlert.showModal();
            return;
        } else if (currentClassCount >= 7) {
            // If the student's classes are maxed out
            spinner.style.display = 'none';
            maxClasses.style.display = 'block';
            setTimeout(() => {
                maxClasses.style.display = 'none';
            }, 10000);
            return;
        }

        try {
            // Update the number of the student's classes
            setNumOfStudentClasses(updatedClassCount);
            await db
                .collection('students')
                .doc(user.uid)
                .update({
                    'Number of Classes': updatedClassCount
                });

            // Update the class code depending on the hour
            await addHour(enteredCode);

            // Hide spinner to notify the student
            spinner.style.display = 'none';

            // Notify user of success and finally redirect them back to the home page
            success.style.display = 'block';
            setTimeout(() => {
                success.style.display = 'none';
                location.href = 'home.html';
            }, 3000);
        } catch (error) {
            spinner.style.display = 'none';
            addClassError.showModal();
            return;
        }
    });
});
