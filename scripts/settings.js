document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signOut').addEventListener('click', function () {
        firebase.auth().signOut()
            .then(() => {
                // Clear stored info if needed
                localStorage.removeItem("studentInfo");
                localStorage.removeItem("teacherInfo");
                localStorage.removeItem("userRole");
                localStorage.removeItem("userName");
                sessionStorage.clear();

                // Redirect to login page
                location.href = 'login.html';
            })
            .catch((error) => {
                console.error("Error signing out:", error);
                alert("Failed to sign out. Try again.");
            });
    });
});
