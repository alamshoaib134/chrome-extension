document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getContent"}, (response) => {
            if (response && response.success) {
                const content = response.content;
                document.getElementById('original-content').textContent = content;
                
                const summary = generateSummary(content);
                document.getElementById('summary-content').textContent = summary;
            } else {
                document.getElementById('original-content').textContent = 
                    'Unable to extract content from this page.';
                document.getElementById('summary-content').textContent = 
                    'Summary not available.';
            }
        });
    });
});

function generateSummary(content) {
    if (!content) return 'No content to summarize';
    
    const sentences = content.split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0);
    
    const significantSentences = sentences
        .filter(sentence => sentence.length > 20)
        .slice(0, 3);
    
    return significantSentences.length > 0 
        ? significantSentences.join('. ') + '.'
        : 'No significant content found';
}