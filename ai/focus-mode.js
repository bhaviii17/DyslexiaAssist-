// Focus Mode and Reading Enhancement Features
class FocusMode {
    constructor() {
        this.isActive = false;
        this.focusOverlay = null;
        this.focusWindow = null;
        this.currentMode = 'line'; // line, paragraph, sentence
        this.settings = {
            windowHeight: 80,
            opacity: 0.8,
            color: 'rgba(0, 0, 0, 0.8)',
            highlightColor: 'rgba(255, 255, 0, 0.3)',
            followMouse: true,
            autoScroll: false
        };
    }

    // Initialize focus mode
    init() {
        this.createFocusOverlay();
        this.setupEventListeners();
        this.loadSettings();
    }

    // Create focus overlay elements
    createFocusOverlay() {
        if (this.focusOverlay) return;

        // Create main overlay
        this.focusOverlay = document.createElement('div');
        this.focusOverlay.id = 'dyslexia-focus-overlay';
        this.focusOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: ${this.settings.color};
            pointer-events: none;
            z-index: 9999;
            display: none;
            transition: opacity 0.3s ease;
        `;

        // Create focus window (clear area)
        this.focusWindow = document.createElement('div');
        this.focusWindow.id = 'dyslexia-focus-window';
        this.focusWindow.style.cssText = `
            position: absolute;
            background: transparent;
            box-shadow: 0 0 0 2px rgba(0, 150, 255, 0.5);
            border-radius: 4px;
            transition: all 0.2s ease;
        `;

        this.focusOverlay.appendChild(this.focusWindow);
        document.body.appendChild(this.focusOverlay);

        // Add CSS for the focus effect
        const style = document.createElement('style');
        style.textContent = `
            #dyslexia-focus-overlay {
                mix-blend-mode: multiply;
            }
            
            .dyslexia-focus-highlight {
                background-color: ${this.settings.highlightColor} !important;
                border-radius: 3px !important;
                padding: 2px 4px !important;
                transition: background-color 0.2s ease !important;
            }
            
            .dyslexia-reading-ruler {
                position: fixed !important;
                width: 100% !important;
                height: 3px !important;
                background: rgba(255, 0, 0, 0.7) !important;
                z-index: 10000 !important;
                pointer-events: none !important;
                box-shadow: 0 0 5px rgba(255, 0, 0, 0.5) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Toggle focus mode on/off
    toggle(mode = this.currentMode) {
        if (this.isActive) {
            this.deactivate();
        } else {
            this.activate(mode);
        }
    }

    // Activate focus mode
    activate(mode = 'line') {
        this.currentMode = mode;
        this.isActive = true;
        this.focusOverlay.style.display = 'block';
        
        if (this.settings.followMouse) {
            document.addEventListener('mousemove', this.updateFocusPosition.bind(this));
        }
        
        document.addEventListener('scroll', this.updateFocusPosition.bind(this));
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        this.updateFocusWindow();
        this.trackUsage('focus-mode-activated');
    }

    // Deactivate focus mode
    deactivate() {
        this.isActive = false;
        this.focusOverlay.style.display = 'none';
        
        document.removeEventListener('mousemove', this.updateFocusPosition.bind(this));
        document.removeEventListener('scroll', this.updateFocusPosition.bind(this));
        document.removeEventListener('keydown', this.handleKeyboard.bind(this));
        
        this.clearHighlights();
        this.trackUsage('focus-mode-deactivated');
    }

    // Update focus window position and size
    updateFocusPosition(event) {
        if (!this.isActive) return;

        let targetY = 0;
        
        if (event.type === 'mousemove') {
            targetY = event.clientY;
        } else {
            // Use current scroll position
            targetY = window.innerHeight / 2;
        }

        this.updateFocusWindow(targetY);
    }

    // Update focus window based on mode
    updateFocusWindow(mouseY = window.innerHeight / 2) {
        if (!this.focusWindow) return;

        const windowHeight = this.settings.windowHeight;
        const windowTop = mouseY - (windowHeight / 2);
        
        // Create mask effect using clip-path
        const clipPath = `polygon(
            0% 0%, 
            100% 0%, 
            100% ${Math.max(0, windowTop)}px, 
            0% ${Math.max(0, windowTop)}px,
            0% ${Math.min(window.innerHeight, windowTop + windowHeight)}px,
            100% ${Math.min(window.innerHeight, windowTop + windowHeight)}px,
            100% 100%,
            0% 100%
        )`;
        
        this.focusOverlay.style.clipPath = `polygon(
            0% 0%, 
            100% 0%, 
            100% ${(windowTop / window.innerHeight) * 100}%, 
            0% ${(windowTop / window.innerHeight) * 100}%,
            0% ${((windowTop + windowHeight) / window.innerHeight) * 100}%,
            100% ${((windowTop + windowHeight) / window.innerHeight) * 100}%,
            100% 100%,
            0% 100%
        )`;

        // Highlight current reading area
        this.highlightCurrentArea(windowTop, windowHeight);
    }

    // Highlight the current reading area
    highlightCurrentArea(top, height) {
        this.clearHighlights();
        
        const elements = document.elementsFromPoint(window.innerWidth / 2, top + height / 2);
        const textElement = elements.find(el => 
            el.tagName && ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'SPAN', 'DIV'].includes(el.tagName)
        );

        if (textElement && textElement.textContent.trim()) {
            this.highlightElement(textElement);
        }
    }

