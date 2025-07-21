/**
 * @author Treasure Chandler
 * 
 * This allows the full extension to be opened in a new tab when the Wildcat is clicked.
 */

// Open event
document.addEventListener('DOMContentLoaded', function () {
    const wildcatHead = document.getElementById('openLogin');

    if (wildcatHead) {
        wildcatHead.addEventListener('click', function() {
            chrome.tabs.create({ url: 'main_pages/login.html' });
        });
    }
});