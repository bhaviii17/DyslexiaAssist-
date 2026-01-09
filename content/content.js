// Content Script - Main functionality with AI Integration
(function() {
    'use strict';

    let isEnabled = true;
    let currentSettings = {};
    let readingGuide = null;
    let dyslexiaStyles = null;
    let textProcessor = null;
    let speechProcessor = null;
    let speechRecognition = null;
    let advancedAI = null;
    let personalizationEngine = null;
    let usageAnalytics = null;
    let aiProcessingEnabled = false;

    // New feature instances
    let accessibilityAnalyzer = null;
    let focusMode = null;
    let readingRuler = null;
    let wordHighlighter = null;
    let readingTracker = null;
    let ttsController = null;

    // Initialize the extension
    init();

    async function init() {
        try {
            console.log('DyslexiaAssist: Starting initialization...');
            
            createStyleElement();
            await loadSettings();
            setupMessageListener();
            
            // Try to load AI features, but don't fail if they don't work
            try {
                await importAIModules();
                setupAIFeatures();
                console.log('DyslexiaAssist: AI features loaded successfully');
            } catch (aiError) {
                console.warn('DyslexiaAssist: AI features failed to load, continuing with basic features:', aiError);
                aiProcessingEnabled = false;
            }
            
            console.log('DyslexiaAssist content script loaded successfully');
            
            // Add a visual indicator that the extension is working
            addExtensionIndicator();
            
        } catch (error) {
            console.error('Failed to initialize DyslexiaAssist:', error);
            // Fallback to basic functionality
            createStyleElement();
            await loadSettings();
            setupMessageListener();
        }
    }

    // Add a small indicator to show the extension is working
    function addExtensionIndicator() {
        // Create a small, temporary indicator
        const indicator = document.createElement('div');
        indicator.id = 'dyslexia-assist-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #28a745;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        indicator.textContent = 'DyslexiaAssist Active';
        document.body.appendChild(indicator);
        
        // Show and hide the indicator
        setTimeout(() => indicator.style.opacity = '1', 100);
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }, 2000);
    }

    async function importAIModules() {
        try {
            console.log('DyslexiaAssist: Loading AI modules...');
            
            // Load AI modules using script injection since they're not ES6 modules
            await loadScript(chrome.runtime.getURL('ai/text-processor.js'));
            console.log('DyslexiaAssist: text-processor.js loaded');
            
            await loadScript(chrome.runtime.getURL('ai/personalization.js'));
            console.log('DyslexiaAssist: personalization.js loaded');
            
            await loadScript(chrome.runtime.getURL('ai/advanced-ai.js'));
            console.log('DyslexiaAssist: advanced-ai.js loaded');

            // Load new feature modules
            await loadScript(chrome.runtime.getURL('ai/accessibility-analyzer.js'));
            console.log('DyslexiaAssist: accessibility-analyzer.js loaded');

            await loadScript(chrome.runtime.getURL('ai/focus-mode.js'));
            console.log('DyslexiaAssist: focus-mode.js loaded');

            await loadScript(chrome.runtime.getURL('ai/reading-assistant.js'));
            console.log('DyslexiaAssist: reading-assistant.js loaded');
            
            // Small delay to ensure scripts are processed
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Initialize AI classes (they're now available in global scope)
            console.log('DyslexiaAssist: Checking for AI classes...');
            console.log('TextProcessor available:', typeof TextProcessor !== 'undefined');
            console.log('SpeechProcessor available:', typeof SpeechProcessor !== 'undefined');
            console.log('PersonalizationEngine available:', typeof PersonalizationEngine !== 'undefined');
            console.log('AdvancedAIProcessor available:', typeof AdvancedAIProcessor !== 'undefined');
            console.log('AccessibilityAnalyzer available:', typeof AccessibilityAnalyzer !== 'undefined');
            console.log('FocusMode available:', typeof FocusMode !== 'undefined');
            console.log('ReadingProgressTracker available:', typeof ReadingProgressTracker !== 'undefined');
            
            if (typeof TextProcessor !== 'undefined') {
                textProcessor = new TextProcessor();
                await textProcessor.initializeApiKey();
                console.log('DyslexiaAssist: TextProcessor initialized');
            } else {
                console.error('DyslexiaAssist: TextProcessor class not found');
            }
            
            if (typeof SpeechProcessor !== 'undefined') {
                speechProcessor = new SpeechProcessor();
                console.log('DyslexiaAssist: SpeechProcessor initialized');
            } else {
                console.warn('DyslexiaAssist: SpeechProcessor class not found');
            }
            
            if (typeof SpeechRecognition !== 'undefined') {
                speechRecognition = new SpeechRecognition();
                console.log('DyslexiaAssist: SpeechRecognition initialized');
            } else {
                console.warn('DyslexiaAssist: SpeechRecognition class not found');
            }
            
            if (typeof PersonalizationEngine !== 'undefined') {
                personalizationEngine = new PersonalizationEngine();
                await personalizationEngine.loadUserProfile();
                console.log('DyslexiaAssist: PersonalizationEngine initialized');
            } else {
                console.warn('DyslexiaAssist: PersonalizationEngine class not found');
            }
            
            if (typeof UsageAnalytics !== 'undefined') {
                usageAnalytics = new UsageAnalytics();
                console.log('DyslexiaAssist: UsageAnalytics initialized');
            } else {
                console.warn('DyslexiaAssist: UsageAnalytics class not found');
            }
            
            if (typeof AdvancedAIProcessor !== 'undefined') {
                advancedAI = new AdvancedAIProcessor();
                await advancedAI.initialize();
                console.log('DyslexiaAssist: AdvancedAIProcessor initialized');
            } else {
                console.warn('DyslexiaAssist: AdvancedAIProcessor class not found');
            }

            // Initialize new features
            if (typeof AccessibilityAnalyzer !== 'undefined') {
                accessibilityAnalyzer = new AccessibilityAnalyzer();
                console.log('DyslexiaAssist: AccessibilityAnalyzer initialized');
            } else {
                console.warn('DyslexiaAssist: AccessibilityAnalyzer class not found');
            }

            if (typeof FocusMode !== 'undefined') {
                focusMode = new FocusMode();
                focusMode.init();
                console.log('DyslexiaAssist: FocusMode initialized');
            } else {
                console.warn('DyslexiaAssist: FocusMode class not found');
            }

            if (typeof ReadingRuler !== 'undefined') {
                readingRuler = new ReadingRuler();
                console.log('DyslexiaAssist: ReadingRuler initialized');
            } else {
                console.warn('DyslexiaAssist: ReadingRuler class not found');
            }

            if (typeof WordHighlighter !== 'undefined') {
                wordHighlighter = new WordHighlighter();
                wordHighlighter.init();
                console.log('DyslexiaAssist: WordHighlighter initialized');
            } else {
                console.warn('DyslexiaAssist: WordHighlighter class not found');
            }

            if (typeof ReadingProgressTracker !== 'undefined') {
                readingTracker = new ReadingProgressTracker();
                readingTracker.init();
                // Make globally available
                window.readingTracker = readingTracker;
                console.log('DyslexiaAssist: ReadingProgressTracker initialized');
            } else {
                console.warn('DyslexiaAssist: ReadingProgressTracker class not found');
            }

            if (typeof TextToSpeechController !== 'undefined') {
                ttsController = new TextToSpeechController();
                ttsController.init();
                // Make globally available
                window.ttsController = ttsController;
                console.log('DyslexiaAssist: TextToSpeechController initialized');
            } else {
                console.warn('DyslexiaAssist: TextToSpeechController class not found');
            }
            
            // Check if API key is configured
            chrome.storage.sync.get(['google-ai-key'], (result) => {
                if (result['google-ai-key']) {
                    aiProcessingEnabled = true;
                    console.log('DyslexiaAssist: AI processing enabled with API key');
                } else {
                    console.warn('Google AI API key not configured. AI features will be limited.');
                    aiProcessingEnabled = false;
                }
            });
            
        } catch (error) {
            console.warn('AI features not available:', error);
            aiProcessingEnabled = false;
        }
    }

    // Helper function to load scripts
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            console.log('DyslexiaAssist: Loading script:', url);
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
                console.log('DyslexiaAssist: Script loaded successfully:', url);
                resolve();
            };
            script.onerror = (error) => {
                console.error('DyslexiaAssist: Failed to load script:', url, error);
                reject(new Error(`Failed to load script: ${url}`));
            };
            document.head.appendChild(script);
        });
    }

    function createStyleElement() {
        dyslexiaStyles = document.createElement('style');
        dyslexiaStyles.id = 'dyslexia-assist-styles';
        document.head.appendChild(dyslexiaStyles);
    }

    async function loadSettings() {
        return new Promise((resolve) => {
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
                // AI-specific settings
                'ai-enabled',
                'auto-simplify',
                'auto-summarize',
                'auto-translate',
                'target-language',
                'speech-enabled',
                'speech-rate',
                'speech-voice'
            ], function(result) {
                currentSettings = result;
                applySettings();
                resolve();
            });
        });
    }

    function setupMessageListener() {
        chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
            try {
                switch(request.action) {
                    case 'ping':
                        // Simple ping for testing
                        sendResponse({success: true, message: 'Content script is working'});
                        return true;
                    case 'testAI':
                        // Test AI features availability
                        const aiStatus = {
                            aiProcessingEnabled: aiProcessingEnabled,
                            textProcessor: !!textProcessor,
                            speechProcessor: !!speechProcessor,
                            personalizationEngine: !!personalizationEngine,
                            advancedAI: !!advancedAI,
                            classes: {
                                TextProcessor: typeof TextProcessor !== 'undefined',
                                SpeechProcessor: typeof SpeechProcessor !== 'undefined',
                                PersonalizationEngine: typeof PersonalizationEngine !== 'undefined',
                                AdvancedAIProcessor: typeof AdvancedAIProcessor !== 'undefined'
                            }
                        };
                        sendResponse({success: true, aiStatus: aiStatus});
                        return true;
                    case 'updateSettings':
                        currentSettings = request.settings;
                        await applySettings();
                        if (personalizationEngine && aiProcessingEnabled) {
                            personalizationEngine.updatePreferences(request.settings);
                        }
                        break;
                    case 'resetSettings':
                        await resetStyles();
                        break;
                    case 'toggle':
                        isEnabled = !isEnabled;
                        if (isEnabled) {
                            // Show content popup instead of just applying settings
                            await createContentPopup();
                        } else {
                            await resetStyles();
                            // Close popup if open
                            const existingPopup = document.getElementById('dyslexia-content-popup');
                            if (existingPopup) {
                                existingPopup.remove();
                            }
                        }
                        break;
                    case 'showContentPopup':
                        // Enhanced action to show content popup with optional auto-processing
                        await createContentPopup(request.autoProcess, request.targetLanguage, request.openVoicePanel, request.highlightAccessibility);
                        sendResponse({success: true});
                        break;
                    case 'autoProcessPage':
                        // Auto-process current page content
                        if (aiProcessingEnabled) {
                            await createContentPopup();
                            // Wait for popup to be created then trigger processing
                            setTimeout(() => {
                                const popup = document.getElementById('dyslexia-content-popup');
                                if (popup) {
                                    const processBtn = popup.querySelector('#process-content');
                                    if (processBtn) {
                                        processBtn.click();
                                    }
                                }
                            }, 300);
                        }
                        sendResponse({success: true});
                        break;
                    case 'speakPageContent':
                        // Speak the entire page content
                        if (aiProcessingEnabled && speechProcessor) {
                            await speakPageContent();
                        }
                        sendResponse({success: true});
                        break;
                    case 'processSelectedText':
                        if (aiProcessingEnabled) {
                            await processSelectedText();
                        }
                        break;
                    case 'speakSelectedText':
                        if (aiProcessingEnabled && speechProcessor) {
                            await speakSelectedText();
                        }
                        break;
                    case 'getPersonalizedSettings':
                        if (personalizationEngine && aiProcessingEnabled) {
                            const suggestions = personalizationEngine.getPersonalizedSettings();
                            sendResponse(suggestions);
                        }
                        break;
                    case 'analyzeAccessibility':
                        // Analyze page accessibility
                        if (accessibilityAnalyzer) {
                            const analysis = await accessibilityAnalyzer.analyzePageAccessibility();
                            sendResponse({success: true, analysis: analysis});
                        } else {
                            sendResponse({success: false, error: 'Accessibility analyzer not available'});
                        }
                        break;
                    case 'toggleFocusMode':
                        // Toggle focus mode
                        if (focusMode) {
                            focusMode.toggle(request.mode || 'line');
                            sendResponse({success: true});
                        } else {
                            sendResponse({success: false, error: 'Focus mode not available'});
                        }
                        break;
                    case 'toggleReadingRuler':
                        // Toggle reading ruler
                        if (readingRuler) {
                            readingRuler.activate();
                            sendResponse({success: true});
                        } else {
                            sendResponse({success: false, error: 'Reading ruler not available'});
                        }
                        break;
                    case 'startReadingTracker':
                        // Start reading progress tracking
                        if (readingTracker) {
                            readingTracker.toggleStatsPanel();
                            sendResponse({success: true});
                        } else {
                            sendResponse({success: false, error: 'Reading tracker not available'});
                        }
                        break;
                    case 'showTTSControls':
                        // Show text-to-speech controls
                        if (ttsController) {
                            ttsController.toggleControls();
                            sendResponse({success: true});
                        } else {
                            sendResponse({success: false, error: 'TTS controller not available'});
                        }
                        break;
                }
                sendResponse({success: true});
            } catch (error) {
                console.error('Message handling error:', error);
                if (usageAnalytics) {
                    usageAnalytics.trackError(error, request.action);
                }
                sendResponse({success: false, error: error.message});
            }
        });
    }

    function setupAIFeatures() {
        if (!aiProcessingEnabled) return;

        // Add context menu for AI features
        document.addEventListener('contextmenu', function(e) {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText.length > 0) {
                // Store selected text for processing
                chrome.storage.local.set({ selectedText: selectedText });
            }
        });

        // Add double-click processing for difficult words
        document.addEventListener('dblclick', async function(e) {
            if (!currentSettings['ai-enabled']) return;
            
            const selectedText = window.getSelection().toString().trim();
            if (selectedText.length > 0 && selectedText.split(' ').length === 1) {
                // Single word selected - might be difficult
                if (personalizationEngine) {
                    personalizationEngine.trackDifficultWord(selectedText);
                }
                
                // Optionally show definition or simplification
                await showWordAssistance(selectedText, e.target);
            }
        });

        // Setup speech recognition if enabled
        if (speechRecognition && currentSettings['speech-enabled']) {
            setupSpeechRecognition();
        }
    }

    async function applySettings() {
        if (!isEnabled) return;

        let css = generateCSS();
        dyslexiaStyles.textContent = css;

        // Handle special features
        handleReadingGuide();
        handleAnimations();

        // AI-powered features
        if (aiProcessingEnabled && currentSettings['ai-enabled']) {
            await applyAIProcessing();
        }

        // Track feature usage
        if (usageAnalytics) {
            Object.keys(currentSettings).forEach(setting => {
                if (currentSettings[setting] === true) {
                    usageAnalytics.trackFeature(setting);
                }
            });
        }
    }

    async function applyAIProcessing() {
        if (!textProcessor || !personalizationEngine) return;

        try {
            // Get personalized settings
            const personalizedSettings = personalizationEngine.getPersonalizedSettings();
            
            // Create content popup instead of modifying page directly
            await createContentPopup();
            
        } catch (error) {
            console.error('AI processing failed:', error);
            if (usageAnalytics) {
                usageAnalytics.trackError(error, 'ai-processing');
            }
        }
    }

    async function createContentPopup(autoProcess = null, targetLanguage = null, openVoicePanel = false, highlightAccessibility = false) {
        // Remove existing popup if any
        const existingPopup = document.getElementById('dyslexia-content-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Extract all text content from the page
        const pageContent = extractPageContent();
        
        // Create the popup overlay
        const popup = document.createElement('div');
        popup.id = 'dyslexia-content-popup';
        popup.className = 'dyslexia-content-overlay';
        
        popup.innerHTML = `
            <div class="content-popup-container">
                <div class="content-popup-header">
                    <div class="header-left">
                        <h2>DyslexiaAssist Reader</h2>
                        <span class="page-title">${document.title}</span>
                    </div>
                    <div class="header-controls">
                        <div class="control-group-main">
                            <button class="control-btn primary" id="simplify-content" title="Simplify Text">
                                <span class="btn-label">Simplify</span>
                            </button>
                            <button class="control-btn primary" id="summarize-content" title="Summarize">
                                <span class="btn-label">Summary</span>
                            </button>
                            <button class="control-btn primary" id="translate-content" title="Translate">
                                <span class="btn-label">Translate</span>
                            </button>
                        </div>
                        <div class="control-group-secondary">
                            <button class="control-btn" id="speak-content" title="Read Aloud">Speak</button>
                            <button class="control-btn" id="voice-commands" title="Voice Commands">Voice</button>
                            <button class="control-btn" id="difficulty-check" title="Check Difficulty">Analyze</button>
                            <button class="control-btn" id="ai-assistant" title="AI Reading Assistant">AI Help</button>
                        </div>
                        <div class="control-group-enhanced">
                            <button class="control-btn focus" id="focus-mode-btn" title="Focus Mode">Focus</button>
                            <button class="control-btn ruler" id="reading-ruler-btn" title="Reading Ruler">Ruler</button>
                            <button class="control-btn tracker" id="reading-tracker-btn" title="Reading Progress">Progress</button>
                            <button class="control-btn highlight" id="word-highlighter-btn" title="Word Helper">Words</button>
                            <button class="control-btn access" id="accessibility-btn" title="Accessibility Check">A11y</button>
                        </div>
                        <div class="control-group-actions">
                            <button class="control-btn settings" id="settings-btn" title="Settings">Settings</button>
                            <button class="close-btn" id="close-popup" title="Close">×</button>
                        </div>
                    </div>
                </div>
                
                <div class="content-popup-toolbar">
                    <div class="reading-controls">
                        <label>Font Size: 
                            <input type="range" id="popup-font-size" min="12" max="24" value="16">
                            <span id="popup-font-size-value">16px</span>
                        </label>
                        <label>Line Height: 
                            <input type="range" id="popup-line-height" min="1" max="3" step="0.1" value="1.6">
                            <span id="popup-line-height-value">1.6</span>
                        </label>
                        <select id="popup-color-filter">
                            <option value="none">No Filter</option>
                            <option value="yellow">Yellow Tint</option>
                            <option value="blue">Blue Tint</option>
                            <option value="sepia">Sepia</option>
                        </select>
                    </div>
                    <div class="processing-status" id="processing-status" style="display: none;">
                        <span class="spinner"></span>
                        <span class="status-text">Processing content...</span>
                    </div>
                </div>
                
                <div class="content-popup-body">
                    <div class="ai-assistant-panel" id="ai-assistant-panel" style="display: none;">
                        <div class="ai-panel-header">
                            <h3>AI Reading Assistant</h3>
                            <button class="close-panel-btn" id="close-ai-panel">×</button>
                        </div>
                        <div class="ai-features">
                            <div class="ai-feature-group">
                                <h4>Smart Analysis</h4>
                                <button class="ai-btn" id="analyze-difficulty">Analyze Reading Difficulty</button>
                                <button class="ai-btn" id="extract-keywords">Extract Key Concepts</button>
                                <button class="ai-btn" id="sentiment-analysis">Emotional Tone Analysis</button>
                            </div>
                            <div class="ai-feature-group">
                                <h4>Intelligent Q&A</h4>
                                <div class="qa-input-group">
                                    <input type="text" id="ai-question" placeholder="Ask a question about this content...">
                                    <button class="ai-btn" id="ask-ai">Ask AI</button>
                                </div>
                                <div id="ai-answer" class="ai-answer"></div>
                            </div>
                            <div class="ai-feature-group">
                                <h4>Personalized Learning</h4>
                                <button class="ai-btn" id="get-recommendations">Get Reading Tips</button>
                                <button class="ai-btn" id="track-progress">Track My Progress</button>
                                <div id="ai-recommendations" class="ai-recommendations"></div>
                            </div>
                        </div>
                    </div>
                    <div class="voice-commands-panel" id="voice-commands-panel" style="display: none;">
                        <div class="voice-panel-header">
                            <h3>Voice Commands</h3>
                            <button class="close-panel-btn" id="close-voice-panel">✕</button>
                        </div>
                        <div class="voice-controls">
                            <button class="voice-btn" id="start-listening">Start Listening</button>
                            <button class="voice-btn" id="stop-listening" disabled>Stop Listening</button>
                            <div class="voice-status" id="voice-status">Ready to listen...</div>
                            <div class="voice-transcript" id="voice-transcript"></div>
                            <div class="voice-commands-help">
                                <h4>Try saying:</h4>
                                <ul>
                                    <li>"Read this page"</li>
                                    <li>"Simplify the text"</li>
                                    <li>"Summarize this"</li>
                                    <li>"Translate to Hindi"</li>
                                    <li>"What is [concept]?"</li>
                                    <li>"How difficult is this?"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="content-area" id="popup-content-area">
                        ${pageContent.html}
                    </div>
                </div>
                
                <div class="content-popup-footer">
                    <div class="reading-stats">
                        <span>${pageContent.wordCount} words</span>
                        <span>${Math.ceil(pageContent.wordCount / 200)} min read</span>
                        <span id="current-position">Position: Top</span>
                    </div>
                    <div class="footer-controls">
                        <button class="btn btn-secondary" id="reset-content">Reset</button>
                        <button class="btn btn-primary" id="save-preferences">Save Preferences</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Setup popup event listeners
        setupPopupEventListeners();
        
        // Apply current settings to popup content
        applyPopupSettings();
        
        // Auto-process content if specified or AI auto-process is enabled
        if (autoProcess || openVoicePanel) {
            setTimeout(() => {
                if (autoProcess) {
                    // Handle specific processing types from quick actions
                    const actionMap = {
                        'simplify': () => {
                            const simplifyBtn = popup.querySelector('#simplify-content');
                            if (simplifyBtn) simplifyBtn.click();
                        },
                        'summarize': () => {
                            const summarizeBtn = popup.querySelector('#summarize-content');
                            if (summarizeBtn) summarizeBtn.click();
                        },
                        'translate': () => {
                            if (targetLanguage) {
                                const translateSelect = popup.querySelector('#translate-language');
                                if (translateSelect) {
                                    translateSelect.value = targetLanguage;
                                }
                            }
                            const translateBtn = popup.querySelector('#translate-content');
                            if (translateBtn) translateBtn.click();
                        },
                        'analyze': () => {
                            const analyzeBtn = popup.querySelector('#analyze-content');
                            if (analyzeBtn) analyzeBtn.click();
                        }
                    };
                    
                    if (actionMap[autoProcess]) {
                        actionMap[autoProcess]();
                    } else {
                        // Default processing
                        const processBtn = popup.querySelector('#process-content');
                        if (processBtn) processBtn.click();
                    }
                }
                
                if (openVoicePanel) {
                    // Open voice commands panel
                    const voiceBtn = popup.querySelector('#voice-commands');
                    if (voiceBtn) voiceBtn.click();
                }
                
                if (highlightAccessibility) {
                    // Highlight and trigger accessibility analysis
                    const accessibilityBtn = popup.querySelector('#accessibility-btn');
                    if (accessibilityBtn) {
                        // Add highlighting effect
                        accessibilityBtn.style.animation = 'pulse 2s infinite';
                        accessibilityBtn.style.boxShadow = '0 0 20px rgba(250, 112, 154, 0.6)';
                        
                        // Auto-click after a short delay
                        setTimeout(() => {
                            accessibilityBtn.click();
                        }, 800);
                        
                        // Remove highlighting after 5 seconds
                        setTimeout(() => {
                            accessibilityBtn.style.animation = '';
                            accessibilityBtn.style.boxShadow = '';
                        }, 5000);
                    }
                }
            }, 500); // Small delay to ensure popup is fully rendered
        } else {
            // Check for general auto-process setting
            chrome.storage.sync.get(['aiAutoProcess'], (result) => {
                if (result.aiAutoProcess && result.aiAutoProcess.enabled) {
                    setTimeout(() => {
                        const processBtn = popup.querySelector('#process-content');
                        if (processBtn) {
                            processBtn.click();
                        }
                    }, 500);
                }
            });
        }
        
        // Track usage
        if (usageAnalytics) {
            usageAnalytics.trackFeature('content-popup');
        }
    }

    function extractPageContent() {
        // Get main content from the page
        const contentSelectors = [
            'main',
            'article',
            '[role="main"]',
            '.content',
            '.post',
            '.article',
            '#content',
            '.main-content'
        ];
        
        let mainContent = null;
        for (const selector of contentSelectors) {
            mainContent = document.querySelector(selector);
            if (mainContent) break;
        }
        
        // Fallback to body if no main content found
        if (!mainContent) {
            mainContent = document.body;
        }
        
        // Clone the content to avoid modifying original
        const contentClone = mainContent.cloneNode(true);
        
        // Remove unwanted elements
        const unwantedSelectors = [
            'script',
            'style',
            'nav',
            'header',
            'footer',
            '.advertisement',
            '.ad',
            '.sidebar',
            '.menu',
            '.navigation'
        ];
        
        unwantedSelectors.forEach(selector => {
            const elements = contentClone.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
        
        // Clean up the HTML
        const cleanHTML = contentClone.innerHTML
            .replace(/<!--.*?-->/gs, '') // Remove comments
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        
        // Count words
        const textContent = contentClone.textContent || '';
        const wordCount = textContent.trim().split(/\s+/).length;
        
        return {
            html: cleanHTML,
            text: textContent,
            wordCount: wordCount
        };
    }

    function setupPopupEventListeners() {
        const popup = document.getElementById('dyslexia-content-popup');
        if (!popup) return;
        
        // Close popup
        popup.querySelector('#close-popup').addEventListener('click', () => {
            popup.remove();
        });
        
        // Close on escape key
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape' && popup.parentNode) {
                popup.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
        
        // Close on overlay click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.remove();
            }
        });
        
        // Font size control
        const fontSizeSlider = popup.querySelector('#popup-font-size');
        const fontSizeValue = popup.querySelector('#popup-font-size-value');
        fontSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            fontSizeValue.textContent = size + 'px';
            popup.querySelector('#popup-content-area').style.fontSize = size + 'px';
        });
        
        // Line height control
        const lineHeightSlider = popup.querySelector('#popup-line-height');
        const lineHeightValue = popup.querySelector('#popup-line-height-value');
        lineHeightSlider.addEventListener('input', (e) => {
            const height = e.target.value;
            lineHeightValue.textContent = height;
            popup.querySelector('#popup-content-area').style.lineHeight = height;
        });
        
        // Color filter
        popup.querySelector('#popup-color-filter').addEventListener('change', (e) => {
            applyPopupColorFilter(e.target.value);
        });
        
        // Content processing buttons
        popup.querySelector('#simplify-content').addEventListener('click', () => {
            processPopupContent('simplify');
        });
        
        popup.querySelector('#summarize-content').addEventListener('click', () => {
            processPopupContent('summarize');
        });
        
        popup.querySelector('#translate-content').addEventListener('click', () => {
            processPopupContent('translate');
        });
        
        popup.querySelector('#speak-content').addEventListener('click', () => {
            speakPopupContent();
        });

        // Advanced AI features
        popup.querySelector('#ai-assistant').addEventListener('click', () => {
            toggleAIPanel();
        });

        popup.querySelector('#voice-commands').addEventListener('click', () => {
            toggleVoicePanel();
        });

        popup.querySelector('#difficulty-check').addEventListener('click', () => {
            checkContentDifficulty();
        });

        // AI panel controls
        const aiPanel = popup.querySelector('#ai-assistant-panel');
        if (aiPanel) {
            popup.querySelector('#close-ai-panel').addEventListener('click', () => {
                aiPanel.style.display = 'none';
            });

            popup.querySelector('#analyze-difficulty').addEventListener('click', () => {
                analyzeReadingDifficulty();
            });

            popup.querySelector('#extract-keywords').addEventListener('click', () => {
                extractContentKeywords();
            });

            popup.querySelector('#sentiment-analysis').addEventListener('click', () => {
                analyzeSentiment();
            });

            popup.querySelector('#ask-ai').addEventListener('click', () => {
                askAIQuestion();
            });

            popup.querySelector('#ai-question').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    askAIQuestion();
                }
            });

            popup.querySelector('#get-recommendations').addEventListener('click', () => {
                getPersonalizedRecommendations();
            });

            popup.querySelector('#track-progress').addEventListener('click', () => {
                showProgressTracking();
            });
        }

        // Voice panel controls
        const voicePanel = popup.querySelector('#voice-commands-panel');
        if (voicePanel) {
            popup.querySelector('#close-voice-panel').addEventListener('click', () => {
                voicePanel.style.display = 'none';
            });

            popup.querySelector('#start-listening').addEventListener('click', () => {
                startVoiceListening();
            });

            popup.querySelector('#stop-listening').addEventListener('click', () => {
                stopVoiceListening();
            });
        }
        
        // Reset content
        popup.querySelector('#reset-content').addEventListener('click', () => {
            resetPopupContent();
        });
        
        // Save preferences
        popup.querySelector('#save-preferences').addEventListener('click', () => {
            savePopupPreferences();
        });

        // Enhanced features event listeners
        popup.querySelector('#focus-mode-btn').addEventListener('click', () => {
            toggleFocusMode();
        });

        popup.querySelector('#reading-ruler-btn').addEventListener('click', () => {
            toggleReadingRuler();
        });

        popup.querySelector('#reading-tracker-btn').addEventListener('click', () => {
            toggleReadingTracker();
        });

        popup.querySelector('#word-highlighter-btn').addEventListener('click', () => {
            toggleWordHighlighter();
        });

        popup.querySelector('#accessibility-btn').addEventListener('click', () => {
            showAccessibilityAnalysis();
        });
        
        // Track scroll position
        const contentArea = popup.querySelector('#popup-content-area');
        contentArea.addEventListener('scroll', updateScrollPosition);
    }

    function applyPopupSettings() {
        const popup = document.getElementById('dyslexia-content-popup');
        if (!popup) return;
        
        const contentArea = popup.querySelector('#popup-content-area');
        
        // Apply current extension settings
        if (currentSettings['font-family'] && currentSettings['font-family'] !== 'default') {
            contentArea.style.fontFamily = getFontFamily(currentSettings['font-family']);
        }
        
        if (currentSettings['font-size']) {
            contentArea.style.fontSize = currentSettings['font-size'] + 'px';
            popup.querySelector('#popup-font-size').value = currentSettings['font-size'];
            popup.querySelector('#popup-font-size-value').textContent = currentSettings['font-size'] + 'px';
        }
        
        if (currentSettings['line-spacing']) {
            contentArea.style.lineHeight = currentSettings['line-spacing'];
            popup.querySelector('#popup-line-height').value = currentSettings['line-spacing'];
            popup.querySelector('#popup-line-height-value').textContent = currentSettings['line-spacing'];
        }
        
        if (currentSettings['letter-spacing']) {
            contentArea.style.letterSpacing = currentSettings['letter-spacing'] + 'px';
        }
        
        if (currentSettings['word-spacing']) {
            contentArea.style.wordSpacing = currentSettings['word-spacing'] + 'px';
        }
        
        if (currentSettings['color-filter'] && currentSettings['color-filter'] !== 'none') {
            popup.querySelector('#popup-color-filter').value = currentSettings['color-filter'];
            applyPopupColorFilter(currentSettings['color-filter']);
        }
    }

    function applyPopupColorFilter(filter) {
        const contentArea = document.querySelector('#popup-content-area');
        if (!contentArea) return;
        
        // Remove existing filter classes
        contentArea.classList.remove('filter-yellow', 'filter-blue', 'filter-sepia');
        
        if (filter !== 'none') {
            contentArea.classList.add(`filter-${filter}`);
        }
    }

    async function processPopupContent(type) {
        if (!aiProcessingEnabled || !textProcessor) {
            showPopupMessage('AI features not available. Please configure API key in settings.', 'warning');
            return;
        }
        
        const contentArea = document.querySelector('#popup-content-area');
        const statusEl = document.querySelector('#processing-status');
        
        if (!contentArea) return;
        
        // Show processing status
        statusEl.style.display = 'flex';
        statusEl.querySelector('.status-text').textContent = `${type === 'simplify' ? 'Simplifying' : type === 'summarize' ? 'Summarizing' : 'Translating'} content...`;
        
        try {
            const originalText = contentArea.textContent;
            let processedText = '';
            
            switch (type) {
                case 'simplify':
                    processedText = await textProcessor.simplifyText(originalText);
                    break;
                case 'summarize':
                    processedText = await textProcessor.summarizeText(originalText, 300);
                    break;
                case 'translate':
                    const targetLang = currentSettings['target-language'] || 'hi';
                    processedText = await textProcessor.translateText(originalText, targetLang);
                    break;
            }
            
            if (processedText && processedText !== originalText) {
                // Store original content if not already stored
                if (!contentArea.dataset.originalContent) {
                    contentArea.dataset.originalContent = contentArea.innerHTML;
                }
                
                // Replace content with processed version
                contentArea.innerHTML = `<div class="processed-content ${type}">${processedText.replace(/\n/g, '<br>')}</div>`;
                
                showPopupMessage(`Content ${type}d successfully!`, 'success');
                
                if (usageAnalytics) {
                    usageAnalytics.trackFeature(`popup-${type}`);
                }
            } else {
                showPopupMessage(`No changes needed or processing failed.`, 'info');
            }
            
        } catch (error) {
            console.error(`${type} failed:`, error);
            showPopupMessage(`${type} failed. Please try again.`, 'error');
            
            if (usageAnalytics) {
                usageAnalytics.trackError(error, `popup-${type}`);
            }
        } finally {
            statusEl.style.display = 'none';
        }
    }

    function speakPopupContent() {
        if (!speechProcessor) {
            showPopupMessage('Speech features not available.', 'warning');
            return;
        }
        
        const contentArea = document.querySelector('#popup-content-area');
        if (!contentArea) return;
        
        const text = contentArea.textContent;
        const speechOptions = {
            rate: currentSettings['speech-rate'] || 0.8,
            voiceURI: currentSettings['speech-voice']
        };
        
        speechProcessor.speakText(text, speechOptions);
        
        showPopupMessage('Reading content aloud...', 'info');
        
        if (usageAnalytics) {
            usageAnalytics.trackFeature('popup-speech');
        }
    }

    function resetPopupContent() {
        const contentArea = document.querySelector('#popup-content-area');
        if (!contentArea) return;
        
        if (contentArea.dataset.originalContent) {
            contentArea.innerHTML = contentArea.dataset.originalContent;
            delete contentArea.dataset.originalContent;
            showPopupMessage('Content reset to original.', 'info');
        }
    }

    function savePopupPreferences() {
        const popup = document.getElementById('dyslexia-content-popup');
        if (!popup) return;
        
        const newSettings = {
            ...currentSettings,
            'font-size': parseInt(popup.querySelector('#popup-font-size').value),
            'line-spacing': parseFloat(popup.querySelector('#popup-line-height').value),
            'color-filter': popup.querySelector('#popup-color-filter').value
        };
        
        chrome.storage.sync.set(newSettings, () => {
            showPopupMessage('Preferences saved!', 'success');
            currentSettings = newSettings;
        });
    }

    function updateScrollPosition() {
        const contentArea = document.querySelector('#popup-content-area');
        const positionEl = document.querySelector('#current-position');
        
        if (!contentArea || !positionEl) return;
        
        const scrollPercent = Math.round((contentArea.scrollTop / (contentArea.scrollHeight - contentArea.clientHeight)) * 100);
        
        let position = 'Top';
        if (scrollPercent > 80) position = 'Bottom';
        else if (scrollPercent > 60) position = 'Near End';
        else if (scrollPercent > 40) position = 'Middle';
        else if (scrollPercent > 20) position = 'Early';
        
        positionEl.textContent = `Position: ${position} (${scrollPercent}%)`;
    }

    function showPopupMessage(message, type = 'info') {
        const popup = document.getElementById('dyslexia-content-popup');
        if (!popup) return;
        
        // Remove existing message
        const existingMessage = popup.querySelector('.popup-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageEl = document.createElement('div');
        messageEl.className = `popup-message ${type}`;
        messageEl.textContent = message;
        
        popup.querySelector('.content-popup-header').appendChild(messageEl);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 3000);
    }

    async function simplifyPageContent() {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, span');
        const processPromises = [];

        textElements.forEach(element => {
            const text = element.textContent.trim();
            if (text.length > 50) { // Only process substantial text
                processPromises.push(simplifyElement(element, text));
            }
        });

        // Process in batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < processPromises.length; i += batchSize) {
            const batch = processPromises.slice(i, i + batchSize);
            await Promise.all(batch);
            // Small delay between batches
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    async function simplifyElement(element, originalText) {
        try {
            const simplified = await textProcessor.simplifyText(originalText);
            if (simplified && simplified !== originalText) {
                // Create a toggle mechanism
                const wrapper = document.createElement('div');
                wrapper.className = 'dyslexia-text-wrapper';
                
                const originalDiv = document.createElement('div');
                originalDiv.className = 'original-text';
                originalDiv.style.display = 'none';
                originalDiv.textContent = originalText;
                
                const simplifiedDiv = document.createElement('div');
                simplifiedDiv.className = 'simplified-text';
                simplifiedDiv.textContent = simplified;
                
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'text-toggle-btn';
                toggleBtn.textContent = '⇄';
                toggleBtn.title = 'Toggle between original and simplified text';
                toggleBtn.onclick = () => toggleTextVersion(originalDiv, simplifiedDiv, toggleBtn);
                
                wrapper.appendChild(simplifiedDiv);
                wrapper.appendChild(originalDiv);
                wrapper.appendChild(toggleBtn);
                
                element.parentNode.replaceChild(wrapper, element);
                
                if (usageAnalytics) {
                    usageAnalytics.trackFeature('text-simplification');
                }
            }
        } catch (error) {
            console.error('Failed to simplify text:', error);
        }
    }

    function toggleTextVersion(originalDiv, simplifiedDiv, toggleBtn) {
        const showingOriginal = originalDiv.style.display !== 'none';
        
        originalDiv.style.display = showingOriginal ? 'none' : 'block';
        simplifiedDiv.style.display = showingOriginal ? 'block' : 'none';
        toggleBtn.textContent = showingOriginal ? '⇄' : '⇄';
        toggleBtn.title = showingOriginal ? 'Show original text' : 'Show simplified text';
    }

    async function summarizeLongContent() {
        const contentElements = document.querySelectorAll('article, .content, .post, .main-content, main');
        
        for (const element of contentElements) {
            const text = element.textContent.trim();
            if (text.length > 1000) { // Only summarize long content
                try {
                    const summary = await textProcessor.summarizeText(text, 200);
                    if (summary && summary !== text) {
                        await addSummaryBox(element, summary);
                    }
                } catch (error) {
                    console.error('Failed to summarize content:', error);
                }
            }
        }
    }

    async function addSummaryBox(element, summary) {
        const summaryBox = document.createElement('div');
        summaryBox.className = 'dyslexia-summary-box';
        summaryBox.innerHTML = `
            <div class="summary-header">
                <h4>Quick Summary</h4>
                <button class="close-summary" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="summary-content">${summary}</div>
        `;
        
        element.insertBefore(summaryBox, element.firstChild);
        
        if (usageAnalytics) {
            usageAnalytics.trackFeature('text-summarization');
        }
    }

    async function translatePageContent() {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
        const targetLanguage = currentSettings['target-language'];
        
        for (const element of textElements) {
            const text = element.textContent.trim();
            if (text.length > 10) {
                try {
                    const translated = await textProcessor.translateText(text, targetLanguage);
                    if (translated && translated !== text) {
                        element.setAttribute('data-original', text);
                        element.textContent = translated;
                        element.classList.add('translated-text');
                    }
                } catch (error) {
                    console.error('Translation failed:', error);
                }
            }
        }
        
        if (usageAnalytics) {
            usageAnalytics.trackFeature('translation');
        }
    }

    async function processSelectedText() {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText) return;

        try {
            const result = await textProcessor.processText(selectedText, currentSettings);
            if (result.processedText !== selectedText) {
                // Show processed text in a popup
                showProcessedTextPopup(result);
            }
        } catch (error) {
            console.error('Text processing failed:', error);
        }
    }

    function showProcessedTextPopup(result) {
        const popup = document.createElement('div');
        popup.className = 'dyslexia-popup';
        popup.innerHTML = `
            <div class="popup-header">
                <h4>Processed Text</h4>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="popup-content">
                <div class="original-text">
                    <h5>Original:</h5>
                    <p>${result.originalText}</p>
                </div>
                <div class="processed-text">
                    <h5>Processed:</h5>
                    <p>${result.processedText}</p>
                </div>
                <div class="popup-actions">
                    <button onclick="this.parentElement.parentElement.parentElement.querySelector('.processed-text p').click()">
                        Read Aloud
                    </button>
                    <button onclick="navigator.clipboard.writeText('${result.processedText}')">
                        Copy
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Position popup near selection
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            popup.style.left = rect.left + 'px';
            popup.style.top = (rect.bottom + 10) + 'px';
        }
    }

    async function speakSelectedText() {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText || !speechProcessor) return;

        const speechOptions = {
            rate: currentSettings['speech-rate'] || 0.8,
            voiceURI: currentSettings['speech-voice']
        };

        speechProcessor.speakText(selectedText, speechOptions);
        
        if (usageAnalytics) {
            usageAnalytics.trackFeature('text-to-speech');
        }
    }

    async function speakPageContent() {
        if (!speechProcessor) return;

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

        // If still no content, use page title and body text
        if (!content) {
            content = document.title + '. ' + document.body.innerText.trim();
        }

        // Limit content length for TTS
        if (content.length > 5000) {
            content = content.substring(0, 5000) + '... Content truncated for speech.';
        }

        const speechOptions = {
            rate: currentSettings['speech-rate'] || 0.8,
            voiceURI: currentSettings['speech-voice']
        };

        speechProcessor.speakText(content, speechOptions);
        
        if (usageAnalytics) {
            usageAnalytics.trackFeature('page-to-speech');
        }
    }

    async function showWordAssistance(word, element) {
        try {
            // Get word definition or simplification
            const assistance = await textProcessor.simplifyText(`Define and simplify: ${word}`);
            
            const tooltip = document.createElement('div');
            tooltip.className = 'word-assistance-tooltip';
            tooltip.innerHTML = `
                <div class="tooltip-content">
                    <strong>${word}</strong>
                    <p>${assistance}</p>
                    <button onclick="this.parentElement.parentElement.remove()">Close</button>
                </div>
            `;
            
            document.body.appendChild(tooltip);
            
            // Position tooltip near the word
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 5) + 'px';
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.remove();
                }
            }, 5000);
            
        } catch (error) {
            console.error('Word assistance failed:', error);
        }
    }

    function setupSpeechRecognition() {
        if (!speechRecognition) return;

        speechRecognition.onResult = (finalTranscript, interimTranscript) => {
            // Handle speech input - could be used for voice commands
            if (finalTranscript.toLowerCase().includes('simplify this')) {
                processSelectedText();
            } else if (finalTranscript.toLowerCase().includes('read this')) {
                speakSelectedText();
            }
        };

        // Add voice command button
        const voiceBtn = document.createElement('button');
        voiceBtn.id = 'dyslexia-voice-btn';
        voiceBtn.innerHTML = 'Voice';
        voiceBtn.title = 'Voice Commands';
        voiceBtn.onclick = () => {
            if (speechRecognition.isListening) {
                speechRecognition.stopListening();
                voiceBtn.innerHTML = 'Voice';
            } else {
                speechRecognition.startListening();
                voiceBtn.innerHTML = 'Recording';
            }
        };
        
        document.body.appendChild(voiceBtn);
    }

    function applySettings() {
        if (!isEnabled) return;

        let css = generateCSS();
        dyslexiaStyles.textContent = css;

        // Handle special features
        handleReadingGuide();
        handleAnimations();
    }

    function generateCSS() {
        let css = '';

        // Font family
        if (currentSettings['font-family'] && currentSettings['font-family'] !== 'default') {
            let fontFamily = getFontFamily(currentSettings['font-family']);
            css += `
                * {
                    font-family: ${fontFamily} !important;
                }
            `;
        }

        // Font size
        if (currentSettings['font-size']) {
            css += `
                p, div, span, a, li, td, th, h1, h2, h3, h4, h5, h6 {
                    font-size: ${currentSettings['font-size']}px !important;
                }
            `;
        }

        // Line spacing
        if (currentSettings['line-spacing']) {
            css += `
                p, div, span, a, li, td, th {
                    line-height: ${currentSettings['line-spacing']} !important;
                }
            `;
        }

        // Letter spacing
        if (currentSettings['letter-spacing']) {
            css += `
                * {
                    letter-spacing: ${currentSettings['letter-spacing']}px !important;
                }
            `;
        }

        // Word spacing
        if (currentSettings['word-spacing']) {
            css += `
                * {
                    word-spacing: ${currentSettings['word-spacing']}px !important;
                }
            `;
        }

        // Highlight links
        if (currentSettings['highlight-links']) {
            css += `
                a {
                    background-color: yellow !important;
                    padding: 2px !important;
                    border-radius: 3px !important;
                    text-decoration: underline !important;
                    font-weight: bold !important;
                }
            `;
        }

        // Color filters
        if (currentSettings['color-filter'] && currentSettings['color-filter'] !== 'none') {
            css += getColorFilterCSS(currentSettings['color-filter']);
        }

        // Brightness
        if (currentSettings['brightness'] && currentSettings['brightness'] !== 100) {
            css += `
                html {
                    filter: brightness(${currentSettings['brightness']}%) !important;
                }
            `;
        }

        return css;
    }

    function getFontFamily(fontType) {
        const fontMap = {
            'open-dyslexic': '"OpenDyslexic", sans-serif',
            'arial': 'Arial, sans-serif',
            'verdana': 'Verdana, sans-serif',
            'comic-sans': '"Comic Sans MS", cursive'
        };
        return fontMap[fontType] || 'inherit';
    }

    function getColorFilterCSS(filterType) {
        const filterMap = {
            'yellow': `
                html {
                    background-color: #fffacd !important;
                }
                body {
                    background-color: transparent !important;
                }
            `,
            'blue': `
                html {
                    filter: hue-rotate(200deg) saturate(0.3) !important;
                }
            `,
            'green': `
                html {
                    filter: hue-rotate(80deg) saturate(0.5) !important;
                }
            `,
            'sepia': `
                html {
                    filter: sepia(1) !important;
                }
            `,
            'high-contrast': `
                html {
                    filter: contrast(200%) !important;
                }
                * {
                    text-shadow: 1px 1px 1px rgba(0,0,0,0.5) !important;
                }
            `
        };
        return filterMap[filterType] || '';
    }

    function handleReadingGuide() {
        if (currentSettings['reading-guide']) {
            createReadingGuide();
        } else {
            removeReadingGuide();
        }
    }

    function createReadingGuide() {
        if (readingGuide) return;

        readingGuide = document.createElement('div');
        readingGuide.id = 'dyslexia-reading-guide';
        readingGuide.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 0 !important;
            width: 100% !important;
            height: 3px !important;
            background-color: rgba(255, 0, 0, 0.7) !important;
            z-index: 10000 !important;
            pointer-events: none !important;
            transform: translateY(-50%) !important;
            transition: top 0.1s ease !important;
        `;
        document.body.appendChild(readingGuide);

        document.addEventListener('mousemove', updateReadingGuide);
    }

    function updateReadingGuide(e) {
        if (readingGuide) {
            readingGuide.style.top = e.clientY + 'px';
        }
    }

    function removeReadingGuide() {
        if (readingGuide) {
            document.removeEventListener('mousemove', updateReadingGuide);
            readingGuide.remove();
            readingGuide = null;
        }
    }

    function handleAnimations() {
        if (currentSettings['reduce-animations']) {
            const animationCSS = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            dyslexiaStyles.textContent += animationCSS;
        }
    }

    function resetStyles() {
        if (dyslexiaStyles) {
            dyslexiaStyles.textContent = '';
        }
        removeReadingGuide();
    }

    // Listen for storage changes
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'sync') {
            loadSettings();
        }
    });

    // Advanced AI Functions
    function toggleAIPanel() {
        const panel = document.querySelector('#ai-assistant-panel');
        const voicePanel = document.querySelector('#voice-commands-panel');
        
        if (panel) {
            const isVisible = panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'block';
            
            // Hide voice panel if showing AI panel
            if (!isVisible && voicePanel) {
                voicePanel.style.display = 'none';
            }
        }
    }

    function toggleVoicePanel() {
        const panel = document.querySelector('#voice-commands-panel');
        const aiPanel = document.querySelector('#ai-assistant-panel');
        
        if (panel) {
            const isVisible = panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'block';
            
            // Hide AI panel if showing voice panel
            if (!isVisible && aiPanel) {
                aiPanel.style.display = 'none';
            }
        }
    }

    async function checkContentDifficulty() {
        if (!advancedAI) {
            showPopupMessage('Advanced AI features not available', 'warning');
            return;
        }

        const contentArea = document.querySelector('#popup-content-area');
        const text = contentArea ? contentArea.textContent : '';
        
        if (!text.trim()) {
            showPopupMessage('No content to analyze', 'warning');
            return;
        }

        showPopupMessage('Analyzing content difficulty...', 'info');

        try {
            const analysis = await advancedAI.assessReadingDifficulty(text);
            
            let message = `Reading Difficulty Analysis:\n`;
            message += `Grade Level: ${analysis.gradeLevel}\n`;
            message += `Average words per sentence: ${analysis.basicMetrics.avgWordsPerSentence}\n`;
            message += `Complex words: ${analysis.basicMetrics.complexWordPercentage}%\n`;
            
            if (analysis.recommendations && analysis.recommendations.length > 0) {
                message += `\n💡 Recommendations:\n${analysis.recommendations.join('\n')}`;
            }

            showPopupMessage(message, 'success');
        } catch (error) {
            showPopupMessage('Failed to analyze content difficulty', 'error');
            console.error('Difficulty analysis error:', error);
        }
    }

    async function analyzeReadingDifficulty() {
        if (!advancedAI) return;

        const contentArea = document.querySelector('#popup-content-area');
        const text = contentArea ? contentArea.textContent : '';
        
        showAIMessage('Analyzing reading difficulty...', 'analyze-difficulty');

        try {
            const assistant = await advancedAI.createReadingAssistant(text);
            
            let resultHTML = `
                <div class="ai-result">
                    <h4>Reading Difficulty Analysis</h4>
                    <div class="difficulty-metrics">
                        <div class="metric">
                            <span class="metric-label">Grade Level:</span>
                            <span class="metric-value">${assistant.difficulty || 'Unknown'}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Word Count:</span>
                            <span class="metric-value">${assistant.analysis?.basicMetrics?.totalWords || 0}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Avg. Sentence Length:</span>
                            <span class="metric-value">${assistant.analysis?.basicMetrics?.avgWordsPerSentence?.toFixed(1) || 0} words</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Complex Words:</span>
                            <span class="metric-value">${assistant.analysis?.basicMetrics?.complexWordPercentage || 0}%</span>
                        </div>
                    </div>
            `;

            if (assistant.suggestions && assistant.suggestions.length > 0) {
                resultHTML += `
                    <div class="ai-suggestions">
                        <h5>Personalized Suggestions:</h5>
                        <ul>
                            ${assistant.suggestions.map(s => `<li>${s.message}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            resultHTML += `</div>`;
            
            showAIResult(resultHTML, 'analyze-difficulty');
        } catch (error) {
            showAIMessage('Failed to analyze difficulty', 'analyze-difficulty', 'error');
        }
    }

    async function extractContentKeywords() {
        if (!advancedAI) return;

        const contentArea = document.querySelector('#popup-content-area');
        const text = contentArea ? contentArea.textContent : '';
        
        showAIMessage('Extracting key concepts...', 'extract-keywords');

        try {
            const keywords = await advancedAI.extractKeywords(text);
            
            let resultHTML = `
                <div class="ai-result">
                    <h4>Key Concepts</h4>
                    <div class="keywords-grid">
                        ${keywords.map(kw => `
                            <div class="keyword-item" style="opacity: ${kw.confidence}">
                                <span class="keyword">${kw.keyword}</span>
                                <span class="confidence">${Math.round(kw.confidence * 100)}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            showAIResult(resultHTML, 'extract-keywords');
        } catch (error) {
            showAIMessage('Failed to extract keywords', 'extract-keywords', 'error');
        }
    }

    async function analyzeSentiment() {
        if (!advancedAI) return;

        const contentArea = document.querySelector('#popup-content-area');
        const text = contentArea ? contentArea.textContent : '';
        
        showAIMessage('Analyzing emotional tone...', 'sentiment-analysis');

        try {
            const sentiment = await advancedAI.analyzeSentiment(text);
            
            let resultHTML = `
                <div class="ai-result">
                    <h4>Emotional Tone Analysis</h4>
                    <div class="sentiment-result">
                        <div class="sentiment-main">
                            <span class="sentiment-label">${sentiment.label || 'Unknown'}</span>
                            <span class="sentiment-confidence">${Math.round((sentiment.confidence || 0) * 100)}% confidence</span>
                        </div>
                        <div class="sentiment-description">
                            This content has a <strong>${sentiment.emotionalTone || 'neutral tone'}</strong>.
                        </div>
            `;

                if (sentiment.recommendations && sentiment.recommendations.length > 0) {
                resultHTML += `
                    <div class="sentiment-tips">
                        <h5>Reading Tips:</h5>
                        <ul>
                            ${sentiment.recommendations.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            resultHTML += `</div></div>`;
            
            showAIResult(resultHTML, 'sentiment-analysis');
        } catch (error) {
            showAIMessage('Failed to analyze sentiment', 'sentiment-analysis', 'error');
        }
    }

    async function askAIQuestion() {
        if (!advancedAI) return;

        const questionInput = document.querySelector('#ai-question');
        const question = questionInput ? questionInput.value.trim() : '';
        
        if (!question) {
            showAIMessage('Please enter a question', 'ask-ai', 'warning');
            return;
        }

        const contentArea = document.querySelector('#popup-content-area');
        const context = contentArea ? contentArea.textContent : '';
        
        showAIMessage('Finding answer...', 'ask-ai');

        try {
            const answer = await advancedAI.answerQuestion(question, context);
            
            let resultHTML = `
                <div class="ai-result">
                    <h4>${question}</h4>
                    <div class="ai-answer-content">
                        <p><strong>Answer:</strong> ${answer.answer || answer.fallback || 'No answer found'}</p>
                        ${answer.confidence ? `<p class="confidence">Confidence: ${Math.round(answer.confidence * 100)}%</p>` : ''}
                    </div>
                </div>
            `;
            
            showAIResult(resultHTML, 'ask-ai');
            
            // Clear the question input
            if (questionInput) {
                questionInput.value = '';
            }
        } catch (error) {
            showAIMessage('Failed to answer question', 'ask-ai', 'error');
        }
    }

    async function getPersonalizedRecommendations() {
        if (!advancedAI) return;

        showAIMessage('Getting personalized recommendations...', 'get-recommendations');

        try {
            const profile = await advancedAI.userProfile.getProfile();
            const recommendations = advancedAI.userProfile.getPersonalizedRecommendations();
            
            let resultHTML = `
                <div class="ai-result">
                    <h4>Personalized Recommendations</h4>
                    <div class="user-stats">
                        <div class="stat">Reading Speed: ${profile.avgReadingSpeed} WPM</div>
                        <div class="stat">Preferred Level: Grade ${profile.preferredDifficulty}</div>
                    </div>
            `;

            if (recommendations.length > 0) {
                resultHTML += `
                    <div class="recommendations-list">
                        ${recommendations.map(rec => `
                            <div class="recommendation ${rec.priority}">
                                <strong>${rec.type.toUpperCase()}:</strong> ${rec.message}
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                resultHTML += `<p>You're doing great! Keep up the good reading habits.</p>`;
            }

            resultHTML += `</div>`;
            
            showAIResult(resultHTML, 'get-recommendations');
        } catch (error) {
            showAIMessage('Failed to get recommendations', 'get-recommendations', 'error');
        }
    }

    function showProgressTracking() {
        const resultHTML = `
            <div class="ai-result">
                <h4>Progress Tracking</h4>
                <p>Your reading progress is being tracked. Visit the Analytics dashboard for detailed insights.</p>
                <button class="ai-btn" onclick="chrome.runtime.sendMessage({action: 'openAnalytics'})">
                    View Full Analytics
                </button>
            </div>
        `;
        
        showAIResult(resultHTML, 'track-progress');
    }

    // Voice Commands Functions
    async function startVoiceListening() {
        if (!speechRecognition) {
            showVoiceMessage('Voice recognition not available', 'error');
            return;
        }

        const startBtn = document.querySelector('#start-listening');
        const stopBtn = document.querySelector('#stop-listening');
        const statusEl = document.querySelector('#voice-status');
        
        try {
            speechRecognition.onListeningStart = () => {
                startBtn.disabled = true;
                stopBtn.disabled = false;
                statusEl.textContent = 'Listening... Speak now!';
                statusEl.className = 'voice-status listening';
            };

            speechRecognition.onResult = async (finalTranscript, interimTranscript) => {
                const transcriptEl = document.querySelector('#voice-transcript');
                transcriptEl.innerHTML = `
                    <div class="transcript-final">${finalTranscript}</div>
                    <div class="transcript-interim">${interimTranscript}</div>
                `;

                if (finalTranscript.trim()) {
                    await processVoiceCommand(finalTranscript);
                }
            };

            speechRecognition.onListeningEnd = () => {
                startBtn.disabled = false;
                stopBtn.disabled = true;
                statusEl.textContent = 'Ready to listen...';
                statusEl.className = 'voice-status';
            };

            speechRecognition.onError = (error) => {
                showVoiceMessage(`Voice recognition error: ${error}`, 'error');
                startBtn.disabled = false;
                stopBtn.disabled = true;
            };

            speechRecognition.startListening();
        } catch (error) {
            showVoiceMessage('Failed to start voice recognition', 'error');
        }
    }

    function stopVoiceListening() {
        if (speechRecognition) {
            speechRecognition.stopListening();
        }
    }

    async function processVoiceCommand(command) {
        if (!advancedAI) return;

        showVoiceMessage(`Processing: "${command}"`, 'info');

        try {
            const contentArea = document.querySelector('#popup-content-area');
            const context = contentArea ? contentArea.textContent : '';
            
            const result = await advancedAI.processVoiceCommand(command, context);

            if (result.error) {
                showVoiceMessage(result.error, 'error');
                if (result.suggestion) {
                    showVoiceMessage(result.suggestion, 'info');
                }
                return;
            }

            switch (result.action) {
                case 'speak':
                    if (speechProcessor) {
                        speechProcessor.speakText(result.text);
                        showVoiceMessage('Reading aloud...', 'success');
                    }
                    break;
                
                case 'display':
                    if (result.text) {
                        updatePopupContent(result.text, result.type);
                        showVoiceMessage(`Content ${result.type}!`, 'success');
                    }
                    break;
                
                default:
                    showVoiceMessage('Command executed', 'success');
            }
        } catch (error) {
            showVoiceMessage('Failed to process voice command', 'error');
        }
    }

    // Helper functions for AI features
    function showAIMessage(message, buttonId, type = 'info') {
        const button = document.querySelector(`#${buttonId}`);
        if (button) {
            const originalText = button.textContent;
            button.textContent = message;
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 3000);
        }
    }

    function showAIResult(html, containerId) {
        const container = document.querySelector('#ai-recommendations');
        if (container) {
            container.innerHTML = html;
            container.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function showVoiceMessage(message, type = 'info') {
        const statusEl = document.querySelector('#voice-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `voice-status ${type}`;
        }
    }

    function updatePopupContent(newContent, contentType) {
        const contentArea = document.querySelector('#popup-content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="content-header">
                    <span class="content-type-badge">${contentType}</span>
                </div>
                <div class="processed-content">${newContent}</div>
            `;
        }
    }

    // New Feature Functions
    function toggleFocusMode() {
        if (focusMode) {
            focusMode.toggle();
            showPopupMessage('Focus mode toggled', 'info');
            if (usageAnalytics) {
                usageAnalytics.trackFeature('focus-mode');
            }
        } else {
            showPopupMessage('Focus mode not available', 'warning');
        }
    }

    function toggleReadingRuler() {
        if (readingRuler) {
            readingRuler.activate();
            showPopupMessage('Reading ruler toggled', 'info');
            if (usageAnalytics) {
                usageAnalytics.trackFeature('reading-ruler');
            }
        } else {
            showPopupMessage('Reading ruler not available', 'warning');
        }
    }

    function toggleReadingTracker() {
        if (readingTracker) {
            readingTracker.toggleStatsPanel();
            showPopupMessage('Reading tracker opened', 'info');
            if (usageAnalytics) {
                usageAnalytics.trackFeature('reading-tracker');
            }
        } else {
            showPopupMessage('Reading tracker not available', 'warning');
        }
    }

    function toggleWordHighlighter() {
        if (wordHighlighter) {
            wordHighlighter.clearHighlights();
            showPopupMessage('Word highlighter cleared. Double-click words for analysis.', 'info');
            if (usageAnalytics) {
                usageAnalytics.trackFeature('word-highlighter');
            }
        } else {
            showPopupMessage('Word highlighter not available', 'warning');
        }
    }

    async function showAccessibilityAnalysis() {
        if (!accessibilityAnalyzer) {
            showPopupMessage('Accessibility analyzer not available', 'warning');
            return;
        }

        showPopupMessage('Analyzing page accessibility...', 'info');

        try {
            const analysis = await accessibilityAnalyzer.analyzePageAccessibility();
            
            // Create accessibility results popup
            const resultsPopup = document.createElement('div');
            resultsPopup.id = 'accessibility-results';
            resultsPopup.className = 'accessibility-overlay';
            resultsPopup.innerHTML = `
                <div class="accessibility-popup">
                    <div class="accessibility-header">
                        <h3>Accessibility Analysis</h3>
                        <button class="close-btn" onclick="this.closest('.accessibility-overlay').remove()">×</button>
                    </div>
                    <div class="accessibility-content">
                        <div class="score-section">
                            <div class="overall-score ${analysis.overallScore >= 80 ? 'good' : analysis.overallScore >= 60 ? 'fair' : 'poor'}">
                                <h4>Overall Score: ${analysis.overallScore}/100</h4>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${analysis.overallScore}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <h5>Readability</h5>
                                <div class="metric-score">${analysis.readability.score}/100</div>
                                <div class="metric-details">
                                    <p>Grade Level: ${analysis.readability.gradeLevel}</p>
                                    <p>Avg. Sentence: ${analysis.readability.avgSentenceLength} words</p>
                                </div>
                            </div>
                            
                            <div class="metric-card">
                                <h5>Color Contrast</h5>
                                <div class="metric-score">${analysis.colorContrast.score}/100</div>
                                <div class="metric-details">
                                    <p>WCAG AA: ${analysis.colorContrast.wcagAACompliant ? '✓' : '✗'}</p>
                                    <p>Issues: ${analysis.colorContrast.issues.length}</p>
                                </div>
                            </div>
                            
                            <div class="metric-card">
                                <h5>Layout</h5>
                                <div class="metric-score">${analysis.layout.score}/100</div>
                                <div class="metric-details">
                                    <p>Line Length: ${analysis.layout.averageLineLength}</p>
                                    <p>Spacing: ${analysis.layout.hasGoodSpacing ? 'Good' : 'Poor'}</p>
                                </div>
                            </div>
                            
                            <div class="metric-card">
                                <h5>Fonts</h5>
                                <div class="metric-score">${analysis.fonts.score}/100</div>
                                <div class="metric-details">
                                    <p>Dyslexia-friendly: ${analysis.fonts.dyslexiaFriendlyFonts}</p>
                                    <p>Consistent sizing: ${analysis.fonts.consistentSizing ? '✓' : '✗'}</p>
                                </div>
                            </div>
                            
                            <div class="metric-card">
                                <h5>Navigation</h5>
                                <div class="metric-score">${analysis.navigation.score}/100</div>
                                <div class="metric-details">
                                    <p>Heading Structure: ${analysis.navigation.hasGoodHeadingStructure ? 'Good' : 'Poor'}</p>
                                    <p>Landmarks: ${analysis.navigation.ariaLandmarks}</p>
                                </div>
                            </div>
                            
                            <div class="metric-card">
                                <h5>Motion</h5>
                                <div class="metric-score">${analysis.motion.score}/100</div>
                                <div class="metric-details">
                                    <p>Animations: ${analysis.motion.animatedElements}</p>
                                    <p>Auto-play videos: ${analysis.motion.autoplayVideos}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="recommendations-section">
                            <h4>Recommendations for Better Accessibility</h4>
                            <ul class="recommendations-list">
                                ${analysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="dyslexia-specific">
                            <h4>Dyslexia-Specific Insights</h4>
                            <div class="insight-grid">
                                ${analysis.dyslexiaSpecific.map(insight => `
                                    <div class="insight-item">
                                        <strong>${insight.category}:</strong> ${insight.message}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="accessibility-footer">
                        <button class="btn btn-secondary" onclick="this.closest('.accessibility-overlay').remove()">Close</button>
                        <button class="btn btn-primary" onclick="chrome.runtime.sendMessage({action: 'openAnalytics'})">View Full Report</button>
                    </div>
                </div>
            `;

            document.body.appendChild(resultsPopup);
            
            showPopupMessage('Accessibility analysis complete!', 'success');
            
            if (usageAnalytics) {
                usageAnalytics.trackFeature('accessibility-analysis');
            }
        } catch (error) {
            showPopupMessage('Failed to analyze accessibility', 'error');
            console.error('Accessibility analysis error:', error);
        }
    }

})();