    // Highlight specific element
    highlightElement(element) {
        if (this.currentMode === 'sentence') {
            this.highlightSentences(element);
        } else if (this.currentMode === 'paragraph') {
            element.classList.add('dyslexia-focus-highlight');
        } else {
            // Line mode - highlight the element
            element.classList.add('dyslexia-focus-highlight');
        }
    }

    // Highlight sentences within an element
    highlightSentences(element) {
        const text = element.textContent;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        
        if (sentences.length > 1) {
            // For now, just highlight the whole element
            // Could be enhanced to highlight individual sentences
            element.classList.add('dyslexia-focus-highlight');
        }
    }

    // Clear all highlights
    clearHighlights() {
        document.querySelectorAll('.dyslexia-focus-highlight').forEach(el => {
            el.classList.remove('dyslexia-focus-highlight');
        });
    }

    // Handle keyboard controls
    handleKeyboard(event) {
        if (!this.isActive) return;

        switch(event.key) {
            case 'Escape':
                this.deactivate();
                event.preventDefault();
                break;
            case 'ArrowUp':
                this.adjustFocus(-20);
                event.preventDefault();
                break;
            case 'ArrowDown':
                this.adjustFocus(20);
                event.preventDefault();
                break;
            case '1':
                this.currentMode = 'line';
                this.updateFocusWindow();
                break;
            case '2':
                this.currentMode = 'paragraph';
                this.updateFocusWindow();
                break;
            case '3':
                this.currentMode = 'sentence';
                this.updateFocusWindow();
                break;
        }
    }

    // Adjust focus position
    adjustFocus(delta) {
        const currentTop = parseInt(this.focusOverlay.style.clipPath?.match(/(\d+)%/)?.[1] || '50');
        const newTop = Math.max(0, Math.min(100, currentTop + (delta / window.innerHeight) * 100));
        this.updateFocusWindow(newTop * window.innerHeight / 100);
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for settings changes
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.onChanged.addListener((changes) => {
                if (changes['focus-mode-settings']) {
                    this.settings = { ...this.settings, ...changes['focus-mode-settings'].newValue };
                    this.updateStyles();
                }
            });
        }
    }

    // Load settings
    loadSettings() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get(['focus-mode-settings'], (result) => {
                if (result['focus-mode-settings']) {
                    this.settings = { ...this.settings, ...result['focus-mode-settings'] };
                    this.updateStyles();
                }
            });
        }
    }

    // Update styles based on settings
    updateStyles() {
        if (this.focusOverlay) {
            this.focusOverlay.style.background = this.settings.color;
        }
    }

    // Track usage for analytics
    trackUsage(action) {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'trackUsage',
                feature: 'focus-mode',
                data: { action, mode: this.currentMode }
            });
        }
    }
}

