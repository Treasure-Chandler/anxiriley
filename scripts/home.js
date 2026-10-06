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
    const classList = document.getElementById('classList');
    const spinner = document.getElementById('spinner');
    const db = firebase.firestore();

    spinner.style.display = 'flex';

    // Render the list of the user's classes
    function renderClassList(classes) {
        classList.replaceChildren();

        // Default message for no classes
        if (!classes.length) {
            const emptyState = document.createElement('p');
            emptyState.className = 'class-list-empty';
            emptyState.textContent = 'Click the + to join a class!';
            classList.appendChild(emptyState);
            return;
        }

        // Grab the data from firestore to load each class, along with default values if nothing's loaded
        classes.forEach(classData => {
            const classCard = document.createElement('article');
            classCard.className = 'class-card';

            const banner = document.createElement('img');
            banner.className = 'class-banner';
            banner.src = classData['Class Banner'] || '../Assets/Banners/rhsplaceholderbanner.png';
            banner.alt = `${classData['Class Title'] || 'Class'} banner`;
            banner.addEventListener('error', () => {
                banner.src = '../Assets/Banners/rhsplaceholderbanner.png';
            }, { once: true });

            const details = document.createElement('div');
            details.className = 'class-details';

            const title = document.createElement('h2');
            title.textContent = classData['Class Title'] || 'Untitled class';

            const classCode = classData['Class Code'];
            if (classCode) {
                classCard.setAttribute('role', 'link');
                classCard.tabIndex = 0;
                classCard.setAttribute('aria-label', `Open ${title.textContent}`);

                const openClassPage = () => {
                    location.href = `classPage.html?code=${encodeURIComponent(classCode)}`;
                };

                classCard.addEventListener('click', openClassPage);
                classCard.addEventListener('keydown', event => {
                    if (event.key === 'Enter') openClassPage();
                });
            }

            const teacher = document.createElement('p');
            teacher.textContent = `${classData['Teacher Name'] || 'Unknown'}`;

            const hour = document.createElement('p');
            hour.textContent = `${classData['Class Hour'] || 'Not assigned'}`;

            details.append(title, teacher, hour);
            classCard.append(banner, details);
            classList.appendChild(classCard);
        });
    }

    // Load the classes on the page once all the data is grabbed and rendered
    async function loadJoinedClasses(user) {
        const teacherDoc = await db.collection('teachers').doc(user.uid).get();
        const classCollection = teacherDoc.exists ? 'teacherClasses' : 'studentClasses';
        const classSlots = await db.collection(classCollection).doc(user.uid).get();
        const classCodes = [];

        if (classSlots.exists) {
            for (let classNumber = 1; classNumber <= 7; classNumber += 1) {
                const classCode = classSlots.data()[`Class ${classNumber}`];
                if (classCode && classCode !== 'x') classCodes.push(classCode);
            }
        }

        const classSnapshots = await Promise.all(
            classCodes.map(classCode => db.collection('classData').doc(classCode).get())
        );
        renderClassList(classSnapshots.filter(snapshot => snapshot.exists).map(snapshot => snapshot.data()));
    }

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
            showAlert('Back Online', 'Your internet connection has been restored!\n' + 'Refresh the page just to make sure everything is still functional.');
            setFeaturesDisabled(false);
        },
        () => {
            offline = true;
            showAlert('Disconnected', 'You have lost your internet connection.\n' + 'Some features may not work if you do not reconnect.');
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
        if (!user) {
            spinner.style.display = 'none';
            return;
        }

        // Load the user's joined classes
        try {
            await loadJoinedClasses(user);
        } catch (error) {
            renderClassList([]);
            showAlert('Class Loading Error', 'Unable to load your classes right now. Please try again later.');
        } finally {
            spinner.style.display = 'none';
        }

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
            // If the user is a student, always hide the class code dialog
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
