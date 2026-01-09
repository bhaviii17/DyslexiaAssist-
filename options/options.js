// Options Page Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    initializeTabs();
    
    // Initialize all form elements
    initializeElements();
    
    // Load saved settings
    loadAllSettings();
    
    // Setup event listeners
    setupEventListeners();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
}

function initializeElements() {
    // Get all form elements
    const elements = {
        // Reading tab
        fontFamilyAdvanced: document.getElementById('font-family-advanced'),
        fontSizeAdvanced: document.getElementById('font-size-advanced'),
        fontSizeDisplay: document.getElementById('font-size-display'),
        fontWeight: document.getElementById('font-weight'),
        lineHeightAdvanced: document.getElementById('line-height-advanced'),
        lineHeightDisplay: document.getElementById('line-height-display'),
        letterSpacingAdvanced: document.getElementById('letter-spacing-advanced'),
        letterSpacingDisplay: document.getElementById('letter-spacing-display'),
        wordSpacingAdvanced: document.getElementById('word-spacing-advanced'),
        wordSpacingDisplay: document.getElementById('word-spacing-display'),
        paragraphSpacing: document.getElementById('paragraph-spacing'),
        paragraphSpacingDisplay: document.getElementById('paragraph-spacing-display'),
        
        // AI Features
        aiEnabled: document.getElementById('ai-enabled'),
        googleAiKey: document.getElementById('google-ai-key'),
        autoSimplify: document.getElementById('auto-simplify'),
        autoSummarize: document.getElementById('auto-summarize'),
        summaryLength: document.getElementById('summary-length'),
        summaryLengthDisplay: document.getElementById('summary-length-value'),
        autoTranslate: document.getElementById('auto-translate'),
        targetLanguage: document.getElementById('target-language'),
        speechEnabled: document.getElementById('speech-enabled'),
        speechRate: document.getElementById('speech-rate'),
        speechRateDisplay: document.getElementById('speech-rate-value'),
        voiceCommands: document.getElementById('voice-commands'),
        adaptiveLearning: document.getElementById('adaptive-learning'),
        readingSpeed: document.getElementById('reading-speed'),
        complexityPreference: document.getElementById('complexity-preference'),
        
        // Advanced AI Features
        enableAdvancedAi: document.getElementById('enable-advanced-ai'),
        aiProcessingMode: document.getElementById('ai-processing-mode'),
        difficultyThreshold: document.getElementById('difficulty-threshold'),
        difficultyThresholdDisplay: document.getElementById('difficulty-threshold-value'),
        voiceCommandLanguage: document.getElementById('voice-command-language'),
        personalizationLearning: document.getElementById('personalization-learning'),
        aiSuggestionsFrequency: document.getElementById('ai-suggestions-frequency'),
        quickSimplify: document.getElementById('quick-simplify'),
        quickSummarize: document.getElementById('quick-summarize'),
        quickTranslate: document.getElementById('quick-translate'),
        quickExplain: document.getElementById('quick-explain'),
        smartKeywordExtraction: document.getElementById('smart-keyword-extraction'),
        sentimentAnalysis: document.getElementById('sentiment-analysis'),
        difficultyAnalysis: document.getElementById('difficulty-analysis'),
        intelligentQa: document.getElementById('intelligent-qa'),
        
        // Visual tab
        readingGuideAdvanced: document.getElementById('reading-guide-advanced'),
        highlightLinksAdvanced: document.getElementById('highlight-links-advanced'),
        focusEnhancement: document.getElementById('focus-enhancement'),
        textSelection: document.getElementById('text-selection'),
        colorOverlay: document.getElementById('color-overlay'),
        brightnessAdvanced: document.getElementById('brightness-advanced'),
        brightnessDisplay: document.getElementById('brightness-display'),
        contrast: document.getElementById('contrast'),
        contrastDisplay: document.getElementById('contrast-display'),
        
        // Advanced tab
        reduceAnimationsAdvanced: document.getElementById('reduce-animations-advanced'),
        pauseGifs: document.getElementById('pause-gifs'),
        simplifyLayout: document.getElementById('simplify-layout'),
        justifyText: document.getElementById('justify-text'),
        
        // Action buttons
        saveSettings: document.getElementById('save-settings'),
        resetAll: document.getElementById('reset-all'),
        exportSettings: document.getElementById('export-settings'),
        importSettings: document.getElementById('import-settings'),
        importFile: document.getElementById('import-file'),
        statusMessage: document.getElementById('status-message'),
        testApiKey: document.getElementById('test-api-key'),
        showApiKey: document.getElementById('show-api-key'),
        apiKeyStatus: document.getElementById('api-key-status')
    };
    
    // Store elements globally for easy access
    window.optionsElements = elements;
}

