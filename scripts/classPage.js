/**
 * @author Treasure Chandler
 * 
 * The class page, which includes Firestore integration for loading the class UI,
 * displaying the mood in a pie graph for all of the students (for the teacher's view;
 * the student's view can have motivational/reassuring content), the button for
 * the student to check in their mood, the teacher's name/icon and a button to directly
 * message them, and the class code.
 */

// When the page is loaded, execute these events
document.addEventListener('DOMContentLoaded', async () => {
    const classDetail = document.getElementById('classDetail');
    const classStatus = document.getElementById('classStatus');
    const spinner = document.getElementById('spinner');
    const classCode = new URLSearchParams(location.search).get('code');

    spinner.style.display = 'flex';

    // Navigate back to the home page
    document.getElementById('back').addEventListener('click', () => {
        location.href = 'home.html';
    });

    document.getElementById('settings').addEventListener('click', () => {
        location.href = 'settings.html';
    });

    if (!classCode) {
        spinner.style.display = 'none';
        classStatus.textContent = 'No class was selected.';
        classStatus.hidden = false;
        return;
    }

    try {
        const classSnapshot = await firebase.firestore().collection('classData').doc(classCode).get();
        if (!classSnapshot.exists) {
            spinner.style.display = 'none';
            classStatus.textContent = 'This class could not be found.';
            classStatus.hidden = false;
            return;
        }

        const classData = classSnapshot.data();
        const classTitle = classData['Class Title'] || 'Untitled class';
        const classBanner = document.getElementById('classBanner');

        classBanner.src = classData['Class Banner'] || '../Assets/Banners/rhsplaceholderbanner.png';
        classBanner.alt = `${classTitle} banner`;
        classBanner.addEventListener('error', () => {
            classBanner.src = '../Assets/Banners/rhsplaceholderbanner.png';
        }, { once: true });
        document.getElementById('classHour').textContent = classData['Class Hour'] || 'Hour not assigned';
        document.getElementById('classTitle').textContent = classTitle;
        document.getElementById('teacherName').textContent = `Teacher: ${classData['Teacher Name'] || 'Unknown'}`;
        document.getElementById('classCode').textContent = `Class code: ${classCode}`;

        classStatus.hidden = true;
        classDetail.hidden = false;
        
        spinner.style.display = 'none';
    } catch (error) {
        spinner.style.display = 'none';
        classStatus.textContent = navigator.onLine
            ? 'Unable to load this class. Please try again later.'
            : 'You are offline. Reconnect and refresh to load this class.';
        classStatus.hidden = false;
        console.error('Class detail loading failed:', error);
    }
});