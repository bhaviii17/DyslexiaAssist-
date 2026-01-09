// Popup Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('DyslexiaAssist popup loaded');
    
    try {
        initializePopup();
    } catch (error) {
        console.error('Error initializing popup:', error);
        // Show error in popup
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #d32f2f;">
                    <h3>Extension Error</h3>
                    <p>There was an error loading the extension. Please check the console for details.</p>
                    <button onclick="location.reload()">Reload</button>
                </div>
            `;
        }
    }
});

function initializePopup() {
    // Get all form elements
    const fontSelect = document.getElementById('font-select');
    const fontSizeRange = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const lineSpacingRange = document.getElementById('line-spacing');
    const lineSpacingValue = document.getElementById('line-spacing-value');
    const letterSpacingRange = document.getElementById('letter-spacing');
    const letterSpacingValue = document.getElementById('letter-spacing-value');
    const wordSpacingRange = document.getElementById('word-spacing');
    const wordSpacingValue = document.getElementById('word-spacing-value');
    const readingGuideCheck = document.getElementById('reading-guide');
    const highlightLinksCheck = document.getElementById('highlight-links');
    const reduceAnimationsCheck = document.getElementById('reduce-animations');
    const colorFilterSelect = document.getElementById('color-filter');
    const brightnessRange = document.getElementById('brightness');
    const brightnessValue = document.getElementById('brightness-value');
    const showReaderBtn = document.getElementById('show-reader-btn');
    const resetBtn = document.getElementById('reset-btn');
    const optionsBtn = document.getElementById('options-btn');
    const testExtensionBtn = document.getElementById('test-extension-btn');

    // Accessibility Score Elements
    const refreshScoreBtn = document.getElementById('refresh-score-btn');
    const scoreCircle = document.getElementById('score-circle');
    const scoreNumber = document.getElementById('score-number');
    const scoreStatus = document.getElementById('score-status');
    const readabilityScore = document.getElementById('readability-score');
    const contrastScore = document.getElementById('contrast-score');
    const layoutScore = document.getElementById('layout-score');
    const viewDetailsBtn = document.getElementById('view-details-btn');

    // Text-to-Speech Elements
    const ttsStatus = document.getElementById('tts-status');
    const ttsReadPageBtn = document.getElementById('tts-read-page');
    const ttsReadSelectionBtn = document.getElementById('tts-read-selection');
    const ttsStopBtn = document.getElementById('tts-stop');
    const ttsTestBtn = document.getElementById('tts-test');
    const ttsSpeedRange = document.getElementById('tts-speed');
    const ttsSpeedValue = document.getElementById('tts-speed-value');
    const ttsVoiceSelect = document.getElementById('tts-voice');

    // AI Elements
    const aiEnabledCheck = document.getElementById('ai-enabled-popup');
    const aiStatusIndicator = document.getElementById('ai-status-indicator');
    const aiStatusText = document.getElementById('ai-status-text');
    const aiControls = document.getElementById('ai-controls');
    const aiQuickActions = document.getElementById('ai-quick-actions');
    const autoSimplifyCheck = document.getElementById('auto-simplify-popup');
    const autoSummarizeCheck = document.getElementById('auto-summarize-popup');
    const smartTranslationCheck = document.getElementById('smart-translation-popup');
    const targetLanguageSelect = document.getElementById('target-language-popup');
    const voiceCommandsCheck = document.getElementById('voice-commands-popup');
    const adaptiveLearningCheck = document.getElementById('adaptive-learning-popup');
    
    // Quick Action Buttons
    const quickSimplifyBtn = document.getElementById('quick-simplify');
    const quickSummarizeBtn = document.getElementById('quick-summarize');
    const quickTranslateBtn = document.getElementById('quick-translate');
    const quickAnalyzeBtn = document.getElementById('quick-analyze');
    const quickSpeakBtn = document.getElementById('quick-speak');
    const quickVoiceBtn = document.getElementById('quick-voice');

    // Load saved settings
    loadSettings();

    // Add event listeners
    if (fontSelect) {
        fontSelect.addEventListener('change', updateSettings);
    } else {
        console.error('Font select element not found');
    }
    
    if (fontSizeRange) {
        fontSizeRange.addEventListener('input', function() {
            if (fontSizeValue) fontSizeValue.textContent = this.value + 'px';
            updateSettings();
        });
    } else {
        console.error('Font size range element not found');
    }
    lineSpacingRange.addEventListener('input', function() {
        lineSpacingValue.textContent = this.value;
        updateSettings();
    });
    letterSpacingRange.addEventListener('input', function() {
        letterSpacingValue.textContent = this.value + 'px';
        updateSettings();
    });
    wordSpacingRange.addEventListener('input', function() {
        wordSpacingValue.textContent = this.value + 'px';
        updateSettings();
    });
    readingGuideCheck.addEventListener('change', updateSettings);
    highlightLinksCheck.addEventListener('change', updateSettings);
    reduceAnimationsCheck.addEventListener('change', updateSettings);
    colorFilterSelect.addEventListener('change', updateSettings);
    brightnessRange.addEventListener('input', function() {
        brightnessValue.textContent = this.value + '%';
        updateSettings();
    });

    // AI Event Listeners
    if (aiEnabledCheck) {
        aiEnabledCheck.addEventListener('change', function() {
            toggleAIControls();
            updateSettings();
        });
    }

    if (autoSimplifyCheck) autoSimplifyCheck.addEventListener('change', updateSettings);
    if (autoSummarizeCheck) autoSummarizeCheck.addEventListener('change', updateSettings);
    if (smartTranslationCheck) smartTranslationCheck.addEventListener('change', updateSettings);
    if (targetLanguageSelect) targetLanguageSelect.addEventListener('change', updateSettings);
    if (voiceCommandsCheck) voiceCommandsCheck.addEventListener('change', updateSettings);
    if (adaptiveLearningCheck) adaptiveLearningCheck.addEventListener('change', updateSettings);

    // Quick Action Event Listeners
    if (quickSimplifyBtn) quickSimplifyBtn.addEventListener('click', () => executeQuickAction('simplify'));
    if (quickSummarizeBtn) quickSummarizeBtn.addEventListener('click', () => executeQuickAction('summarize'));
    if (quickTranslateBtn) quickTranslateBtn.addEventListener('click', () => executeQuickAction('translate'));
    if (quickAnalyzeBtn) quickAnalyzeBtn.addEventListener('click', () => executeQuickAction('analyze'));
    if (quickSpeakBtn) quickSpeakBtn.addEventListener('click', () => executeQuickAction('speak'));
    if (quickVoiceBtn) quickVoiceBtn.addEventListener('click', () => executeQuickAction('voice'));

    if (showReaderBtn) showReaderBtn.addEventListener('click', showContentReader);
    if (resetBtn) resetBtn.addEventListener('click', resetSettings);
    if (optionsBtn) optionsBtn.addEventListener('click', openOptions);
    if (testExtensionBtn) testExtensionBtn.addEventListener('click', testExtension);

    // Accessibility Score Event Listeners
    if (refreshScoreBtn) refreshScoreBtn.addEventListener('click', refreshAccessibilityScore);
    if (viewDetailsBtn) viewDetailsBtn.addEventListener('click', viewFullAccessibilityReport);

    // Text-to-Speech Event Listeners
    if (ttsReadPageBtn) ttsReadPageBtn.addEventListener('click', readPageAloud);
    if (ttsReadSelectionBtn) ttsReadSelectionBtn.addEventListener('click', readSelectionAloud);
    if (ttsStopBtn) ttsStopBtn.addEventListener('click', stopSpeaking);
    if (ttsTestBtn) ttsTestBtn.addEventListener('click', () => {
        console.log('Test TTS button clicked');
        speakText('Hello! This is a test of the text to speech functionality. If you can hear this, the TTS is working correctly.');
    });
    if (ttsSpeedRange) {
        ttsSpeedRange.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            ttsSpeedValue.textContent = speed.toFixed(1) + 'x';
            updateTTSSettings();
        });
    }
    if (ttsVoiceSelect) ttsVoiceSelect.addEventListener('change', updateTTSSettings);

    // Initialize TTS
    initializeTTS();

    // Initialize accessibility score
    initializeAccessibilityScore();

    function loadSettings() {
        chrome.storage.sync.get([
            'font-family',
            'font-size',
            'line-spacing',
            'letter-spacing',
            'word-spacing',
            'reading-guide',
            'highlight-links',
            'reduce-animations',
            'color-filter',
            'brightness',
            // AI Settings
            'ai-enabled',
            'google-ai-key',
            'auto-simplify',
            'auto-summarize',
            'auto-translate',
            'target-language',
            'voice-commands',
            'adaptive-learning'
        ], function(result) {
            // Set form values from storage
            fontSelect.value = result['font-family'] || 'default';
            fontSizeRange.value = result['font-size'] || 16;
            fontSizeValue.textContent = (result['font-size'] || 16) + 'px';
            lineSpacingRange.value = result['line-spacing'] || 1.5;
            lineSpacingValue.textContent = result['line-spacing'] || 1.5;
            letterSpacingRange.value = result['letter-spacing'] || 0;
            letterSpacingValue.textContent = (result['letter-spacing'] || 0) + 'px';
            wordSpacingRange.value = result['word-spacing'] || 0;
            wordSpacingValue.textContent = (result['word-spacing'] || 0) + 'px';
            readingGuideCheck.checked = result['reading-guide'] || false;
            highlightLinksCheck.checked = result['highlight-links'] || false;
            reduceAnimationsCheck.checked = result['reduce-animations'] || false;
            colorFilterSelect.value = result['color-filter'] || 'none';
            brightnessRange.value = result['brightness'] || 100;
            brightnessValue.textContent = (result['brightness'] || 100) + '%';

            // Load AI Settings
            if (aiEnabledCheck) aiEnabledCheck.checked = result['ai-enabled'] || false;
            if (autoSimplifyCheck) autoSimplifyCheck.checked = result['auto-simplify'] || false;
            if (autoSummarizeCheck) autoSummarizeCheck.checked = result['auto-summarize'] || false;
            if (smartTranslationCheck) smartTranslationCheck.checked = result['auto-translate'] || false;
            if (targetLanguageSelect) targetLanguageSelect.value = result['target-language'] || 'en';
            if (voiceCommandsCheck) voiceCommandsCheck.checked = result['voice-commands'] || false;
            if (adaptiveLearningCheck) adaptiveLearningCheck.checked = result['adaptive-learning'] || false;

            // Update AI status and controls
            updateAIStatus(result['google-ai-key'], result['ai-enabled']);
            toggleAIControls();
        });
    }

    function updateSettings() {
        const settings = {
            'font-family': fontSelect.value,
            'font-size': parseInt(fontSizeRange.value),
            'line-spacing': parseFloat(lineSpacingRange.value),
            'letter-spacing': parseFloat(letterSpacingRange.value),
            'word-spacing': parseFloat(wordSpacingRange.value),
            'reading-guide': readingGuideCheck.checked,
            'highlight-links': highlightLinksCheck.checked,
            'reduce-animations': reduceAnimationsCheck.checked,
            'color-filter': colorFilterSelect.value,
            'brightness': parseInt(brightnessRange.value)
        };

        // Add AI settings if elements exist
        if (aiEnabledCheck) settings['ai-enabled'] = aiEnabledCheck.checked;
        if (autoSimplifyCheck) settings['auto-simplify'] = autoSimplifyCheck.checked;
        if (autoSummarizeCheck) settings['auto-summarize'] = autoSummarizeCheck.checked;
        if (smartTranslationCheck) settings['auto-translate'] = smartTranslationCheck.checked;
        if (targetLanguageSelect) settings['target-language'] = targetLanguageSelect.value;
        if (voiceCommandsCheck) settings['voice-commands'] = voiceCommandsCheck.checked;
        if (adaptiveLearningCheck) settings['adaptive-learning'] = adaptiveLearningCheck.checked;

        // Save to storage
        chrome.storage.sync.set(settings);

        // Send message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'updateSettings',
                settings: settings
            });
        });
    }

    function resetSettings() {
        // Clear storage
        chrome.storage.sync.clear();
        
        // Reset form values
        fontSelect.value = 'default';
        fontSizeRange.value = 16;
        fontSizeValue.textContent = '16px';
        lineSpacingRange.value = 1.5;
        lineSpacingValue.textContent = '1.5';
        letterSpacingRange.value = 0;
        letterSpacingValue.textContent = '0px';
        wordSpacingRange.value = 0;
        wordSpacingValue.textContent = '0px';
        readingGuideCheck.checked = false;
        highlightLinksCheck.checked = false;
        reduceAnimationsCheck.checked = false;
        colorFilterSelect.value = 'none';
        brightnessRange.value = 100;
        brightnessValue.textContent = '100%';

        // Send reset message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'resetSettings'
            });
        });
    }

    function openOptions() {
        chrome.runtime.openOptionsPage();
    }

    function showContentReader() {
        // Send message to content script to show the reader popup
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'showContentPopup'
            }, function(response) {
                if (response && response.success) {
                    // Close the popup after successfully opening reader
                    window.close();
                } else {
                    console.error('Failed to open content reader');
                }
            });
        });
    }

    // AI-specific functions
    async function updateAIStatus(apiKey, aiEnabled) {
        if (!aiStatusIndicator || !aiStatusText) return;

        if (!apiKey) {
            aiStatusIndicator.className = 'status-indicator disconnected';
            aiStatusText.textContent = 'API key not configured';
            return;
        } 
        
        if (!aiEnabled) {
            aiStatusIndicator.className = 'status-indicator checking';
            aiStatusText.textContent = 'AI features disabled';
            return;
        } 

        // Test AI features in content script
        try {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (tabs[0]) {
                const response = await chrome.tabs.sendMessage(tabs[0].id, {action: 'testAI'});
                if (response && response.success && response.aiStatus) {
                    const status = response.aiStatus;
                    console.log('AI Status from content script:', status);
                    
                    if (status.aiProcessingEnabled && status.textProcessor && status.advancedAI) {
                        aiStatusIndicator.className = 'status-indicator connected';
                        aiStatusText.textContent = 'AI features ready';
                    } else {
                        aiStatusIndicator.className = 'status-indicator checking';
                        aiStatusText.textContent = 'AI modules loading...';
                        
                        // Try again in a moment
                        setTimeout(() => updateAIStatus(apiKey, aiEnabled), 2000);
                    }
                } else {
                    aiStatusIndicator.className = 'status-indicator checking';
                    aiStatusText.textContent = 'Content script not ready';
                }
            } else {
                aiStatusIndicator.className = 'status-indicator checking';
                aiStatusText.textContent = 'No active tab';
            }
        } catch (error) {
            console.error('Error checking AI status:', error);
            aiStatusIndicator.className = 'status-indicator checking';
            aiStatusText.textContent = 'Checking AI status...';
        }
    }

    function toggleAIControls() {
        if (!aiEnabledCheck || !aiControls || !aiQuickActions) return;

        const isEnabled = aiEnabledCheck.checked;
        aiControls.style.display = isEnabled ? 'block' : 'none';
        aiQuickActions.style.display = isEnabled ? 'block' : 'none';

        // Enable/disable quick action buttons based on AI status
        const quickButtons = [quickSimplifyBtn, quickSummarizeBtn, quickTranslateBtn, 
                             quickAnalyzeBtn, quickSpeakBtn, quickVoiceBtn];
        
        quickButtons.forEach(btn => {
            if (btn) {
                btn.disabled = !isEnabled;
            }
        });
    }

    async function executeQuickAction(action) {
        // Get the button element
        const buttonMap = {
            'simplify': quickSimplifyBtn,
            'summarize': quickSummarizeBtn,
            'translate': quickTranslateBtn,
            'analyze': quickAnalyzeBtn,
            'speak': quickSpeakBtn,
            'voice': quickVoiceBtn
        };

        const button = buttonMap[action];
        if (!button) return;

        // Show processing state
        button.classList.add('processing');
        button.disabled = true;
        const originalText = button.textContent;

        try {
            // Get active tab
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs[0]) return;

            // Send message to content script based on action
            switch (action) {
                case 'simplify':
                    button.textContent = 'Processing...';
                    await chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'showContentPopup',
                        autoProcess: 'simplify'
                    });
                    break;

                case 'summarize':
                    button.textContent = 'Processing...';
                    await chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'showContentPopup',
                        autoProcess: 'summarize'
                    });
                    break;

                case 'translate':
                    button.textContent = 'Translating...';
                    const targetLang = targetLanguageSelect ? targetLanguageSelect.value : 'hi';
                    await chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'showContentPopup',
                        autoProcess: 'translate',
                        targetLanguage: targetLang
                    });
                    break;

                case 'analyze':
                    button.textContent = 'Analyzing...';
                    await chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'showContentPopup',
                        autoProcess: 'analyze'
                    });
                    break;

                case 'speak':
                    button.textContent = 'Speaking...';
                    await chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'speakPageContent'
                    });
                    break;

                case 'voice':
                    button.textContent = 'Listening...';
                    await chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'showContentPopup',
                        openVoicePanel: true
                    });
                    break;
            }

            // Close popup after action (except for voice which needs to stay open)
            if (action !== 'voice') {
                showSuccessNotification(`${action.charAt(0).toUpperCase() + action.slice(1)} activated!`);
                setTimeout(() => window.close(), 1000);
            }

        } catch (error) {
            console.error('Quick action failed:', error);
            button.textContent = 'Failed';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        } finally {
            // Reset button state
            setTimeout(() => {
                button.classList.remove('processing');
                button.disabled = false;
                button.textContent = originalText;
            }, 2000);
        }
    }

    // Show success notification
    function showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Test extension functionality
    async function testExtension() {
        console.log('Testing DyslexiaAssist extension...');
        
        try {
            // Test 1: Check if we can get active tab
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs[0]) {
                throw new Error('Could not get active tab');
            }
            console.log('✓ Active tab accessible');
            
            // Test 2: Test storage
            await chrome.storage.sync.set({test: 'value'});
            const result = await chrome.storage.sync.get(['test']);
            if (result.test !== 'value') {
                throw new Error('Storage test failed');
            }
            console.log('✓ Chrome storage working');
            
            // Test 3: Check API key
            const apiResult = await chrome.storage.sync.get(['google-ai-key']);
            if (apiResult['google-ai-key']) {
                console.log('✓ AI API key configured');
            } else {
                console.warn('⚠ AI API key not configured');
            }
            
            // Test 4: Test content script communication
            try {
                const response = await chrome.tabs.sendMessage(tabs[0].id, {action: 'ping'});
                if (response && response.success) {
                    console.log('✓ Content script communication working');
                } else {
                    throw new Error('Content script not responding');
                }
            } catch (error) {
                console.error('✗ Content script communication failed:', error);
                throw new Error('Content script not loaded or not responding');
            }
            
            // Show success
            showSuccessNotification('Extension test passed!');
            console.log('🎉 All tests passed!');
            
        } catch (error) {
            console.error('Extension test failed:', error);
            showSuccessNotification('Test failed: ' + error.message);
        }
    }

    // Test extension functionality
    async function testExtension() {
        console.log('Testing extension...');
        
        try {
            // Test 1: Check if we can get the active tab
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs || tabs.length === 0) {
                throw new Error('Cannot access active tab');
            }
            console.log('✓ Active tab accessible:', tabs[0].url);
            
            // Test 2: Try to send a message to content script
            const response = await chrome.tabs.sendMessage(tabs[0].id, {action: 'ping'});
            console.log('✓ Content script responding:', response);
            
            // Test 3: Check storage access
            await chrome.storage.sync.set({testKey: 'testValue'});
            const result = await chrome.storage.sync.get(['testKey']);
            if (result.testKey === 'testValue') {
                console.log('✓ Storage access working');
                await chrome.storage.sync.remove(['testKey']);
            }
            
            showSuccessNotification('Extension test passed!');
            
        } catch (error) {
            console.error('Extension test failed:', error);
            showSuccessNotification('Extension test failed - check console');
        }
    }

    // Accessibility Score Functions
    async function initializeAccessibilityScore() {
        console.log('Initializing accessibility score...');
        showScoreLoading();
        
        try {
            await calculateAccessibilityScore();
        } catch (error) {
            console.error('Failed to initialize accessibility score:', error);
            showScoreError('Failed to analyze page');
        }
    }

    async function refreshAccessibilityScore() {
        console.log('Refreshing accessibility score...');
        showScoreLoading();
        
        try {
            await calculateAccessibilityScore();
        } catch (error) {
            console.error('Failed to refresh accessibility score:', error);
            showScoreError('Failed to refresh analysis');
        }
    }

    async function calculateAccessibilityScore() {
        try {
            // Get current active tab
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs || tabs.length === 0) {
                throw new Error('No active tab found');
            }

            // Send message to content script to analyze accessibility
            const response = await chrome.tabs.sendMessage(tabs[0].id, {
                action: 'analyzeAccessibility'
            });

            if (response && response.success && response.analysis) {
                displayAccessibilityScore(response.analysis);
            } else {
                // Fallback: calculate basic score from page info
                await calculateBasicScore();
            }
        } catch (error) {
            console.warn('Content script analysis failed, using basic analysis:', error);
            await calculateBasicScore();
        }
    }

    async function calculateBasicScore() {
        try {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            const tab = tabs[0];
            
            // Basic analysis based on tab information and simple heuristics
            let score = 60; // Base score
            let readability = 65;
            let contrast = 70;
            let layout = 55;
            let status = 'Fair';

            // URL-based heuristics
            const url = tab.url;
            if (url.includes('wikipedia') || url.includes('gov') || url.includes('edu')) {
                score += 10;
                readability += 15;
                status = 'Good';
            }
            
            if (url.includes('news') || url.includes('blog')) {
                score += 5;
                readability += 5;
            }

            // Check if it's a secure site
            if (url.startsWith('https://')) {
                score += 5;
            }

            // Title-based analysis
            if (tab.title && tab.title.length > 0 && tab.title.length < 60) {
                score += 5;
                layout += 10;
            }

            // Final score calculation
            score = Math.min(100, Math.max(0, score));
            readability = Math.min(100, Math.max(0, readability));
            contrast = Math.min(100, Math.max(0, contrast));
            layout = Math.min(100, Math.max(0, layout));

            // Determine status
            if (score >= 80) status = 'Excellent';
            else if (score >= 70) status = 'Good';
            else if (score >= 50) status = 'Fair';
            else status = 'Poor';

            const analysis = {
                overallScore: score,
                readability: { score: readability },
                colorContrast: { score: contrast },
                layout: { score: layout },
                status: status,
                isBasicAnalysis: true
            };

            displayAccessibilityScore(analysis);
        } catch (error) {
            console.error('Basic score calculation failed:', error);
            showScoreError('Unable to analyze page');
        }
    }

    function displayAccessibilityScore(analysis) {
        // Update score display
        if (scoreNumber) {
            scoreNumber.textContent = analysis.overallScore || '--';
        }
        
        if (scoreStatus) {
            scoreStatus.textContent = analysis.status || 'Unknown';
        }

        // Update breakdown scores
        if (readabilityScore) {
            readabilityScore.textContent = analysis.readability?.score || '--';
        }
        if (contrastScore) {
            contrastScore.textContent = analysis.colorContrast?.score || '--';
        }
        if (layoutScore) {
            layoutScore.textContent = analysis.layout?.score || '--';
        }

        // Update score circle styling
        if (scoreCircle && analysis.overallScore) {
            const score = analysis.overallScore;
            const angle = (score / 100) * 360;
            
            // Remove existing classes
            scoreCircle.classList.remove('excellent', 'good', 'fair', 'poor');
            
            // Add appropriate class based on score
            if (score >= 80) {
                scoreCircle.classList.add('excellent');
            } else if (score >= 70) {
                scoreCircle.classList.add('good');
            } else if (score >= 50) {
                scoreCircle.classList.add('fair');
            } else {
                scoreCircle.classList.add('poor');
            }
            
            // Set CSS custom property for the angle
            scoreCircle.style.setProperty('--score-angle', `${angle}deg`);
        }

        console.log('Accessibility score displayed:', analysis);
    }

    function showScoreLoading() {
        if (scoreNumber) scoreNumber.textContent = '--';
        if (scoreStatus) scoreStatus.textContent = 'Analyzing...';
        if (readabilityScore) readabilityScore.textContent = '--';
        if (contrastScore) contrastScore.textContent = '--';
        if (layoutScore) layoutScore.textContent = '--';
        
        if (scoreCircle) {
            scoreCircle.classList.remove('excellent', 'good', 'fair', 'poor');
        }
    }

    function showScoreError(message) {
        if (scoreNumber) scoreNumber.textContent = '!';
        if (scoreStatus) scoreStatus.textContent = message || 'Error';
        if (readabilityScore) readabilityScore.textContent = '!';
        if (contrastScore) contrastScore.textContent = '!';
        if (layoutScore) layoutScore.textContent = '!';
        
        if (scoreCircle) {
            scoreCircle.classList.remove('excellent', 'good', 'fair', 'poor');
            scoreCircle.classList.add('poor');
        }
    }

    async function viewFullAccessibilityReport() {
        try {
            // Get current active tab
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs || tabs.length === 0) {
                throw new Error('No active tab found');
            }

            // Try to trigger the full accessibility analysis in content script
            const response = await chrome.tabs.sendMessage(tabs[0].id, {
                action: 'showContentPopup'
            });

            if (response && response.success) {
                // Show popup with accessibility button highlighted
                await chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'showContentPopup',
                    highlightAccessibility: true
                });
            } else {
                // Fallback: open options page with analytics
                chrome.runtime.openOptionsPage();
            }
            
            // Close popup
            window.close();
        } catch (error) {
            console.error('Failed to open full report:', error);
            // Fallback: just open options page
            chrome.runtime.openOptionsPage();
            window.close();
        }
    }

    // Text-to-Speech Functions
    let currentUtterance = null;
    let isCurrentlySpeaking = false;
    let ttsSettings = {
        rate: 1.0,
        pitch: 1.0,
        volume: 0.8,
        voice: null
    };

    function initializeTTS() {
        console.log('Initializing Text-to-Speech...');
        
        // Load available voices
        loadTTSVoices();
        
        // Load saved settings
        loadTTSSettings();
        
        // Set up speech synthesis event handlers
        if ('speechSynthesis' in window) {
            speechSynthesis.onvoiceschanged = loadTTSVoices;
        } else {
            updateTTSStatus('Not supported', 'error');
            if (ttsReadPageBtn) ttsReadPageBtn.disabled = true;
            if (ttsReadSelectionBtn) ttsReadSelectionBtn.disabled = true;
        }
    }

    function loadTTSVoices() {
        if (!('speechSynthesis' in window) || !ttsVoiceSelect) return;
        
        // Wait for voices to be available
        const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            if (voices.length === 0) {
                // Voices not ready yet, try again in a moment
                setTimeout(loadVoices, 100);
                return;
            }
            
            ttsVoiceSelect.innerHTML = '<option value="">Default</option>';
            
            // Filter for English voices and prefer female voices for dyslexia assistance
            const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
            const preferredVoices = englishVoices.filter(voice => 
                voice.name.toLowerCase().includes('female') || 
                voice.name.toLowerCase().includes('zira') ||
                voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('karen')
            );
            
            // Add preferred voices first
            preferredVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                ttsVoiceSelect.appendChild(option);
            });
            
            // Add remaining English voices
            englishVoices.filter(voice => !preferredVoices.includes(voice)).forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                ttsVoiceSelect.appendChild(option);
            });
            
            // Restore saved voice selection
            if (ttsSettings.voice) {
                ttsVoiceSelect.value = ttsSettings.voice;
            }
            
            console.log(`Loaded ${voices.length} voices, ${englishVoices.length} English voices`);
        };
        
        loadVoices();
    }

    function loadTTSSettings() {
        chrome.storage.sync.get(['tts-settings'], (result) => {
            if (result['tts-settings']) {
                ttsSettings = { ...ttsSettings, ...result['tts-settings'] };
                
                // Update UI
                if (ttsSpeedRange) {
                    ttsSpeedRange.value = ttsSettings.rate;
                    ttsSpeedValue.textContent = ttsSettings.rate.toFixed(1) + 'x';
                }
                if (ttsVoiceSelect && ttsSettings.voice) {
                    ttsVoiceSelect.value = ttsSettings.voice;
                }
            }
        });
    }

    function updateTTSSettings() {
        if (ttsSpeedRange) {
            ttsSettings.rate = parseFloat(ttsSpeedRange.value);
        }
        if (ttsVoiceSelect) {
            ttsSettings.voice = ttsVoiceSelect.value;
        }
        
        // Save settings
        chrome.storage.sync.set({ 'tts-settings': ttsSettings });
    }

    async function readPageAloud() {
        try {
            updateTTSStatus('Getting page content...', 'speaking');
            
            // Get current tab
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs || tabs.length === 0) {
                throw new Error('No active tab found');
            }

            // Try to get content from content script first
            try {
                const response = await chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'speakPageContent'
                });
                
                if (response && response.success) {
                    updateTTSStatus('Reading page...', 'speaking');
                    return;
                }
            } catch (error) {
                console.warn('Content script not available, using fallback method:', error);
            }
            
            // Fallback: try to execute script to get page content
            try {
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: () => {
                        // Get main content from the page
                        let content = '';
                        
                        // Try to get main content
                        const mainContent = document.querySelector('main, article, .content, #content, .post, .article');
                        if (mainContent) {
                            content = mainContent.innerText.trim();
                        } else {
                            // Fallback: get all paragraphs
                            const paragraphs = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
                            content = Array.from(paragraphs)
                                .map(p => p.innerText.trim())
                                .filter(text => text.length > 0)
                                .join('. ');
                        }

                        // If still no content, use page title and first part of body
                        if (!content) {
                            content = document.title + '. ' + document.body.innerText.trim().substring(0, 1000);
                        }

                        // Limit content length for TTS
                        if (content.length > 3000) {
                            content = content.substring(0, 3000) + '... Content truncated for speech.';
                        }

                        return content;
                    }
                });
                
                if (results && results[0] && results[0].result) {
                    const content = results[0].result;
                    if (content && content.trim()) {
                        speakText(content);
                        return;
                    }
                }
            } catch (error) {
                console.warn('Script execution failed:', error);
            }
            
            // Final fallback: read page title and URL
            const textToRead = `Reading page: ${tabs[0].title}. This page is located at ${tabs[0].url}`;
            speakText(textToRead);
            
        } catch (error) {
            console.error('Error reading page:', error);
            updateTTSStatus('Error reading page', 'error');
            setTimeout(() => updateTTSStatus('Ready'), 3000);
        }
    }

    async function readSelectionAloud() {
        try {
            updateTTSStatus('Getting selected text...', 'speaking');
            
            // Get current tab
            const tabs = await chrome.tabs.query({active: true, currentWindow: true});
            if (!tabs || tabs.length === 0) {
                throw new Error('No active tab found');
            }

            // Try to get selected text from content script
            try {
                const response = await chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'speakSelectedText'
                });
                
                if (response && response.success) {
                    updateTTSStatus('Reading selection...', 'speaking');
                    return;
                }
            } catch (error) {
                console.warn('Content script not available for selection reading:', error);
            }
            
            // Fallback: inform user to select text
            const fallbackText = "Please select some text on the page first, then try again.";
            speakText(fallbackText);
            
        } catch (error) {
            console.error('Failed to read selection:', error);
            updateTTSStatus('Failed to read selection', 'error');
            setTimeout(() => updateTTSStatus('Ready'), 3000);
        }
    }

    function speakText(text) {
        console.log('speakText called with:', text);
        
        if (!('speechSynthesis' in window)) {
            updateTTSStatus('TTS not supported', 'error');
            console.error('speechSynthesis not available');
            return;
        }

        // Stop any current speech
        stopSpeaking();

        if (!text || text.trim().length === 0) {
            updateTTSStatus('No text to read', 'error');
            setTimeout(() => updateTTSStatus('Ready'), 2000);
            console.warn('No text provided');
            return;
        }

        console.log('Creating utterance...');
        updateTTSStatus('Preparing speech...', 'speaking');

        // Create utterance
        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.rate = ttsSettings.rate;
        currentUtterance.pitch = ttsSettings.pitch;
        currentUtterance.volume = ttsSettings.volume;

        // Set voice if selected
        if (ttsSettings.voice) {
            const voices = speechSynthesis.getVoices();
            const selectedVoice = voices.find(voice => voice.name === ttsSettings.voice);
            if (selectedVoice) {
                currentUtterance.voice = selectedVoice;
                console.log('Using voice:', selectedVoice.name);
            }
        }

        // Set up event handlers
        currentUtterance.onstart = () => {
            console.log('Speech started');
            isCurrentlySpeaking = true;
            updateTTSStatus('Speaking...', 'speaking');
            updateTTSButtons(true);
        };

        currentUtterance.onend = () => {
            console.log('Speech ended');
            isCurrentlySpeaking = false;
            updateTTSStatus('Ready', 'ready');
            updateTTSButtons(false);
        };

        currentUtterance.onerror = (event) => {
            console.error('Speech error:', event.error);
            isCurrentlySpeaking = false;
            updateTTSStatus('Error: ' + event.error, 'error');
            updateTTSButtons(false);
            setTimeout(() => updateTTSStatus('Ready'), 3000);
        };

        // Force start speech with a small delay to ensure popup is ready
        setTimeout(() => {
            console.log('Starting speech...');
            try {
                speechSynthesis.speak(currentUtterance);
                // Force update status in case onstart doesn't fire
                setTimeout(() => {
                    if (speechSynthesis.speaking) {
                        updateTTSStatus('Speaking...', 'speaking');
                        updateTTSButtons(true);
                        isCurrentlySpeaking = true;
                    }
                }, 100);
            } catch (error) {
                console.error('Error starting speech:', error);
                updateTTSStatus('Error starting speech', 'error');
                setTimeout(() => updateTTSStatus('Ready'), 3000);
            }
        }, 100);
    }
            isCurrentlySpeaking = false;
            currentUtterance = null;
            updateTTSStatus('Ready');
            updateTTSButtons(false);
        };

        currentUtterance.onerror = (event) => {
            console.error('TTS error:', event);
            isCurrentlySpeaking = false;
            currentUtterance = null;
            updateTTSStatus('Speech error', 'error');
            updateTTSButtons(false);
            setTimeout(() => updateTTSStatus('Ready'), 3000);
        };

        // Start speaking
        speechSynthesis.speak(currentUtterance);
        console.log('Started speaking:', text.substring(0, 50) + '...');
    

    function stopSpeaking() {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
        
        if (currentUtterance) {
            currentUtterance = null;
        }
        
        isCurrentlySpeaking = false;
        updateTTSStatus('Ready');
        updateTTSButtons(false);
    }

    function updateTTSStatus(message, type = 'ready') {
        if (!ttsStatus) return;
        
        ttsStatus.textContent = message;
        ttsStatus.className = 'tts-status ' + type;
    }

    function updateTTSButtons(isSpeaking) {
        if (ttsReadPageBtn) ttsReadPageBtn.disabled = isSpeaking;
        if (ttsReadSelectionBtn) ttsReadSelectionBtn.disabled = isSpeaking;
        if (ttsStopBtn) ttsStopBtn.disabled = !isSpeaking;
    }

 // End of initializePopup function