function setupEventListeners() {
    const elements = window.optionsElements;
    
    // Range input listeners with live display updates
    elements.fontSizeAdvanced.addEventListener('input', function() {
        elements.fontSizeDisplay.textContent = this.value + 'px';
    });
    
    elements.lineHeightAdvanced.addEventListener('input', function() {
        elements.lineHeightDisplay.textContent = this.value;
    });
    
    elements.letterSpacingAdvanced.addEventListener('input', function() {
        elements.letterSpacingDisplay.textContent = this.value + 'px';
    });
    
    elements.wordSpacingAdvanced.addEventListener('input', function() {
        elements.wordSpacingDisplay.textContent = this.value + 'px';
    });
    
    elements.paragraphSpacing.addEventListener('input', function() {
        elements.paragraphSpacingDisplay.textContent = this.value + 'em';
    });
    
    elements.brightnessAdvanced.addEventListener('input', function() {
        elements.brightnessDisplay.textContent = this.value + '%';
    });
    
    elements.contrast.addEventListener('input', function() {
        elements.contrastDisplay.textContent = this.value + '%';
    });
    
    // AI-specific range input listeners
    if (elements.summaryLength && elements.summaryLengthDisplay) {
        elements.summaryLength.addEventListener('input', function() {
            elements.summaryLengthDisplay.textContent = this.value + ' words';
        });
    }
    
    if (elements.speechRate && elements.speechRateDisplay) {
        elements.speechRate.addEventListener('input', function() {
            elements.speechRateDisplay.textContent = this.value + 'x';
        });
    }
    
    if (elements.difficultyThreshold && elements.difficultyThresholdDisplay) {
        elements.difficultyThreshold.addEventListener('input', function() {
            elements.difficultyThresholdDisplay.textContent = 'Grade ' + this.value;
        });
    }
    
    // Button listeners
    elements.saveSettings.addEventListener('click', saveAllSettings);
    elements.resetAll.addEventListener('click', resetAllSettings);
    elements.exportSettings.addEventListener('click', exportSettings);
    elements.importSettings.addEventListener('click', function() {
        elements.importFile.click();
    });
    elements.importFile.addEventListener('change', importSettings);
    
    // API Key testing
    if (elements.testApiKey) {
        elements.testApiKey.addEventListener('click', testApiKey);
    }
    if (elements.showApiKey) {
        elements.showApiKey.addEventListener('click', toggleApiKeyVisibility);
    }
    
    // Auto-save on change (optional - can be removed if you prefer manual save)
    const autoSaveElements = [
        elements.fontFamilyAdvanced,
        elements.fontSizeAdvanced,
        elements.fontWeight,
        elements.lineHeightAdvanced,
        elements.letterSpacingAdvanced,
        elements.wordSpacingAdvanced,
        elements.paragraphSpacing,
        elements.readingGuideAdvanced,
        elements.highlightLinksAdvanced,
        elements.focusEnhancement,
        elements.textSelection,
        elements.colorOverlay,
        elements.brightnessAdvanced,
        elements.contrast,
        elements.reduceAnimationsAdvanced,
        elements.pauseGifs,
        elements.simplifyLayout,
        elements.justifyText
    ];
    
    autoSaveElements.forEach(element => {
        if (element) {
            element.addEventListener('change', saveAllSettings);
        }
    });
}

