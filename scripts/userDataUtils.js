/**
 * @author Treasure Chandler
 * 
 * This includes functions necessary for login and user data handling, such as fetchingthe user's name, amount of classes, language
 * preference, and role.
 */

// Initalize the Google Apps Script link for the User Data Google sheet
const userSheetURL = "https://script.google.com/macros/s/AKfycbzevWfE_vLX-WYH6SvgNsQlEpZ2qIJao3-p4AE5bEdc9pFMqyZQSowOQFmWbLiRwhhiQQ/exec";

/**
 * Returns the user's name from the corresponding Google Sheet
 *
 * @param {string} firebaseUID      User ID
 * @param {string} userRole         User's role
 * @returns                         User's name
*/
export async function fetchUserName(firebaseUID, userRole) {
    try {
        const response = await fetch(`${userSheetURL}?role=${userRole}`);
        const data = await response.json();
        const idKey = userRole === "Teacher" ? "Teacher ID" : "Student ID";
        const nameKey = userRole === "Teacher" ? "Teacher Name" : "Student Name";
        const matchingEntry = data.find(entry => entry[idKey] === firebaseUID);
        return matchingEntry ? matchingEntry[nameKey] : null;
    } catch (err) {
        console.error("Error fetching user name:", err);
        return null;
    }
}

/**
 * Returns the user's amount of classes from the corresponding Google Sheet
 * 
 * @param {string} firebaseUID      User ID
 * @param {string} userRole         User's role
 * @returns                         User's class amount
*/
export async function fetchClassAmount(firebaseUID, userRole) {
    try {
        const response = await fetch(`${userSheetURL}?role=${userRole}`);
        const data = await response.json();
        const idKey = userRole === "Teacher" ? "Teacher ID" : "Student ID";
        const matchingEntry = data.find(entry => entry[idKey] === firebaseUID);
        return matchingEntry ? matchingEntry["Number of Classes"] : null;
    } catch (err) {
        console.error("Error fetching class amount:", err);
        return null;
    }
}

/**
 * Returns the user's language preference from the corresponding Google Sheet
 * 
 * @param {string} firebaseUID      User ID
 * @param {string} userRole         User's role
 * @returns                         User's language preference
*/
export async function fetchLangPref(firebaseUID, userRole) {
    try {
        const response = await fetch(`${userSheetURL}?role=${userRole}`);
        const data = await response.json();
        const idKey = userRole === "Teacher" ? "Teacher ID" : "Student ID";
        const matchingEntry = data.find(entry => entry[idKey] === firebaseUID);
        return matchingEntry ? matchingEntry["Language Preference"] : null;
    } catch (err) {
        console.error("Error fetching language preference:", err);
        return null;
    }
}

/**
 * Returns the user's role depending on where their ID is located
 * 
 * @param {string} firebaseUID                  User's ID
 * @returns                                     User's role
*/
export async function fetchUserRole(firebaseUID) {
    try {
        const [studentRes, teacherRes] = await Promise.all([
            fetch(`${userSheetURL}?role=Student`).then(res => res.json()),
            fetch(`${userSheetURL}?role=Teacher`).then(res => res.json())
        ]);
        if (studentRes.some(entry => entry["Student ID"] === firebaseUID)) return "Student";
        if (teacherRes.some(entry => entry["Teacher ID"] === firebaseUID)) return "Teacher";
        return null;
    } catch (err) {
        console.error("Error fetching user role:", err);
        return null;
    }
}