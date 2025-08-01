/**
 * @author Treasure Chandler
 * 
 * This is a functional settings page that will allow the user these following options:
 * - Sign out
 * - Change the language
 * - Accessibility
 * - Submit feedback
 * - Read the FAQ
 * - Read about us
 * - Report an issue
 * - Delete their account
 */

import {
    setNumOfStudentClasses,
    setNumOfTeacherClasses,
    setUserName,
    setUserRole,
    setLangPref
} from './userInfo.js';

/**
 * Helper function to retrieve the user's password for account deletion
 * 
 * @returns     User's password
 */
function getPasswordFromUser() {
    return new Promise((resolve) => {
        const passwordPrompt = document.getElementById('pwPrompt');
        const cancelBtn = document.getElementById('noPw');
        const submitBtn = document.getElementById('submitPrompt');
        const passwordInput = document.getElementById('pw');

        passwordInput.value = "";
        passwordPrompt.showModal();

        function cleanup() {
            cancelBtn.removeEventListener('click', onCancel);
            submitBtn.removeEventListener('click', onSubmit);
        }

        function onCancel() {
            cleanup();
            resolve(null);
        }

        function onSubmit() {
            const password = passwordInput.value.trim();
            if (!password) {
                return;
            }
            passwordPrompt.close();
            cleanup();
            resolve(password);
        }

        cancelBtn.addEventListener('click', onCancel);
        submitBtn.addEventListener('click', onSubmit);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize alerts
    const confirmDeletionAlert = document.getElementById('confirmAlert');
    const needPwAlert = document.getElementById('needPasswordAlert');

    // Signs the user out
    document.getElementById('signOut').addEventListener('click', function () {
        firebase.auth().signOut()
            .then(() => {
                // Clear stored info if needed
                localStorage.removeItem('studentInfo');
                localStorage.removeItem('teacherInfo');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                sessionStorage.clear();

                // Redirect to login page
                window.location.replace('login.html');
            })
    });

    // Deletes the user's account
    document.getElementById('deleteAccount').addEventListener('click', async function () {
        // Declare variables
        const auth = firebase.auth();
        const currentUser = auth.currentUser;

        const role = localStorage.getItem('userRole');
        const studentInfo = JSON.parse(localStorage.getItem('studentInfo'));
        const teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));

        // Retrieve ID from local storage
        const id = role === "Student" ? studentInfo?.studentID : teacherInfo?.teacherID;

        // Confirm intent
        const yesBtn = document.getElementById('yes');
        const noBtn = document.getElementById('no');

        confirmDeletionAlert.showModal();

        // Close confirm alert
        noBtn.addEventListener('click', function () {
            confirmDeletionAlert.close();
            return;
        });

        // Otherwise, start the deletion process
        yesBtn.addEventListener('click', async function () {
            // Hide other popup
            confirmDeletionAlert.close();

            // Show password dialog and wait for input
            const password = await getPasswordFromUser();
            if (!password) {
                needPwAlert.showModal();
                return;
            }

            try {
                const email = currentUser.email;
                const credential = firebase.auth.EmailAuthProvider.credential(email, password);
                await currentUser.reauthenticateWithCredential(credential);

                // Delete user rows from the linked sheets
                try {
                    await fetch('https://script.google.com/macros/s/AKfycbzWW3USZ-4f9rWhgM6fu-5TBNHOL6lWKW8nJphpYssKkXOXzQQ8YH-QHowIT1d6RKRSkQ/exec', {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userID: id,
                            role: role
                        })
                    });
                } catch (e) {
                    console.error("Sheet deletion error:", e);
                }

                // Delete Firebase account
                try {
                    await currentUser.delete();
                } catch (e) {
                    console.error("Firebase deletion error:", e);
                    return;
                }

                // Clear everything
                localStorage.clear();
                sessionStorage.clear();
                setUserName(null);
                setUserRole(null);
                setLangPref(null);
                setNumOfStudentClasses(null);
                setNumOfTeacherClasses(null);

                // Redirect back to login
                window.location.replace('login.html');
            } catch (reauthError) {
                console.error("Reauthentication failed:", reauthError);
                alert("Reauthentication failed. Please try logging out and logging back in.");
                return;
            }
        });
    });
});