function loadAllSettings() {
    const defaultSettings = {
        'font-family': 'default',
        'font-size': 16,
        'font-weight': 'normal',
        'line-spacing': 1.5,
        'letter-spacing': 0,
        'word-spacing': 0,
        'paragraph-spacing': 1,
        'reading-guide': false,
        'highlight-links': false,
        'focus-enhancement': false,
        'text-selection': false,
        'color-filter': 'none',
        'brightness': 100,
        'contrast': 100,
        'reduce-animations': false,
        'pause-gifs': false,
        'simplify-layout': false,
        'justify-text': false,
        
        // AI Settings
        'ai-enabled': false,
        'google-ai-key': '',
        'auto-simplify': false,
        'auto-summarize': false,
        'summary-length': 150,
        'auto-translate': false,
        'target-language': 'en',
        'speech-enabled': false,
        'speech-rate': 0.8,
        'voice-commands': false,
        'adaptive-learning': false,
        'reading-speed': 'medium',
        'complexity-preference': 'medium',
        
        // Advanced AI Settings
        'enable-advanced-ai': true,
        'ai-processing-mode': 'automatic',
        'difficulty-threshold': 7,
        'voice-command-language': 'en-US',
        'personalization-learning': true,
        'ai-suggestions-frequency': 'balanced',
        'quick-simplify': true,
        'quick-summarize': true,
        'quick-translate': true,
        'quick-explain': true,
        'smart-keyword-extraction': true,
        'sentiment-analysis': true,
        'difficulty-analysis': true,
        'intelligent-qa': true
    };
    
    chrome.storage.sync.get(defaultSettings, function(result) {
        const elements = window.optionsElements;
        
        // Reading settings
        elements.fontFamilyAdvanced.value = result['font-family'];
        elements.fontSizeAdvanced.value = result['font-size'];
        elements.fontSizeDisplay.textContent = result['font-size'] + 'px';
        elements.fontWeight.value = result['font-weight'];
        elements.lineHeightAdvanced.value = result['line-spacing'];
        elements.lineHeightDisplay.textContent = result['line-spacing'];
        elements.letterSpacingAdvanced.value = result['letter-spacing'];
        elements.letterSpacingDisplay.textContent = result['letter-spacing'] + 'px';
        elements.wordSpacingAdvanced.value = result['word-spacing'];
        elements.wordSpacingDisplay.textContent = result['word-spacing'] + 'px';
        elements.paragraphSpacing.value = result['paragraph-spacing'];
        elements.paragraphSpacingDisplay.textContent = result['paragraph-spacing'] + 'em';
        
        // Visual settings
        elements.readingGuideAdvanced.checked = result['reading-guide'];
        elements.highlightLinksAdvanced.checked = result['highlight-links'];
        elements.focusEnhancement.checked = result['focus-enhancement'];
        elements.textSelection.checked = result['text-selection'];
        elements.colorOverlay.value = result['color-filter'];
        elements.brightnessAdvanced.value = result['brightness'];
        elements.brightnessDisplay.textContent = result['brightness'] + '%';
        elements.contrast.value = result['contrast'];
        elements.contrastDisplay.textContent = result['contrast'] + '%';
        
        // Advanced settings
        elements.reduceAnimationsAdvanced.checked = result['reduce-animations'];
        elements.pauseGifs.checked = result['pause-gifs'];
        elements.simplifyLayout.checked = result['simplify-layout'];
        elements.justifyText.checked = result['justify-text'];
        
        // AI Settings
        if (elements.aiEnabled) elements.aiEnabled.checked = result['ai-enabled'];
        if (elements.googleAiKey) elements.googleAiKey.value = result['google-ai-key'];
        if (elements.autoSimplify) elements.autoSimplify.checked = result['auto-simplify'];
        if (elements.autoSummarize) elements.autoSummarize.checked = result['auto-summarize'];
        if (elements.summaryLength) {
            elements.summaryLength.value = result['summary-length'];
            if (elements.summaryLengthDisplay) elements.summaryLengthDisplay.textContent = result['summary-length'] + ' words';
        }
        if (elements.autoTranslate) elements.autoTranslate.checked = result['auto-translate'];
        if (elements.targetLanguage) elements.targetLanguage.value = result['target-language'];
        if (elements.speechEnabled) elements.speechEnabled.checked = result['speech-enabled'];
        if (elements.speechRate) {
            elements.speechRate.value = result['speech-rate'];
            if (elements.speechRateDisplay) elements.speechRateDisplay.textContent = result['speech-rate'] + 'x';
        }
        if (elements.voiceCommands) elements.voiceCommands.checked = result['voice-commands'];
        if (elements.adaptiveLearning) elements.adaptiveLearning.checked = result['adaptive-learning'];
        if (elements.readingSpeed) elements.readingSpeed.value = result['reading-speed'];
        if (elements.complexityPreference) elements.complexityPreference.value = result['complexity-preference'];
        
        // Advanced AI Settings
        if (elements.enableAdvancedAi) elements.enableAdvancedAi.checked = result['enable-advanced-ai'];
        if (elements.aiProcessingMode) elements.aiProcessingMode.value = result['ai-processing-mode'];
        if (elements.difficultyThreshold) {
            elements.difficultyThreshold.value = result['difficulty-threshold'];
            if (elements.difficultyThresholdDisplay) elements.difficultyThresholdDisplay.textContent = 'Grade ' + result['difficulty-threshold'];
        }
        if (elements.voiceCommandLanguage) elements.voiceCommandLanguage.value = result['voice-command-language'];
        if (elements.personalizationLearning) elements.personalizationLearning.checked = result['personalization-learning'];
        if (elements.aiSuggestionsFrequency) elements.aiSuggestionsFrequency.value = result['ai-suggestions-frequency'];
        if (elements.quickSimplify) elements.quickSimplify.checked = result['quick-simplify'];
        if (elements.quickSummarize) elements.quickSummarize.checked = result['quick-summarize'];
        if (elements.quickTranslate) elements.quickTranslate.checked = result['quick-translate'];
        if (elements.quickExplain) elements.quickExplain.checked = result['quick-explain'];
        if (elements.smartKeywordExtraction) elements.smartKeywordExtraction.checked = result['smart-keyword-extraction'];
        if (elements.sentimentAnalysis) elements.sentimentAnalysis.checked = result['sentiment-analysis'];
        if (elements.difficultyAnalysis) elements.difficultyAnalysis.checked = result['difficulty-analysis'];
        if (elements.intelligentQa) elements.intelligentQa.checked = result['intelligent-qa'];
    });
}

