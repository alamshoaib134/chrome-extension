document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getContent"}, (response) => {
            if (response && response.success) {
                const content = response.content;
                document.getElementById('original-content').textContent = content;
                
                // Trigger the content script to generate AI summary
                chrome.tabs.sendMessage(tabs[0].id, {action: "generateAISummary"}, (summaryResponse) => {
                    if (summaryResponse && summaryResponse.summary) {
                        document.getElementById('summary-content').textContent = summaryResponse.summary;
                    } else {
                        document.getElementById('summary-content').textContent = 'Failed to generate AI summary.';
                    }
                });
            } else {
                document.getElementById('original-content').textContent = 
                    'Unable to extract content from this page.';
                document.getElementById('summary-content').textContent = 
                    'Summary not available.';
            }
        });
    });
});