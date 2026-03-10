/**
 * @author Treasure Chandler
 * 
 * Checks for internet connection while the user is using Anxiriley.
 */

/**
 * Checks if the browser is online via navigator.onLine
 * 
 * @returns {boolean}
 */
export function isBrowserOnline() {
    return navigator.onLine;
}

/**
 * Sets up listeners for online/offline changes
 * 
 * @param {Function} onOnline       Callback for going online
 * @param {Function} onOffline      Callback for going offline
 */
export function monitorConnectionStatus(onOnline, onOffline) {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
}