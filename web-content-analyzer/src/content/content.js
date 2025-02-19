async function analyzePageContent() {
    // Get all text content from the page
    const pageContent = document.body.innerText;
    const summary = await getAISummary(pageContent);
    sendSummaryToBackground(summary);
}

async function getAISummary(text) {
    try {
        const response = await fetch('https://nike-sole-react.cloud.databricks.com/serving-endpoints/chat/completions', {
            method: 'POST',
            headers: {},
            body: JSON.stringify({
                model: 'databricks-meta-llama-3-3-70b-instruct',
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
            }) // <-- Closing the JSON object properly
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