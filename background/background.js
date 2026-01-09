// Background Service Worker
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        // Set default settings on first install
        const defaultSettings = {
            'font-family': 'default',
            'font-size': 16,
            'line-spacing': 1.5,
            'letter-spacing': 0,
            'word-spacing': 0,
            'reading-guide': false,
            'highlight-links': false,
            'reduce-animations': false,
            'color-filter': 'none',
            'brightness': 100,
            'enabled': true
        };
        
        chrome.storage.sync.set(defaultSettings, function() {
            console.log('DyslexiaAssist: Default settings initialized');
        });

        // Open options page on first install
        chrome.runtime.openOptionsPage();
    }
});

// Handle extension icon click (toggle functionality)
chrome.action.onClicked.addListener(function(tab) {
    // This won't be called if popup is defined, but keeping it for fallback
    chrome.tabs.sendMessage(tab.id, {action: 'showContentPopup'});
});

// Context menu for quick access
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: 'dyslexia-assist-toggle',
        title: 'Toggle DyslexiaAssist',
        contexts: ['page']
    });
    
    chrome.contextMenus.create({
        id: 'dyslexia-assist-reading-guide',
        title: 'Toggle Reading Guide',
        contexts: ['page']
    });
    
    chrome.contextMenus.create({
        id: 'dyslexia-assist-reset',
        title: 'Reset All Settings',
        contexts: ['page']
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch(info.menuItemId) {
        case 'dyslexia-assist-toggle':
            chrome.tabs.sendMessage(tab.id, {action: 'showContentPopup'});
            break;
        case 'dyslexia-assist-reading-guide':
            chrome.storage.sync.get(['reading-guide'], function(result) {
                const newValue = !result['reading-guide'];
                chrome.storage.sync.set({'reading-guide': newValue}, function() {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'updateSettings',
                        settings: {'reading-guide': newValue}
                    });
                });
            });
            break;
        case 'dyslexia-assist-reset':
            chrome.storage.sync.clear(function() {
                chrome.tabs.sendMessage(tab.id, {action: 'resetSettings'});
            });
            break;
    }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        switch(command) {
            case 'toggle-extension':
                chrome.tabs.sendMessage(tabs[0].id, {action: 'toggle'});
                break;
            case 'toggle-reading-guide':
                chrome.storage.sync.get(['reading-guide'], function(result) {
                    const newValue = !result['reading-guide'];
                    chrome.storage.sync.set({'reading-guide': newValue}, function() {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'updateSettings',
                            settings: {'reading-guide': newValue}
                        });
                    });
                });
                break;
        }
    });
});

// Monitor tab updates to ensure content script is loaded
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && 
        (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
        
        // Inject content script if not already present
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ['content/content.js']
        }).catch(err => {
            // Content script might already be injected, ignore error
            console.log('Content script injection skipped:', err.message);
        });
    }
});

// Handle storage changes and sync across tabs
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync') {
        // Broadcast settings changes to all tabs
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(function(tab) {
                if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'storageChanged',
                        changes: changes
                    }).catch(err => {
                        // Silently ignore - tab might not have content script loaded
                        // This is normal for tabs without the extension active
                    });
                }
            });
        });
    }
});

// Analytics and usage tracking (privacy-friendly)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'trackUsage') {
        // Log usage statistics (could be expanded for analytics)
        console.log('Feature used:', request.feature);
    }
});

// Error handling and logging
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'logError') {
        console.error('DyslexiaAssist Error:', request.error);
    }
});

// Badge text updates
function updateBadge(enabled) {
    chrome.action.setBadgeText({
        text: enabled ? 'ON' : 'OFF'
    });
    chrome.action.setBadgeBackgroundColor({
        color: enabled ? '#4CAF50' : '#f44336'
    });
}

// Initialize badge
chrome.storage.sync.get(['enabled'], function(result) {
    updateBadge(result.enabled !== false);
});

// Update badge when settings change
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.enabled) {
        updateBadge(changes.enabled.newValue);
    }
});