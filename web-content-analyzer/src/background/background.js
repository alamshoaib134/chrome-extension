// background.js

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeContent") {
        // Handle content analysis request
        analyzeContent(request.data);
    }
});

// Function to analyze content and send summary back
function analyzeContent(data) {
    // Perform analysis on the data received from content script
    const summary = generateSummary(data);
    
    // Send the summary back to the popup or content script
    chrome.runtime.sendMessage({ action: "sendSummary", summary: summary });
}

// Function to generate a summary from the content
function generateSummary(data) {
    // Placeholder for summary generation logic
    return `Summary of the content: ${data}`;
}