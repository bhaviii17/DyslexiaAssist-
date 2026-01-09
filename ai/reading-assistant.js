// Reading Time Estimator and Progress Tracker
class ReadingProgressTracker {
    constructor() {
        this.startTime = null;
        this.pausedTime = 0;
        this.isPaused = false;
        this.wordsRead = 0;
        this.totalWords = 0;
        this.readingSpeed = 200; // words per minute (default)
        this.progressBar = null;
        this.statsPanel = null;
        this.isTracking = false;
        this.readingHistory = [];
        this.currentSession = null;
    }

    // Initialize reading tracker
    init() {
        this.analyzePageContent();
        this.createProgressInterface();
        this.setupScrollTracking();
        this.loadUserSettings();
    }

    // Analyze page content for word count and reading time
    analyzePageContent() {
        const content = this.extractReadableContent();
        this.totalWords = this.countWords(content.text);
        
        const estimatedTime = this.calculateReadingTime(this.totalWords);
        
        return {
            wordCount: this.totalWords,
            estimatedMinutes: Math.ceil(estimatedTime),
            difficulty: this.assessContentDifficulty(content.text),
            readability: this.calculateReadabilityScore(content.text),
            headings: content.headings.length,
            paragraphs: content.paragraphs.length
        };
    }

    // Extract readable content from page
    extractReadableContent() {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, article, section');
        let text = '';
        let headings = [];
        let paragraphs = [];
        
        textElements.forEach(element => {
            const elementText = element.textContent.trim();
            if (elementText) {
                text += elementText + ' ';
                
                if (element.tagName.match(/^H[1-6]$/)) {
                    headings.push({
                        level: parseInt(element.tagName[1]),
                        text: elementText,
                        element: element
                    });
                } else if (element.tagName === 'P') {
                    paragraphs.push({
                        text: elementText,
                        element: element,
                        wordCount: this.countWords(elementText)
                    });
                }
            }
        });
        
        return { text, headings, paragraphs };
    }

    // Count words in text
    countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    // Calculate estimated reading time
    calculateReadingTime(wordCount) {
        // Adjust for dyslexia - typically 20-30% slower
        const adjustedSpeed = this.readingSpeed * 0.75;
        return wordCount / adjustedSpeed;
    }

    // Assess content difficulty
    assessContentDifficulty(text) {
        const words = text.split(/\s+/);
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        const longWords = words.filter(word => word.length > 6).length;
        const longWordRatio = longWords / words.length;
        
        if (avgWordLength < 4 && longWordRatio < 0.1) return 'Easy';
        if (avgWordLength < 5 && longWordRatio < 0.2) return 'Medium';
        if (avgWordLength < 6 && longWordRatio < 0.3) return 'Hard';
        return 'Very Hard';
    }

