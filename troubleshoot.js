// DyslexiaAssist Troubleshoot Script
// Run this in the browser console (F12) to diagnose AI issues

console.log('🔧 DyslexiaAssist Troubleshoot Script');
console.log('=====================================');

// Check if extension is loaded
if (typeof chrome === 'undefined') {
    console.error('❌ Chrome extension API not available');
} else {
    console.log('✅ Chrome extension API available');
}

// Check storage for API key and settings
chrome.storage.sync.get([
    'google-ai-key',
    'ai-enabled',
    'auto-simplify',
    'enable-advanced-ai'
], function(result) {
    console.log('\n📋 Current Settings:');
    console.log('====================');
    
    const apiKey = result['google-ai-key'];
    console.log('API Key:', apiKey ? `Set (${apiKey.length} characters)` : '❌ Not set');
    console.log('AI Enabled:', result['ai-enabled'] ? '✅ Yes' : '❌ No');
    console.log('Auto Simplify:', result['auto-simplify'] ? '✅ Yes' : '❌ No');
    console.log('Advanced AI:', result['enable-advanced-ai'] ? '✅ Yes' : '❌ No');
    
    // Test API key if available
    if (apiKey) {
        console.log('\n🧪 Testing API Key...');
        testGoogleAI(apiKey);
    } else {
        console.log('\n❌ No API key to test. Please configure in extension options.');
        console.log('📝 Steps to fix:');
        console.log('1. Get API key from https://makersuite.google.com/app/apikey');
        console.log('2. Go to extension options (right-click extension icon → Options)');
        console.log('3. Navigate to AI Features tab');
        console.log('4. Paste API key and enable AI features');
        console.log('5. Save settings');
    }
});

// Test Google AI API
async function testGoogleAI(apiKey) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Respond with exactly: "API Test Successful"'
                    }]
                }]
            })
        });
        
        console.log('API Response Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Test Successful!');
            console.log('Response:', data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content');
        } else {
            console.error('❌ API Test Failed');
            console.error('Status:', response.status, response.statusText);
            
            if (response.status === 403) {
                console.log('💡 Fix: Check API key is correct and has necessary permissions');
            } else if (response.status === 429) {
                console.log('💡 Fix: Rate limit exceeded, wait a few minutes and try again');
            } else {
                console.log('💡 Fix: Check API key and internet connection');
            }
        }
    } catch (error) {
        console.error('❌ API Connection Failed:', error);
        console.log('💡 Fix: Check internet connection and firewall settings');
    }
}

// Check if content script is loaded
setTimeout(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, {action: 'ping'}, function(response) {
            if (chrome.runtime.lastError) {
                console.log('❌ Content script not loaded on current page');
                console.log('💡 Fix: Refresh the page and try again');
            } else {
                console.log('✅ Content script is loaded');
                
                // Test AI features
                chrome.tabs.sendMessage(tabId, {action: 'testAI'}, function(aiResponse) {
                    if (aiResponse && aiResponse.success) {
                        console.log('\n🤖 AI Features Status:');
                        console.log('========================');
                        console.log('AI Processing Enabled:', aiResponse.aiStatus.aiProcessingEnabled);
                        console.log('Text Processor:', aiResponse.aiStatus.textProcessor ? '✅' : '❌');
                        console.log('Speech Processor:', aiResponse.aiStatus.speechProcessor ? '✅' : '❌');
                        console.log('Personalization Engine:', aiResponse.aiStatus.personalizationEngine ? '✅' : '❌');
                        console.log('Advanced AI:', aiResponse.aiStatus.advancedAI ? '✅' : '❌');
                        
                        if (!aiResponse.aiStatus.aiProcessingEnabled) {
                            console.log('\n❌ AI Processing Disabled');
                            console.log('💡 Most likely cause: API key not configured or invalid');
                        }
                    }
                });
            }
        });
    });
}, 1000);

console.log('\n📖 How to Use This Script:');
console.log('==========================');
console.log('1. Open browser console (F12)');
console.log('2. Copy and paste this entire script');
console.log('3. Press Enter to run');
console.log('4. Check the output for issues and fixes');
console.log('\n🔗 Quick Fixes:');
console.log('===============');
console.log('• No API key: Visit https://makersuite.google.com/app/apikey');
console.log('• Extension not loaded: Check chrome://extensions/');
console.log('• Content script issues: Refresh the webpage');
console.log('• Settings not saved: Click Save in extension options');