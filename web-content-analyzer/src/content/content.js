async function analyzePageContent() {
    // Get all text content from the page
    const pageContent = document.body.innerText;
    const summary = await getAISummary(pageContent);
    sendSummaryToBackground(summary);
}

async function getAISummary(text) {
    try {
        if (!text || text.trim().length === 0) {
            throw new Error('No content to summarize');
        }

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: 'Why is the sky blue?'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from local API');
        }

        const result = await response.json();
        return result && result.response ? result.response : 'No summary received';
    } catch (error) {
        console.error('Error getting summary:', error);
        return `Failed to generate summary: ${error.message}`;
    }
}


function sendSummaryToBackground(summary) {
    chrome.runtime.sendMessage({ summary: summary });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getContent") {
        const mainContent = document.body.innerText || '';
        sendResponse({
            content: mainContent,
            success: true
        });
    } else if (request.action === "generateAISummary") {
        analyzePageContent().then(summary => {
            sendResponse({ summary: summary });
        });
        return true; // Required for async response
    }
    return true;
});