/**
 * @author Treasure Chandler
 * 
 * This page is only accessible for teacher accounts. This allows full functionality of the create classes page, which houses the
 * features of the teacher being able to choose the name of their class, what hour of the day their class takes place, and a
 * decorative banner image for their class.
 */

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', () => {
    // Declare components
    const dialog = document.getElementById('universalCCAlert');
    const okBtn = document.getElementById('universalCCAlertOK');

    const classNameInput = document.getElementById("className");
    const classHourInput = document.getElementById("classHour");
    const bannerButtons = document.querySelectorAll(".banner-item");
    const createBtn = document.getElementById("addClass");

    let selectedBanner = null;

    /**
     * Shows class creation validation alerts with a specific title and message depending on the condition
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

    // Configure the "OK" button in alerts to close it
    okBtn.addEventListener('click', () => {
        dialog.close();
    });

    // Navigate back to the home screen
    document.getElementById('back').addEventListener('click', function () {
        location.href = 'home.html';
    });

    // Detect which banner button was clicked
    bannerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bannerName = button.dataset.banner;

            // If clicking the already-selected banner, deselect it
            if (selectedBanner === bannerName) {
                button.classList.remove("selected");
                selectedBanner = null;
                console.log("Banner deselected");
                return;
            }

            // Otherwise, select the new banner
            bannerButtons.forEach(b => b.classList.remove("selected"));
            button.classList.add("selected");
            selectedBanner = bannerName;
        });
    });

    // Add the class to Firestore once everything is selected
    createBtn.addEventListener("click", () => {
        const className = classNameInput.value.trim();
        const classHour = classHourInput.value.trim();
        const hours = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];

        // Input validation
        if (!className && !classHour && !selectedBanner) {
            // Alert if the user did not interact with anything
            showAlert('Missing Information', 'You must fill in all required fields and select a banner!');
            return;
        } else if (!className || !classHour || !selectedBanner) {
            showAlert('Missing Information', 'You are missing one or more forms of information!\n' +
                                             'Double check if you did not fill in a class or hour field, or if you did not select a banner.'
            );
        } else if (!hours.includes(classHour)) {
            showAlert('Incorrect Hour Format', 'The hour must be in the above format! Please use the format listed in the \"e.g\" above.');
        }

        // TODO: Firebase stuff
    });
});