/**
 * @author Treasure Chandler
 * 
 * The main file that gives Anxiriley background functionality.
 */

// Installed alert
chrome.runtime.onInstalled.addListener(() => {
  console.log("Anxiriley installed");
});

// Loaded alert
chrome.runtime.onStartup.addListener(() => {
  console.log("Anxiriley loaded");
});