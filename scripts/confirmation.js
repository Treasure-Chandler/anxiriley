/**
 * @author Treasure Chandler
 * 
 * This allows full functionality of the confirmation page, which includes replacing the placeholder [name] with the user's name,
 * and redirecting them back to the login page (so the user can actually log in to their account).
 */

import { isBrowserOnline, monitorConnectionStatus } from './utils/connectionUtils.js';

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Shows alerts with a specific title and message
     * 
     * @param {string} title        Alert title 
     * @param {string} message      Alert message
     */
    function showAlert(title, message) {
        alert(`${title}\n\n${message}`);
    }

    /**
     * Disable or enable all interactive features based on connection status
     * 
     * @param {boolean} disable     Whether to disable features
     */
    function setFeaturesDisabled(disable) {
        const buttons = ['continue'];
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

    // Declare components
    const replaceName = document.getElementById('replacePlaceholderName');
    const replacedName = localStorage.getItem('tempUserName');
    const confetti = document.getElementById('confetti');

    // When "Continue" is clicked, navigate back to the login page
    document.getElementById('continue').addEventListener('click', function () {
        window.location.replace('login.html');
    });

    // Replace the placeholder [name] with the user's name
    if (replaceName && replacedName) {
        replaceName.innerHTML = `Welcome, ${replacedName} <3`;
        localStorage.removeItem('tempUserName');
    }

    // Show then hide the confetti GIF after it finishes playing
    setTimeout(() => {
        confetti.style.display = 'block';
    
        setTimeout(() => {
            confetti.style.display = 'none';
        }, 1500);
    }, 50);
});
