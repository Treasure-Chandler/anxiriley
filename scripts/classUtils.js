/**
 * @author Treasure Chandler
 * 
 * This includes global variables related to class creation, such as a signal for when a class is created,
 * and a class code that will be used across several pages.
 */

export let classData = null;
export let classIsMade = null;
export let generatedCode = null;

export function setClassData(value){
    classData = value;
}

export function isClassMade(value) {
    classIsMade = value;
}

export function setGeneratedCode(value) {
    generatedCode = value;
}