// Reading Ruler Feature
class ReadingRuler {
    constructor() {
        this.ruler = null;
        this.isActive = false;
        this.color = 'rgba(255, 0, 0, 0.7)';
        this.thickness = 3;
    }

    // Create and show reading ruler
    activate() {
        if (this.ruler) {
            this.deactivate();
            return;
        }

        this.ruler = document.createElement('div');
        this.ruler.className = 'dyslexia-reading-ruler';
        this.ruler.style.cssText = `
            position: fixed;
            top: 50%;
            left: 0;
            width: 100%;
            height: ${this.thickness}px;
            background: ${this.color};
            z-index: 10000;
            pointer-events: none;
            box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
            transform: translateY(-50%);
        `;

        document.body.appendChild(this.ruler);
        this.isActive = true;

        // Follow mouse
        document.addEventListener('mousemove', this.updatePosition.bind(this));
        
        // Keyboard controls
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    // Remove reading ruler
    deactivate() {
        if (this.ruler) {
            this.ruler.remove();
            this.ruler = null;
            this.isActive = false;
            
            document.removeEventListener('mousemove', this.updatePosition.bind(this));
            document.removeEventListener('keydown', this.handleKeyboard.bind(this));
        }
    }

    // Update ruler position
    updatePosition(event) {
        if (this.ruler) {
            this.ruler.style.top = event.clientY + 'px';
        }
    }

    // Handle keyboard controls
    handleKeyboard(event) {
        if (!this.isActive) return;

        if (event.key === 'Escape') {
            this.deactivate();
            event.preventDefault();
        }
    }
}

// Word Highlighter for syllable and phoneme awareness
class WordHighlighter {
    constructor() {
        this.activeHighlights = new Set();
        this.highlightStyle = null;
        this.syllableColors = ['#ffeb3b', '#4caf50', '#2196f3', '#ff9800', '#9c27b0'];
    }

    // Initialize word highlighter
    init() {
        this.createHighlightStyles();
        this.setupEventListeners();
    }

    // Create CSS for highlighting
    createHighlightStyles() {
        if (this.highlightStyle) return;

        this.highlightStyle = document.createElement('style');
        this.highlightStyle.textContent = `
            .dyslexia-word-highlight {
                background-color: rgba(255, 235, 59, 0.4) !important;
                border-radius: 3px !important;
                padding: 1px 2px !important;
                cursor: pointer !important;
                transition: background-color 0.2s ease !important;
            }
            
            .dyslexia-word-highlight:hover {
                background-color: rgba(255, 235, 59, 0.6) !important;
            }
            
            .dyslexia-syllable-0 { background-color: rgba(255, 235, 59, 0.4) !important; }
            .dyslexia-syllable-1 { background-color: rgba(76, 175, 80, 0.4) !important; }
            .dyslexia-syllable-2 { background-color: rgba(33, 150, 243, 0.4) !important; }
            .dyslexia-syllable-3 { background-color: rgba(255, 152, 0, 0.4) !important; }
            .dyslexia-syllable-4 { background-color: rgba(156, 39, 176, 0.4) !important; }
            
            .dyslexia-word-popup {
                position: absolute;
                background: white;
                border: 1px solid #ccc;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10001;
                max-width: 300px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .dyslexia-word-popup h4 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 16px;
            }
            
            .dyslexia-syllables {
                margin: 10px 0;
                font-size: 18px;
                font-weight: bold;
                letter-spacing: 2px;
            }
            
            .dyslexia-definition {
                margin: 10px 0;
                color: #666;
                font-style: italic;
            }
        `;
        document.head.appendChild(this.highlightStyle);
    }

    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        document.addEventListener('click', this.handleClick.bind(this));
    }

