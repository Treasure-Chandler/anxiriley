/**
 * @author Treasure Chandler
 * 
 * This page is only accessible for teacher accounts. This allows full functionality of the create classes page, which houses the
 * features of the teacher being able to choose the name of their class, what hour of the day their class takes place, and a
 * decorative banner image for their class.
 */

import {
    setNumOfTeacherClasses,
    numOfTeacherClasses,
    userName,
    teacherIconURL
} from './utils/userInfo.js';

import {
    allClassData,
    isClassMade,
    setAllClassData,
    setGeneratedCode
} from './utils/classUtils.js';

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', () => {
    // Declare components
    const db = firebase.firestore();
    const dialog = document.getElementById('universalCCAlert');
    const okBtn = document.getElementById('universalCCAlertOK');
    const classNameInput = document.getElementById("className");
    const classHourInput = document.getElementById("classHour");
    const bannerButtons = document.querySelectorAll(".banner-item");
    const createBtn = document.getElementById("addClass");

    // Store all fetched classes by the first character of the inputted hour
    const storedClassData = allClassData || {};

    let selectedBanner = null;
    let selectedBannerURL = null;

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

    /**
     * Generates a respective code for the class.
     * 
     * @returns {string}        The generated code
     */
    function generateClassCode() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const numbers = '1234567890';

        function random(str) {
            return str[Math.floor(Math.random() * str.length)];
        }

        return (
            random(letters) +
            random(letters) +
            random(numbers) +
            random(numbers) +
            random(letters) +
            random(letters)
        );
    }

    /**
     * Gets a class row and stores it in the local object using the first
     * letter/character of the hour input as the key
     * 
     * @param {string} rowId        Class document ID
     */
    async function storeClassData(rowId) {
        const inputHour = classHourInput.value.trim();
        const hourKey = inputHour.charAt(0);

        const classDoc = await db
                .collection('classData')
                .doc(rowId)
                .get();

        if (classDoc.exists) {
            storedClassData[hourKey] = classDoc.data();
            setAllClassData(storedClassData);
        }
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
                return;
            }

            // Otherwise, select the new banner
            bannerButtons.forEach(b => b.classList.remove("selected"));
            button.classList.add("selected");
            selectedBanner = bannerName;

            // Store the banner's image for later use
            const img = button.querySelector('img');
            selectedBannerURL = img.getAttribute('src');
        });
    });

    // Add the class to Firestore once everything is selected
    createBtn.addEventListener("click", async () => {
        const user = firebase.auth().currentUser;
        const className = classNameInput.value.trim();
        const classHour = classHourInput.value.trim();
        const generatedClassCode = generateClassCode();
        const hours = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];
        const updatedClassCount = (numOfTeacherClasses || 0) + 1;

        isClassMade(false);

        if (!user) {
            showAlert('Authentication Error', 'You must be signed in to create a class!');
            return;
        }

        // Input validation
        if (!className && !classHour && !selectedBanner) {
            // Alert if the user did not interact with anything
            showAlert('Missing Information', 'You must fill in all required fields and select a banner!');
            return;
        } else if (!className || !classHour || !selectedBanner) {
            // Alert if the user is missing 1-2 pieces of info
            showAlert('Missing Information', 'You are missing one or more forms of information!\n' +
                                             'Double check if you did not fill in a class or hour field, or if you did not select a banner.'
            );
            return;
        } else if (!hours.includes(classHour)) {
            // Alert if the user didn't input the hour in the correct format
            showAlert('Incorrect Hour Format', 'The hour must be in the above format! Please use the format listed in the \"e.g\" above.');
            return;
        }

        /**
         * Adds the class code to the corresponding hour depending on the teacher's input
         */
        async function addHour() {
            const classNumber = parseInt(classHour, 10);

            await db
                    .collection('teacherClasses')
                    .doc(user.uid)
                    .update({
                        [`Class ${classNumber}`]: generatedClassCode
                    });
        }

        createBtn.disabled = true;
        
        try {
            /* More Firebase stuff */
            isClassMade(true);

            // Generate the code and update the teacher's number of classes
            setGeneratedCode(generatedClassCode);
            setNumOfTeacherClasses(updatedClassCount);

            // Update the number of the teacher's classes
            await db
                    .collection('teachers')
                    .doc(user.uid)
                    .update({
                        'Number of Classes': updatedClassCount
                    });

            // Update the class code depending on the hour
            await addHour();

            // Add the teacher's default profile picture

            // Create the class's new row in the collection
            const newClassData = {
                'Class Banner': selectedBannerURL,
                'Class Code': generatedClassCode,
                'Class Hour': classHour,
                'Class Title': className,
                'Teacher Name': userName,
                'Teacher ID': user.uid,
                'Teacher Icon': teacherIconURL,
                'Teacher Mood': ''
            };

            await db.collection('classData').doc(generatedClassCode).set(newClassData);

            // Store the new class row by the first character of the hour input
            await storeClassData(generatedClassCode);
        } catch (error) {
            isClassMade(false);
            createBtn.disabled = false;
            showAlert('Class Creation Error', 'Something went wrong while creating the class. Please try again.');
        }
    });
});