function saveAllSettings() {
    const elements = window.optionsElements;
    
    const settings = {
        'font-family': elements.fontFamilyAdvanced.value,
        'font-size': parseInt(elements.fontSizeAdvanced.value),
        'font-weight': elements.fontWeight.value,
        'line-spacing': parseFloat(elements.lineHeightAdvanced.value),
        'letter-spacing': parseFloat(elements.letterSpacingAdvanced.value),
        'word-spacing': parseFloat(elements.wordSpacingAdvanced.value),
        'paragraph-spacing': parseFloat(elements.paragraphSpacing.value),
        'reading-guide': elements.readingGuideAdvanced.checked,
        'highlight-links': elements.highlightLinksAdvanced.checked,
        'focus-enhancement': elements.focusEnhancement.checked,
        'text-selection': elements.textSelection.checked,
        'color-filter': elements.colorOverlay.value,
        'brightness': parseInt(elements.brightnessAdvanced.value),
        'contrast': parseInt(elements.contrast.value),
        'reduce-animations': elements.reduceAnimationsAdvanced.checked,
        'pause-gifs': elements.pauseGifs.checked,
        'simplify-layout': elements.simplifyLayout.checked,
        'justify-text': elements.justifyText.checked,
        
        // AI Settings
        'ai-enabled': elements.aiEnabled?.checked || false,
        'google-ai-key': elements.googleAiKey?.value || '',
        'auto-simplify': elements.autoSimplify?.checked || false,
        'auto-summarize': elements.autoSummarize?.checked || false,
        'summary-length': parseInt(elements.summaryLength?.value || 150),
        'auto-translate': elements.autoTranslate?.checked || false,
        'target-language': elements.targetLanguage?.value || 'en',
        'speech-enabled': elements.speechEnabled?.checked || false,
        'speech-rate': parseFloat(elements.speechRate?.value || 0.8),
        'voice-commands': elements.voiceCommands?.checked || false,
        'adaptive-learning': elements.adaptiveLearning?.checked || false,
        'reading-speed': elements.readingSpeed?.value || 'medium',
        'complexity-preference': elements.complexityPreference?.value || 'medium',
        
        // Advanced AI Settings
        'enable-advanced-ai': elements.enableAdvancedAi?.checked || false,
        'ai-processing-mode': elements.aiProcessingMode?.value || 'automatic',
        'difficulty-threshold': parseInt(elements.difficultyThreshold?.value || 7),
        'voice-command-language': elements.voiceCommandLanguage?.value || 'en-US',
        'personalization-learning': elements.personalizationLearning?.checked || false,
        'ai-suggestions-frequency': elements.aiSuggestionsFrequency?.value || 'balanced',
        'quick-simplify': elements.quickSimplify?.checked || false,
        'quick-summarize': elements.quickSummarize?.checked || false,
        'quick-translate': elements.quickTranslate?.checked || false,
        'quick-explain': elements.quickExplain?.checked || false,
        'smart-keyword-extraction': elements.smartKeywordExtraction?.checked || false,
        'sentiment-analysis': elements.sentimentAnalysis?.checked || false,
        'difficulty-analysis': elements.difficultyAnalysis?.checked || false,
        'intelligent-qa': elements.intelligentQa?.checked || false
    };
    
    chrome.storage.sync.set(settings, function() {
        showStatusMessage('Settings saved successfully!', 'success');
        
        // Update all active tabs
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(function(tab) {
                if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'updateSettings',
                        settings: settings
                    }).catch(() => {
                        // Ignore errors for tabs without content script
                    });
                }
            });
        });
    });
}