    // Handle double-click on words
    handleDoubleClick(event) {
        const target = event.target;
        const word = this.getWordAtPosition(target, event);
        
        if (word && word.length > 2) {
            this.highlightWord(target, word, event);
            event.preventDefault();
        }
    }

    // Handle clicks to close popups
    handleClick(event) {
        if (!event.target.closest('.dyslexia-word-popup')) {
            this.closeAllPopups();
        }
    }

    // Get word at click position
    getWordAtPosition(element, event) {
        const text = element.textContent;
        if (!text) return null;

        // Simple word extraction - could be enhanced
        const words = text.split(/\s+/);
        return words.find(word => word.length > 2) || null;
    }

    // Highlight and analyze word
    async highlightWord(element, word, event) {
        // Clean word of punctuation
        const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
        
        // Create popup with word analysis
        await this.showWordPopup(cleanWord, event.clientX, event.clientY);
        
        // Highlight syllables if possible
        this.highlightSyllables(element, word);
    }

    // Show word analysis popup
    async showWordPopup(word, x, y) {
        this.closeAllPopups();
        
        const popup = document.createElement('div');
        popup.className = 'dyslexia-word-popup';
        
        // Analyze word
        const syllables = this.breakIntoSyllables(word);
        const difficulty = this.assessWordDifficulty(word);
        
        popup.innerHTML = `
            <h4>${word}</h4>
            <div class="dyslexia-syllables">
                ${syllables.map((syl, i) => 
                    `<span class="dyslexia-syllable-${i % 5}">${syl}</span>`
                ).join(' • ')}
            </div>
            <div><strong>Syllables:</strong> ${syllables.length}</div>
            <div><strong>Difficulty:</strong> ${difficulty}</div>
            <div><strong>Length:</strong> ${word.length} letters</div>
        `;
        
        // Position popup
        popup.style.left = Math.min(x, window.innerWidth - 320) + 'px';
        popup.style.top = Math.min(y, window.innerHeight - 200) + 'px';
        
        document.body.appendChild(popup);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 5000);
    }

    // Break word into syllables (simplified)
    breakIntoSyllables(word) {
        // Basic syllable breaking rules
        word = word.toLowerCase();
        
        // Handle common patterns
        let syllables = [];
        let currentSyllable = '';
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const nextChar = word[i + 1];
            
            currentSyllable += char;
            
            // Vowel followed by consonant - potential syllable break
            if (this.isVowel(char) && nextChar && !this.isVowel(nextChar)) {
                if (i < word.length - 2) {
                    syllables.push(currentSyllable);
                    currentSyllable = '';
                }
            }
        }
        
        if (currentSyllable) {
            syllables.push(currentSyllable);
        }
        
        return syllables.length > 0 ? syllables : [word];
    }

    // Check if character is vowel
    isVowel(char) {
        return 'aeiouAEIOU'.includes(char);
    }

    // Assess word difficulty
    assessWordDifficulty(word) {
        const length = word.length;
        const syllables = this.breakIntoSyllables(word).length;
        
        if (length <= 4 && syllables <= 1) return 'Easy';
        if (length <= 6 && syllables <= 2) return 'Medium';
        if (length <= 8 && syllables <= 3) return 'Hard';
        return 'Very Hard';
    }

    // Highlight syllables in text
    highlightSyllables(element, word) {
        // This would require more complex text manipulation
        // For now, just add a highlight class
        if (!element.classList.contains('dyslexia-word-highlight')) {
            element.classList.add('dyslexia-word-highlight');
            this.activeHighlights.add(element);
        }
    }

    // Close all popups
    closeAllPopups() {
        document.querySelectorAll('.dyslexia-word-popup').forEach(popup => {
            popup.remove();
        });
    }

    // Clear all highlights
    clearHighlights() {
        this.activeHighlights.forEach(element => {
            element.classList.remove('dyslexia-word-highlight');
        });
        this.activeHighlights.clear();
        this.closeAllPopups();
    }
}

// Make classes globally available
window.FocusMode = FocusMode;
window.ReadingRuler = ReadingRuler;
window.WordHighlighter = WordHighlighter;