/**
 * @author Treasure Chandler
 * 
 * This allows the full extension to be opened in a new tab when the Wildcat is clicked.
 */

// Open event
document.getElementById('openLogin').addEventListener('click', function() {
    chrome.tabs.create({ url: 'main_pages/login.html' });
});