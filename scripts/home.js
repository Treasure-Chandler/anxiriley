/**
 * @author Treasure Chandler
 * 
 * The main home page for Anxiriley, which includes Firestore integration for loading class data, 
 * along with all of the other main features of the extension.
 */

import { isBrowserOnline, monitorConnectionStatus } from './utils/connectionUtils.js';

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', async () => {
    const classCodeBox = document.getElementById('latestClassCodeBox');
    const classCodeDisplay = document.getElementById('latestClassCode');
    const classCodeOkBtn = document.getElementById('latestClassCodeOK');
    const db = firebase.firestore();

    /**
     * Shows alerts with a specific title and message
     * 
     * @param {string} title        Alert title 
     * @param {string} message      Alert message
     */
    function showAlert(title, message) {
        const alert = document.getElementById('universalCCAlert');
        document.getElementById('universalCCAlertTitle').textContent = title;
        document.getElementById('universalCCAlertMessage').innerHTML = message.replace(/\n/g, '<br>');
        alert.showModal();
    }

    /**
     * Disable or enable all interactive features based on connection status
     * 
     * @param {boolean} disable     Whether to disable features
     */
    function setFeaturesDisabled(disable) {
        const buttons = ['settings', 'classAdd', 'latestClassCodeOK'];
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
            showAlert('Back Online', 'Your internet connection has been restored!');
            setFeaturesDisabled(false);
        },
        () => {
            offline = true;
            showAlert('Disconnected', 'You have lost your internet connection.');
            setFeaturesDisabled(true);
        }
    );

    // Preemptively clear the lastest class code to prevent mixups
    function clearStoredClassCode() {
        localStorage.removeItem('latestClassCode');
        localStorage.removeItem('latestClassName');
        if (classCodeDisplay) {
            classCodeDisplay.textContent = 'No class code yet';
        }
    }

    // Display the class code in the popup once the teacher has created a class
    if (classCodeDisplay) {
        classCodeDisplay.textContent = localStorage.getItem('latestClassCode') || 'No class code yet';
    }

    // "OK" button functionality
    if (classCodeOkBtn && classCodeBox) {
        classCodeOkBtn.addEventListener('click', () => {
            clearStoredClassCode();
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
            const classJustCreated = localStorage.getItem('classJustCreated');

            if (storedClassCode) {
                const classDoc = await db.collection('classData').doc(storedClassCode).get();
                if (!classDoc.exists) {
                    clearStoredClassCode();
                    localStorage.removeItem('classJustCreated');
                }
            }

            // Show popup only if a class was just created
            if (classJustCreated === 'true' && storedClassCode) {
                if (classCodeBox) {
                    classCodeDisplay.textContent = storedClassCode;
                    classCodeBox.showModal();
                    localStorage.removeItem('classJustCreated');
                }
            }

            // If the user is a teacher, navigate to the "create class" page
            document.getElementById('classAdd').addEventListener('click', function () {
                location.href = 'createClass.html';
            });
        } else {
            // If the user is a studnet, always hide the class code dialog
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
