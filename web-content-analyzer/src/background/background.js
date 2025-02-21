chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SUMMARIZE_TEXT') {
        handleAPIRequest(request.text)
            .then(result => sendResponse({ success: true, summary: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep the message channel open
    }
});

async function handleAPIRequest(text) {
    const response = await fetch('https://nike-sole-react.cloud.databricks.com/serving-endpoints/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer dapi14f200c07bc4cbd061d4eef5039d1ad6',
            'Origin': chrome.runtime.getURL('')
        },
        body: JSON.stringify({
            model: 'databricks-meta-llama-3-3-70b-instruct',
            messages: [
                {
                    role: 'system',
                    content: text
                },
                {
                    role: 'user',
                    content: 'Please summarize this text in bullet points'
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}