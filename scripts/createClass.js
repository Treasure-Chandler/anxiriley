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
    const missingInfoDialog = document.getElementById("missingInfoAlert");
    const missingInfoOk = document.getElementById("missingInfoOK");

    const classNameInput = document.getElementById("className");
    const classHourInput = document.getElementById("classHour");
    const bannerButtons = document.querySelectorAll(".banner-item");
    const createBtn = document.getElementById("addClass");

    let selectedBanner = null;

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

        // Input validation
        if (!className || !classHour || !selectedBanner) {
            // Show the dialog if the user did not interact with anything
            missingInfoDialog.showModal();
            return;
        }

        // TODO: Firebase stuff
    });

    // Close dialog when "OK" is clicked
    missingInfoOk.addEventListener("click", () => {
        missingInfoDialog.close();
    });
});