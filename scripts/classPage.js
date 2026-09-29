document.addEventListener('DOMContentLoaded', async () => {
    const status = document.getElementById('classStatus');
    const classDetail = document.getElementById('classDetail');
    const classCode = new URLSearchParams(location.search).get('code');

    document.getElementById('back').addEventListener('click', () => {
        location.href = 'home.html';
    });

    if (!classCode) {
        status.textContent = 'No class was selected.';
        return;
    }

    try {
        const classSnapshot = await firebase.firestore().collection('classData').doc(classCode).get();
        if (!classSnapshot.exists) {
            status.textContent = 'This class could not be found.';
            return;
        }

        const classData = classSnapshot.data();
        const classTitle = classData['Class Title'] || 'Untitled class';
        const classBanner = document.getElementById('classBanner');

        classBanner.src = classData['Class Banner'] || '../Assets/Banners/banner_rhs.jpg';
        classBanner.alt = `${classTitle} banner`;
        classBanner.addEventListener('error', () => {
            classBanner.src = '../Assets/Banners/banner_rhs.jpg';
        }, { once: true });
        document.getElementById('classHour').textContent = classData['Class Hour'] || 'Hour not assigned';
        document.getElementById('classTitle').textContent = classTitle;
        document.getElementById('teacherName').textContent = `Teacher: ${classData['Teacher Name'] || 'Unknown'}`;
        document.getElementById('classCode').textContent = `Class code: ${classCode}`;

        status.hidden = true;
        classDetail.hidden = false;
    } catch (error) {
        status.textContent = 'Unable to load this class. Please try again later.';
        console.error('Class detail loading failed:', error);
    }
});