function resetAllSettings() {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
        chrome.storage.sync.clear(function() {
            loadAllSettings();
            showStatusMessage('All settings have been reset to default.', 'success');
            
            // Notify all tabs to reset
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function(tab) {
                    if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
                        chrome.tabs.sendMessage(tab.id, {
                            action: 'resetSettings'
                        }).catch(() => {
                            // Ignore errors for tabs without content script
                        });
                    }
                });
            });
        });
    }
}

function exportSettings() {
    chrome.storage.sync.get(null, function(settings) {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'dyslexia-assist-settings.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showStatusMessage('Settings exported successfully!', 'success');
    });
}

function importSettings(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const settings = JSON.parse(e.target.result);
            
            chrome.storage.sync.set(settings, function() {
                loadAllSettings();
                showStatusMessage('Settings imported successfully!', 'success');
                
                // Update all active tabs
                chrome.tabs.query({}, function(tabs) {
                    tabs.forEach(function(tab) {
                        if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
                            chrome.tabs.sendMessage(tab.id, {
                                action: 'updateSettings',
                                settings: settings
                            }).catch(() => {
                                // Ignore errors for tabs without content script
                            });
                        }
                    });
                });
            });
        } catch (error) {
            showStatusMessage('Error importing settings: Invalid file format.', 'error');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

function showStatusMessage(message, type) {
    const statusElement = window.optionsElements.statusMessage;
    statusElement.textContent = message;
    statusElement.className = 'status-message show ' + type;
    
    setTimeout(function() {
        statusElement.classList.remove('show');
    }, 3000);
}

// API Key testing functions
async function testApiKey() {
    const apiKey = window.optionsElements.googleAiKey.value.trim();
    const statusEl = window.optionsElements.apiKeyStatus;
    
    if (!apiKey) {
        showApiKeyStatus('Please enter an API key first', 'error');
        return;
    }
    
    showApiKeyStatus('Testing API key...', 'info');
    window.optionsElements.testApiKey.disabled = true;
    
    try {
        // Test with multiple model names to find the working one
        const models = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro'];
        let lastError = null;
        
        for (const model of models) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: 'Test connection. Respond with "OK"'
                            }]
                        }]
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates && data.candidates.length > 0) {
                        showApiKeyStatus(`✅ API key is working correctly with model: ${model}!`, 'success');
                        return;
                    }
                } else if (response.status !== 404) {
                    // If it's not a 404, it means the model exists but there's another issue
                    lastError = `Model ${model}: ${response.status} - ${response.statusText}`;
                    break;
                }
            } catch (error) {
                lastError = error.message;
            }
        }
        
        // If we get here, none of the models worked
        if (lastError) {
            throw new Error(lastError);
        } else {
            throw new Error('No working model found - API may be unavailable');
        }
    } catch (error) {
        console.error('API test error:', error);
        showApiKeyStatus('❌ Connection failed. Check your internet connection.', 'error');
    } finally {
        window.optionsElements.testApiKey.disabled = false;
    }
}

function toggleApiKeyVisibility() {
    const apiKeyInput = window.optionsElements.googleAiKey;
    const button = window.optionsElements.showApiKey;
    
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        button.textContent = 'Hide Key';
    } else {
        apiKeyInput.type = 'password';
        button.textContent = 'Show Key';
    }
}

function showApiKeyStatus(message, type) {
    const statusEl = window.optionsElements.apiKeyStatus;
    statusEl.textContent = message;
    statusEl.className = `ai-status-message ${type}`;
    statusEl.style.display = 'block';
    
    // Auto-hide after 5 seconds for non-error messages
    if (type !== 'error') {
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }
}