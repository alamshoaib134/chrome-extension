async function analyzePageContent() {
    const pageContent = document.body.innerText;
    const summary = await getAISummary(pageContent);
    sendSummaryToBackground(summary);
}

async function getAISummary(text) {
    try {
        // Replace with your API endpoint
        const API_ENDPOINT = 'YOUR_API_ENDPOINT';
        // Replace with your API key
        const API_KEY = 'YOUR_API_KEY';

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'YOUR_MODEL_NAME',
                messages: [
                    {
                        role: 'system',
                        content: text
                    },
                    {
                        role: 'user',
                        content: 'help me in summarizing.'
                    }
                ],
                temperature: 0,
                top_p: 0.95,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error getting summary:', error);
        return 'Failed to generate summary';
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
    }
    return true;
});