    // Calculate readability score (simplified Flesch Reading Ease)
    calculateReadabilityScore(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
        const words = this.countWords(text);
        const syllables = this.countSyllables(text);
        
        if (sentences === 0 || words === 0) return 0;
        
        const avgSentenceLength = words / sentences;
        const avgSyllablesPerWord = syllables / words;
        
        const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    // Count syllables in text (simplified)
    countSyllables(text) {
        const words = text.toLowerCase().split(/\s+/);
        let totalSyllables = 0;
        
        words.forEach(word => {
            word = word.replace(/[^a-z]/g, '');
            if (word.length === 0) return;
            
            let syllables = word.match(/[aeiouy]+/g) || [];
            
            // Adjust for silent 'e'
            if (word.endsWith('e')) {
                syllables = syllables.slice(0, -1);
            }
            
            // Ensure at least 1 syllable
            totalSyllables += Math.max(1, syllables.length);
        });
        
        return totalSyllables;
    }

    // Create progress interface
    createProgressInterface() {
        // Create progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.id = 'dyslexia-progress-bar';
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(0, 0, 0, 0.1);
            z-index: 10002;
            display: none;
        `;
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.cssText = `
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #4caf50, #8bc34a);
            transition: width 0.3s ease;
        `;
        
        this.progressBar.appendChild(progressFill);
        document.body.appendChild(this.progressBar);
        
        // Create stats panel
        this.createStatsPanel();
    }

    // Create detailed stats panel
    createStatsPanel() {
        this.statsPanel = document.createElement('div');
        this.statsPanel.id = 'dyslexia-reading-stats';
        this.statsPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10003;
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: none;
        `;
        
        document.body.appendChild(this.statsPanel);
        this.updateStatsPanel();
    }

    // Update stats panel content
    updateStatsPanel() {
        if (!this.statsPanel) return;
        
        const analysis = this.analyzePageContent();
        const elapsed = this.getElapsedTime();
        const progress = this.calculateProgress();
        const timeRemaining = this.calculateTimeRemaining();
        
        this.statsPanel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; color: #333;">
                📖 Reading Progress
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Progress:</strong> ${Math.round(progress)}%
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Time Elapsed:</strong> ${this.formatTime(elapsed)}
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Time Remaining:</strong> ${this.formatTime(timeRemaining)}
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Words Read:</strong> ${this.wordsRead} / ${this.totalWords}
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Reading Speed:</strong> ${this.getCurrentReadingSpeed()} WPM
            </div>
            
            <div style="margin-bottom: 8px;">
                <strong>Difficulty:</strong> ${analysis.difficulty}
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong>Readability:</strong> ${analysis.readability}/100
            </div>
            
            <div style="display: flex; gap: 8px;">
                <button onclick="window.readingTracker.toggleTracking()" 
                        style="flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; cursor: pointer;">
                    ${this.isTracking ? '⏸️ Pause' : '▶️ Start'}
                </button>
                <button onclick="window.readingTracker.resetSession()" 
                        style="flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; cursor: pointer;">
                    🔄 Reset
                </button>
            </div>
            
            <div style="margin-top: 10px;">
                <button onclick="window.readingTracker.toggleStatsPanel()" 
                        style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; cursor: pointer;">
                    ❌ Close
                </button>
            </div>
        `;
    }

    // Setup scroll-based progress tracking
    setupScrollTracking() {
        let lastScrollTime = Date.now();
        
        window.addEventListener('scroll', () => {
            if (!this.isTracking) return;
            
            const now = Date.now();
            const timeSinceLastScroll = now - lastScrollTime;
            
            // Only update if user is actively reading (not rapid scrolling)
            if (timeSinceLastScroll > 1000) {
                this.updateProgressFromScroll();
                lastScrollTime = now;
            }
        });
        
        // Update progress every 5 seconds during active reading
        setInterval(() => {
            if (this.isTracking && !this.isPaused) {
                this.updateProgressFromScroll();
                this.updateStatsPanel();
            }
        }, 5000);
    }

    // Update progress based on scroll position
    updateProgressFromScroll() {
        const scrollPercent = this.getScrollPercentage();
        this.wordsRead = Math.round(this.totalWords * (scrollPercent / 100));
        
        // Update progress bar
        if (this.progressBar) {
            const progressFill = this.progressBar.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = scrollPercent + '%';
            }
        }
    }

    // Get current scroll percentage
    getScrollPercentage() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    }

    // Calculate reading progress
    calculateProgress() {
        return this.totalWords > 0 ? (this.wordsRead / this.totalWords) * 100 : 0;
    }

    // Calculate time remaining
    calculateTimeRemaining() {
        const wordsRemaining = this.totalWords - this.wordsRead;
        const currentSpeed = this.getCurrentReadingSpeed();
        return currentSpeed > 0 ? wordsRemaining / currentSpeed : 0;
    }

    // Get current reading speed
    getCurrentReadingSpeed() {
        const elapsed = this.getElapsedTime();
        return elapsed > 0 ? (this.wordsRead / elapsed) * 60 : this.readingSpeed;
    }

    // Get elapsed reading time (in minutes)
    getElapsedTime() {
        if (!this.startTime) return 0;
        const now = Date.now();
        const totalElapsed = (now - this.startTime - this.pausedTime) / 1000 / 60;
        return Math.max(0, totalElapsed);
    }

    // Format time for display
    formatTime(minutes) {
        if (minutes < 1) {
            return `${Math.round(minutes * 60)}s`;
        } else if (minutes < 60) {
            return `${Math.round(minutes)}m`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = Math.round(minutes % 60);
            return `${hours}h ${mins}m`;
        }
    }

    // Toggle tracking on/off
    toggleTracking() {
        if (this.isTracking) {
            this.pauseTracking();
        } else {
            this.startTracking();
        }
    }

    // Start tracking
    startTracking() {
        if (!this.startTime) {
            this.startTime = Date.now();
            this.currentSession = {
                startTime: this.startTime,
                url: window.location.href,
                title: document.title,
                wordCount: this.totalWords
            };
        } else if (this.isPaused) {
            this.pausedTime += Date.now() - this.pauseStartTime;
        }
        
        this.isTracking = true;
        this.isPaused = false;
        this.progressBar.style.display = 'block';
        this.updateStatsPanel();
        
        this.trackUsage('reading-started');
    }

    // Pause tracking
    pauseTracking() {
        this.isTracking = false;
        this.isPaused = true;
        this.pauseStartTime = Date.now();
        this.updateStatsPanel();
        
        this.trackUsage('reading-paused');
    }

    // Reset current session
    resetSession() {
        this.startTime = null;
        this.pausedTime = 0;
        this.isPaused = false;
        this.wordsRead = 0;
        this.isTracking = false;
        this.currentSession = null;
        
        this.progressBar.style.display = 'none';
        if (this.progressBar) {
            const progressFill = this.progressBar.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = '0%';
            }
        }
        
        this.updateStatsPanel();
        this.trackUsage('reading-reset');
    }

    // Save session to history
    saveSession() {
        if (this.currentSession && this.wordsRead > 0) {
            const session = {
                ...this.currentSession,
                endTime: Date.now(),
                wordsRead: this.wordsRead,
                readingTime: this.getElapsedTime(),
                progress: this.calculateProgress(),
                avgSpeed: this.getCurrentReadingSpeed()
            };
            
            this.readingHistory.push(session);
            this.saveToStorage();
        }
    }

    // Show/hide stats panel
    toggleStatsPanel() {
        if (this.statsPanel.style.display === 'none') {
            this.statsPanel.style.display = 'block';
            this.updateStatsPanel();
        } else {
            this.statsPanel.style.display = 'none';
        }
    }

    // Load user settings
    loadUserSettings() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get(['reading-speed', 'reading-history'], (result) => {
                if (result['reading-speed']) {
                    this.readingSpeed = result['reading-speed'];
                }
                if (result['reading-history']) {
                    this.readingHistory = result['reading-history'];
                }
            });
        }
    }

    // Save to storage
    saveToStorage() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.set({
                'reading-history': this.readingHistory.slice(-50), // Keep last 50 sessions
                'reading-speed': this.readingSpeed
            });
        }
    }

    // Track usage for analytics
    trackUsage(action) {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'trackUsage',
                feature: 'reading-tracker',
                data: { 
                    action, 
                    wordsRead: this.wordsRead,
                    totalWords: this.totalWords,
                    readingTime: this.getElapsedTime()
                }
            });
        }
    }
}

// Text-to-Speech Controller with enhanced features
class TextToSpeechController {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentText = '';
        this.currentSentence = 0;
        this.sentences = [];
        this.settings = {
            rate: 0.8,
            pitch: 1,
            volume: 0.8,
            voice: null,
            highlightSentences: true,
            autoScroll: true
        };
        this.highlightedElement = null;
    }

    // Initialize TTS
    init() {
        this.loadSettings();
        this.setupVoices();
        this.createControls();
    }

    // Setup available voices
    setupVoices() {
        const updateVoices = () => {
            const voices = this.synth.getVoices();
            
            // Prefer female voices for dyslexia assistance
            const preferredVoices = voices.filter(voice => 
                voice.lang.startsWith('en') && 
                (voice.name.toLowerCase().includes('female') || 
                 voice.name.toLowerCase().includes('zira') ||
                 voice.name.toLowerCase().includes('samantha'))
            );
            
            if (preferredVoices.length > 0) {
                this.settings.voice = preferredVoices[0];
            } else if (voices.length > 0) {
                this.settings.voice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
            }
        };
        
        updateVoices();
        
        // Some browsers load voices asynchronously
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = updateVoices;
        }
    }

    // Create TTS controls
    createControls() {
        const controls = document.createElement('div');
        controls.id = 'dyslexia-tts-controls';
        controls.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10004;
            font-family: Arial, sans-serif;
            display: none;
            min-width: 200px;
        `;
        
        controls.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; color: #333;">
                🔊 Text-to-Speech
            </div>
            
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                <button onclick="window.ttsController.playPause()" 
                        style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; cursor: pointer;">
                    <span id="tts-play-btn">▶️ Play</span>
                </button>
                <button onclick="window.ttsController.stop()" 
                        style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; cursor: pointer;">
                    ⏹️ Stop
                </button>
            </div>
            
            <div style="margin-bottom: 8px;">
                <label>Speed: <span id="tts-rate-value">${this.settings.rate}</span></label>
                <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="${this.settings.rate}"
                       style="width: 100%; margin-top: 4px;"
                       onchange="window.ttsController.updateRate(this.value)">
            </div>
            
            <div style="margin-bottom: 8px;">
                <label>Pitch: <span id="tts-pitch-value">${this.settings.pitch}</span></label>
                <input type="range" id="tts-pitch" min="0.5" max="2" step="0.1" value="${this.settings.pitch}"
                       style="width: 100%; margin-top: 4px;"
                       onchange="window.ttsController.updatePitch(this.value)">
            </div>
            
            <div style="margin-bottom: 10px;">
                <label>Volume: <span id="tts-volume-value">${this.settings.volume}</span></label>
                <input type="range" id="tts-volume" min="0" max="1" step="0.1" value="${this.settings.volume}"
                       style="width: 100%; margin-top: 4px;"
                       onchange="window.ttsController.updateVolume(this.value)">
            </div>
            
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" ${this.settings.highlightSentences ? 'checked' : ''} 
                           onchange="window.ttsController.toggleHighlight(this.checked)">
                    Highlight sentences
                </label>
            </div>
            
            <button onclick="window.ttsController.readSelection()" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #e3f2fd; cursor: pointer; margin-bottom: 8px;">
                📖 Read Selection
            </button>
            
            <button onclick="window.ttsController.readPage()" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; background: #e3f2fd; cursor: pointer; margin-bottom: 8px;">
                📄 Read Page
            </button>
            
            <button onclick="window.ttsController.toggleControls()" 
                    style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; cursor: pointer;">
                ❌ Close
            </button>
        `;
        
        document.body.appendChild(controls);
    }

    // Read selected text
    readSelection() {
        const selection = window.getSelection();
        if (selection.toString().trim()) {
            this.readText(selection.toString());
        } else {
            alert('Please select some text to read.');
        }
    }

    // Read entire page
    readPage() {
        const content = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
        let text = '';
        
        content.forEach(element => {
            const elementText = element.textContent.trim();
            if (elementText) {
                text += elementText + '. ';
            }
        });
        
        if (text) {
            this.readText(text);
        } else {
            alert('No readable content found on this page.');
        }
    }

    // Read specific text
    readText(text) {
        this.stop();
        
        this.currentText = text;
        this.sentences = this.splitIntoSentences(text);
        this.currentSentence = 0;
        
        this.playCurrentSentence();
    }

    // Split text into sentences
    splitIntoSentences(text) {
        return text.split(/[.!?]+/)
                  .map(s => s.trim())
                  .filter(s => s.length > 0);
    }

    // Play current sentence
    playCurrentSentence() {
        if (this.currentSentence >= this.sentences.length) {
            this.stop();
            return;
        }
        
        const sentence = this.sentences[this.currentSentence];
        
        this.utterance = new SpeechSynthesisUtterance(sentence);
        this.utterance.rate = this.settings.rate;
        this.utterance.pitch = this.settings.pitch;
        this.utterance.volume = this.settings.volume;
        this.utterance.voice = this.settings.voice;
        
        this.utterance.onend = () => {
            this.currentSentence++;
            if (this.isPlaying) {
                setTimeout(() => this.playCurrentSentence(), 200);
            }
        };
        
        this.utterance.onerror = (error) => {
            console.error('Speech synthesis error:', error);
            this.stop();
        };
        
        if (this.settings.highlightSentences) {
            this.highlightCurrentSentence();
        }
        
        this.synth.speak(this.utterance);
    }

    // Highlight current sentence
    highlightCurrentSentence() {
        // Remove previous highlight
        if (this.highlightedElement) {
            this.highlightedElement.style.backgroundColor = '';
        }
        
        // Find and highlight current sentence
        const textNodes = this.getTextNodes(document.body);
        for (let node of textNodes) {
            if (node.textContent.includes(this.sentences[this.currentSentence])) {
                const element = node.parentElement;
                element.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
                this.highlightedElement = element;
                
                // Scroll to element if auto-scroll is enabled
                if (this.settings.autoScroll) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                break;
            }
        }
    }

    // Get all text nodes
    getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }
        
        return textNodes;
    }

    // Play/pause toggle
    playPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    // Play
    play() {
        if (this.isPaused) {
            this.synth.resume();
            this.isPaused = false;
        } else if (this.currentText) {
            this.playCurrentSentence();
        }
        
        this.isPlaying = true;
        this.updatePlayButton();
    }

    // Pause
    pause() {
        this.synth.pause();
        this.isPlaying = false;
        this.isPaused = true;
        this.updatePlayButton();
    }

    // Stop
    stop() {
        this.synth.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.currentSentence = 0;
        
        // Remove highlighting
        if (this.highlightedElement) {
            this.highlightedElement.style.backgroundColor = '';
            this.highlightedElement = null;
        }
        
        this.updatePlayButton();
    }

    // Update play button text
    updatePlayButton() {
        const playBtn = document.getElementById('tts-play-btn');
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '⏸️ Pause' : '▶️ Play';
        }
    }

    // Update settings
    updateRate(value) {
        this.settings.rate = parseFloat(value);
        document.getElementById('tts-rate-value').textContent = value;
        this.saveSettings();
    }

    updatePitch(value) {
        this.settings.pitch = parseFloat(value);
        document.getElementById('tts-pitch-value').textContent = value;
        this.saveSettings();
    }

    updateVolume(value) {
        this.settings.volume = parseFloat(value);
        document.getElementById('tts-volume-value').textContent = value;
        this.saveSettings();
    }

    toggleHighlight(enabled) {
        this.settings.highlightSentences = enabled;
        this.saveSettings();
    }

    // Toggle controls visibility
    toggleControls() {
        const controls = document.getElementById('dyslexia-tts-controls');
        if (controls.style.display === 'none') {
            controls.style.display = 'block';
        } else {
            controls.style.display = 'none';
        }
    }

    // Load settings
    loadSettings() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get(['tts-settings'], (result) => {
                if (result['tts-settings']) {
                    this.settings = { ...this.settings, ...result['tts-settings'] };
                }
            });
        }
    }

    // Save settings
    saveSettings() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.set({ 'tts-settings': this.settings });
        }
    }
}

// Make classes globally available
window.ReadingProgressTracker = ReadingProgressTracker;
window.TextToSpeechController = TextToSpeechController;