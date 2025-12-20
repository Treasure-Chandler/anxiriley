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
 * Shows sign up/log in/forgot password alerts with a specific title and message depending on the condition
 * 
 * @param {string} title        Alert title 
 * @param {string} message      Alert message
 */
function showAlert(title, message) {
    const alert = document.getElementById('universalAlert');
    document.getElementById('universalAlertTitle').textContent = title;
    document.getElementById('universalAlertMessage').innerHTML = message.replace(/\n/g, '<br>');
    alert.showModal();
}

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

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', () => {
    // Declare alerts
    const confirmDeletionAlert = document.getElementById('confirmAlert');
    const needPwAlert = document.getElementById('needPasswordAlert');

    // Signs the user out
    document.getElementById('signOut').addEventListener('click', function () {
        firebase.auth().signOut()
            .then(() => {
                // Clear stored info if needed
                localStorage.clear();
                sessionStorage.clear();

                // Redirect to login page
                window.location.replace('login.html');
            })
    });

    // Deletes the user's account
    document.getElementById('deleteAccount').addEventListener('click', async function () {
        // Declare variables
        const currentUser = auth.currentUser;
        const db = firebase.firestore();

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
                // Declare variables
                const email = currentUser.email;
                const credential = firebase.auth.EmailAuthProvider.credential(email, password);
                const uid = user.uid;
                const role = localStorage.getItem('userRole');
                const collectionName = role === 'Student' ? 'students' : 'teachers';

                // Reauthenticate the user for successful account deletion
                await currentUser.reauthenticateWithCredential(credential);

                // Delete Firestore document
                await db.collection(collectionName).doc(uid).delete();

                // Delete Firebase account
                await currentUser.delete();

                // Clear local/session storage and reset values
                localStorage.clear();
                sessionStorage.clear();
                setUserName(null);
                setUserRole(null);
                setLangPref(null);
                setNumOfStudentClasses(null);
                setNumOfTeacherClasses(null);

                showAlert('Account Deleted', 'Your account has been successfully deleted.');

                // Redirect back to login
                setTimeout(() => {
                    window.location.replace('login.html');
                }, 1500);
            } catch (reauthError) {
                showAlert('Error', 'There was a problem with deleting your account. Please try again.');
                return;
            }
        });
    });
});