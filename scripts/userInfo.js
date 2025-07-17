/**
 * @author Treasure Chandler
 * 
 * This includes functions necessary for retrieving specific user data such as their number of classes, name, role,
 * and language preference.
 */

export let numOfStudentClasses = null;
export let numOfTeacherClasses = null;
export let userName = null;
export let userRole = null;
export let langPref = null;
export let signedInLang = null;

export function setNumOfStudentClasses(value) {
    numOfStudentClasses = value;
}

export function setNumOfTeacherClasses(value) {
    numOfTeacherClasses = value;
}

export function setUserName(value) {
    userName = value;
}

export function setUserRole(value) {
    userRole = value;
}

export function setLangPref(value) {
    langPref = value;
}

export function setSignedInLang(value) {
    signedInLang = value;
}