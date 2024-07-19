let lastState = 'noWordSelected';

chrome.contextMenus.create({
    title: "Get word meaning",
    contexts: ["selection"],
    onclick: function(info, tab) {
        const words = info.selectionText.trim().split(/\s+/);
        if (words.length === 0) {
            lastState = 'noWordSelected';
        } else if (words.length > 1) {
            lastState = 'moreThanOneWordSelected';
        } else {
            lastState = 'getMeaning';
            chrome.tabs.sendMessage(tab.id, {text: 'getMeaning', selection: info.selectionText});
        }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.text === 'getState') {
        sendResponse({text: lastState});
    }
});