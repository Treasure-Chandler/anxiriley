/**
 * @author Treasure Chandler
 * 
 * This page is only accessible for teacher accounts. This allows full functionality of the create classes page,
 * which houses the features of the teacher being able to choose the name of their class, what hour of the day
 * their class takes place, and a default decorative banner image for their class.
 */

import { setNumOfTeacherClasses, numOfTeacherClasses } from './utils/userInfo.js';
import {
    allClassData,
    isClassMade,
    setAllClassData,
    setGeneratedCode
} from './utils/classUtils.js';
import { isBrowserOnline, monitorConnectionStatus } from './utils/connectionUtils.js';

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
    const spinner = document.getElementById('spinner');

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
     * Disable or enable all interactive features based on connection status
     * 
     * @param {boolean} disable     Whether to disable features
     */
    function setFeaturesDisabled(disable) {
        const buttons = ['back', 'addClass'];
        const inputs = ['className', 'classHour'];
        const bannerButtonsToDisable = document.querySelectorAll('.banner-item');
        
        buttons.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = disable;
        });

        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = disable;
        });

        bannerButtonsToDisable.forEach(btn => {
            btn.disabled = disable;
            btn.style.pointerEvents = disable ? 'none' : 'auto';
            btn.style.opacity = disable ? '0.5' : '1';
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

    // Configure the "OK" button in alerts to close them
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

    // Add the class to Firestore once everything is selected/filled in
    createBtn.addEventListener("click", async () => {
        spinner.style.display = 'flex';
        const user = firebase.auth().currentUser;
        const className = classNameInput.value.trim();
        const classHour = classHourInput.value.trim();
        const generatedClassCode = generateClassCode();
        const hours = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'];

        // Get the current number of classes from Firestore to later update
        const teacherDoc = await db.collection('teachers').doc(user.uid).get();
        const currentClassCount = teacherDoc.data()['Number of Classes'] || 0;
        const updatedClassCount = currentClassCount + 1;

        isClassMade(false);

        // Input validation
        if (!className && !classHour && !selectedBanner) {
            // Alert if the user did not interact with anything
            spinner.style.display = 'none';
            showAlert('Missing Information', 'You must fill in all required fields and select a banner!');
            return;
        } else if (!className || !classHour || !selectedBanner) {
            // Alert if the user is missing 1-2 pieces of info
            spinner.style.display = 'none';
            showAlert('Missing Information', 'You are missing one or more forms of information!\n' +
                                             'Double check if you did not fill in a class or hour field, or if you did not select a banner.'
            );
            return;
        } else if (!hours.includes(classHour)) {
            // Alert if the user didn't input the hour in the correct format
            spinner.style.display = 'none';
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
        
        // Class creation
        try {
            isClassMade(true);

            // Generate the code and update the teacher's number of classes
            setGeneratedCode(generatedClassCode);
            localStorage.setItem('latestClassCode', generatedClassCode);
            localStorage.setItem('latestClassName', className);
            localStorage.setItem('classJustCreated', 'true');
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

            /* 
             * Ensure we have the teacher's name and icon since it sometimes returns null;
             * fetch from Firestore if not available 
             */
            let teacherName = user.displayName || 'Unnamed';
            let teacherIcon = '/Assets/placeholderpfp.png';
            try {
                const teacherDoc = await db.collection('teachers').doc(user.uid).get();
                if (teacherDoc.exists) {
                    const tdata = teacherDoc.data();
                    if (tdata['Teacher Name']) teacherName = tdata['Teacher Name'];
                    if (tdata['Teacher Icon']) teacherIcon = tdata['Teacher Icon'];
                }
            } catch (e) {
                spinner.style.display = 'none';
                isClassMade(false);
                createBtn.disabled = false;
                showAlert('Class Creation Error', 'Something went wrong while creating the class. Please try again.\n' +
                            'If the errors persist, please contact support.'
                );
            }

            const newClassData = {
                'Class Banner': selectedBannerURL,
                'Class Code': generatedClassCode,
                'Class Hour': classHour,
                'Class Title': className,
                'Teacher Name': teacherName,
                'Teacher ID': user.uid,
                'Teacher Icon': teacherIcon,
                'Teacher Mood': ''
            };

            // Add the new class in Firestore
            await db.collection('classData').doc(generatedClassCode).set(newClassData);

            // Store the new class row by the first character of the hour input
            await storeClassData(generatedClassCode);
        } catch (error) {
            spinner.style.display = 'none';
            isClassMade(false);
            createBtn.disabled = false;
            showAlert('Class Creation Error', 'Something went wrong while creating the class. Please try again.\n' +
                        'If the errors persist, please contact support.'
            );
            return;
        }
        
        // Hide spinner when done and then navigate back to the home page
        spinner.style.display = 'none';
        location.href = 'home.html';
    });
});
