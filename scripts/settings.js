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
} from './utils/userInfo.js';
import { isBrowserOnline, monitorConnectionStatus } from './utils/connectionUtils.js';

/**
 * Shows alerts with a specific title and message
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
                passwordPrompt.close();
                cleanup();
                resolve(null);
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
    const universalAlert = document.getElementById('universalAlert');
    const okBtn = document.getElementById('universalAlertOK');

    // Delete all the user's data from Firestore along with deleting their account
    async function deleteUserFirestoreData(db, uid, role) {
        const profileCollection = role === 'Student' ? 'students' : 'teachers';
        const classCollection = role === 'Student' ? 'studentClasses' : 'teacherClasses';

        const deletions = [
            db.collection(profileCollection).doc(uid).delete(),
            db.collection(classCollection).doc(uid).delete()
        ];

        await Promise.allSettled(deletions);
    }

    /**
     * Disable or enable all interactive features based on connection status
     * 
     * @param {boolean} disable     Whether to disable features
     */
    function setFeaturesDisabled(disable) {
        const buttons = ['signOut', 'deleteAccount'];
        buttons.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = disable;
        });
    }

    /* Check internet connection */
    let offline = !isBrowserOnline();

    if (offline) {
        showAlert('Offline', 'You are currently offline! Some features may not work. Please check your internet connection.');
        setFeaturesDisabled(true);
    }

    // Alert the user if they have gone back online or if they have been disconnected
    monitorConnectionStatus(
        () => {
            offline = false;
            showAlert('Back Online', 'Your internet connection has been restored!\n' + 'Refresh the page just to make sure everything is still functional.');
            setFeaturesDisabled(false);
        },
        () => {
            offline = true;
            showAlert('Disconnected', 'You have lost your internet connection.\n' + 'Some features may not work if you do not reconnect.');
            setFeaturesDisabled(true);
        }
    );

    const spinner = document.getElementById('spinner');

    // Close the universal alert when OK is clicked
    okBtn.addEventListener('click', () => {
        universalAlert.close();
    });

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
        }, { once: true });

        // Otherwise, start the deletion process
        yesBtn.addEventListener('click', async function () {
            // Hide other popup
            confirmDeletionAlert.close();

            // Show password dialog and wait for input
            const password = await getPasswordFromUser();
            if (!password) {
                showAlert('Password Needed', 'Your password is required to delete your account.');
                return;
            }

            try {
                // Declare variables
                const email = currentUser.email;
                const credential = firebase.auth.EmailAuthProvider.credential(email, password);
                const uid = currentUser.uid;
                const role = localStorage.getItem('userRole');

                spinner.style.display = 'flex';
                setFeaturesDisabled(true);

                // Reauthenticate the user for successful account deletion
                await currentUser.reauthenticateWithCredential(credential);

                // Delete Firestore documents
                await deleteUserFirestoreData(db, uid, role);

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

                spinner.style.display = 'none';
                setFeaturesDisabled(false);

                // Show the success message immediately
                showAlert('Account Deleted', 'Your account has been successfully deleted.\n' +
                            'You will be redirected back to the login page shortly.');

                // Keep the alert open for 5 seconds, then close and redirect to login
                setTimeout(() => {
                    universalAlert.close();
                    window.location.replace('login.html');
                }, 5000);
            } catch (reauthError) {
                spinner.style.display = 'none';
                setFeaturesDisabled(false);

                if (reauthError && reauthError.code === 'auth/wrong-password') {
                    showAlert('Incorrect Password', 'The password you entered is incorrect. Please try again.');
                } else {
                    showAlert('Error', 'There was a problem with deleting your account. Please try again.\n' +
                                        'If it persists, contact support.');
                }
            }
        }, { once: true });
    });
});
