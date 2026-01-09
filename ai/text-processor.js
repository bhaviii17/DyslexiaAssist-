// AI Text Processing Module - Google AI Studio Integration
class TextProcessor {
    constructor() {
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/';
        this.model = 'gemini-1.5-flash-latest'; // Using latest version identifier
        this.apiKey = null; // To be set by user in options
    }

    // Initialize API key from storage
    async initializeApiKey() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['google-ai-key'], (result) => {
                this.apiKey = result['google-ai-key'];
                resolve(this.apiKey);
            });
        });
    }

    // Generic API call to Google AI Studio with fallback models
    async callGoogleAI(prompt, options = {}) {
        if (!this.apiKey) {
            throw new Error('Google AI API key not configured');
        }

        // Try multiple models in order of preference
        const modelsToTry = [
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash',
            'gemini-1.5-pro-latest', 
            'gemini-1.5-pro',
            'gemini-pro'
        ];

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.3,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxOutputTokens || 2048,
            }
        };

        let lastError = null;

        for (const model of modelsToTry) {
            try {
                const response = await fetch(`${this.apiEndpoint}${model}:generateContent?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates && data.candidates.length > 0) {
                        // Update the working model for future use
                        this.model = model;
                        console.log(`DyslexiaAssist: Using working model: ${model}`);
                        return data;
                    }
                } else if (response.status === 404) {
                    // Model doesn't exist, try next one
                    continue;
                } else {
                    // Other error, don't try more models
                    const errorData = await response.json().catch(() => ({ error: response.statusText }));
                    throw new Error(`Google AI API call failed: ${errorData.error?.message || response.statusText}`);
                }
            } catch (error) {
                lastError = error;
                // Try next model
                continue;
            }
        }

        // If we get here, all models failed
        throw new Error(`All Google AI models failed. Last error: ${lastError?.message || 'Unknown error'}`);
    }

    // Text Simplification using Google AI
    async simplifyText(text, complexity = 'simple') {
        try {
            const prompt = `You are a reading assistant for people with dyslexia. Please simplify this text using:
- Simple, common words (avoid complex vocabulary)
- Short sentences (maximum 15 words each)
- Clear, direct language
- Active voice instead of passive
- Bullet points for lists when helpful

Original text: "${text}"

Simplified version:`;
            
            const result = await this.callGoogleAI(prompt, {
                temperature: 0.3,
                maxOutputTokens: Math.min(text.length * 2, 1000)
            });

            return result || text;
        } catch (error) {
            console.error('Text simplification failed:', error);
            return text; // Return original if simplification fails
        }
    }

    // Text Summarization using Google AI
    async summarizeText(text, maxLength = 100) {
        try {
            // Only summarize if text is long enough
            if (text.length < 200) {
                return text;
            }

            const prompt = `Create a clear, concise summary of this text for someone with dyslexia. Use simple language and keep it to approximately ${maxLength} words. Focus on the main points and key information.

Text to summarize: "${text}"

Summary:`;

            const result = await this.callGoogleAI(prompt, {
                temperature: 0.3,
                maxOutputTokens: maxLength * 2
            });

            return result || text;
        } catch (error) {
            console.error('Text summarization failed:', error);
            return text;
        }
    }

    // Translation using Google AI
    async translateText(text, targetLanguage = 'hi') {
        try {
            const languageMap = {
                'hi': 'Hindi',
                'ta': 'Tamil',
                'te': 'Telugu',
                'bn': 'Bengali',
                'gu': 'Gujarati',
                'mr': 'Marathi',
                'kn': 'Kannada',
                'ml': 'Malayalam',
                'en': 'English'
            };

            const targetLangName = languageMap[targetLanguage] || 'Hindi';
            
            const prompt = `Translate the following text to ${targetLangName}. Keep the translation natural and easy to understand:

"${text}"

Translation in ${targetLangName}:`;
            
            const result = await this.callGoogleAI(prompt, {
                temperature: 0.2,
                maxOutputTokens: text.length * 2
            });
            
            return result || text;
        } catch (error) {
            console.error('Translation failed:', error);
            return text;
        }
    }

    // Detect if text needs processing
    analyzeTextComplexity(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(' ').length, 0) / sentences.length;
        
        // Count complex words (more than 2 syllables)
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const complexWords = words.filter(word => this.estimateSyllables(word) > 2);
        const complexityRatio = complexWords.length / words.length;

        return {
            avgSentenceLength,
            complexityRatio,
            totalWords: words.length,
            needsSimplification: avgSentenceLength > 15 || complexityRatio > 0.3,
            needsSummarization: words.length > 200
        };
    }

    // Rough syllable estimation
    estimateSyllables(word) {
        const vowels = 'aeiouy';
        let syllables = 0;
        let prevWasVowel = false;

        for (let i = 0; i < word.length; i++) {
            const isVowel = vowels.includes(word[i]);
            if (isVowel && !prevWasVowel) {
                syllables++;
            }
            prevWasVowel = isVowel;
        }

        return Math.max(1, syllables);
    }

    // Process text based on user preferences
    async processText(text, preferences = {}) {
        const analysis = this.analyzeTextComplexity(text);
        let processedText = text;

        try {
            // Apply processing based on preferences and text analysis
            if (preferences.enableSimplification && analysis.needsSimplification) {
                processedText = await this.simplifyText(processedText);
            }

            if (preferences.enableSummarization && analysis.needsSummarization) {
                processedText = await this.summarizeText(processedText, preferences.summaryLength || 100);
            }

            if (preferences.enableTranslation && preferences.targetLanguage !== 'en') {
                processedText = await this.translateText(processedText, preferences.targetLanguage);
            }

            return {
                originalText: text,
                processedText: processedText,
                analysis: analysis,
                processingApplied: {
                    simplified: preferences.enableSimplification && analysis.needsSimplification,
                    summarized: preferences.enableSummarization && analysis.needsSummarization,
                    translated: preferences.enableTranslation && preferences.targetLanguage !== 'en'
                }
            };
        } catch (error) {
            console.error('Text processing failed:', error);
            return {
                originalText: text,
                processedText: text,
                analysis: analysis,
                error: error.message
            };
        }
    }

    // Explain concepts using Google AI
    async explainConcept(concept, context = '') {
        try {
            const prompt = `Explain "${concept}" in simple terms for someone with dyslexia. Use:
- Short, clear sentences
- Simple vocabulary
- Examples when helpful
- Avoid jargon or complex terms

${context ? `Context: ${context.substring(0, 200)}` : ''}

Explanation:`;
            
            const result = await this.callGoogleAI(prompt, {
                temperature: 0.4,
                maxOutputTokens: 300
            });

            return result || `I couldn't explain "${concept}" right now.`;
        } catch (error) {
            console.error('Concept explanation failed:', error);
            return `Sorry, I couldn't explain "${concept}" at the moment.`;
        }
    }
}

// Text-to-Speech functionality
class SpeechProcessor {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.isPlaying = false;
    }

    // Get available voices
    getVoices() {
        return this.synthesis.getVoices();
    }

    // Speak text with options
    speakText(text, options = {}) {
        if (this.isPlaying) {
            this.stopSpeaking();
        }

        this.currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Apply options
        this.currentUtterance.rate = options.rate || 0.8; // Slower for dyslexia
        this.currentUtterance.pitch = options.pitch || 1;
        this.currentUtterance.volume = options.volume || 1;
        
        // Set voice if specified
        if (options.voiceURI) {
            const voices = this.getVoices();
            const selectedVoice = voices.find(voice => voice.voiceURI === options.voiceURI);
            if (selectedVoice) {
                this.currentUtterance.voice = selectedVoice;
            }
        }

        // Event listeners
        this.currentUtterance.onstart = () => {
            this.isPlaying = true;
            this.onSpeechStart && this.onSpeechStart();
        };

        this.currentUtterance.onend = () => {
            this.isPlaying = false;
            this.onSpeechEnd && this.onSpeechEnd();
        };

        this.currentUtterance.onerror = (event) => {
            this.isPlaying = false;
            this.onSpeechError && this.onSpeechError(event);
        };

        this.synthesis.speak(this.currentUtterance);
    }

    // Stop speaking
    stopSpeaking() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
        this.isPlaying = false;
    }

    // Pause/Resume
    pauseSpeaking() {
        if (this.synthesis.speaking && !this.synthesis.paused) {
            this.synthesis.pause();
        }
    }

    resumeSpeaking() {
        if (this.synthesis.paused) {
            this.synthesis.resume();
        }
    }
}

// Speech-to-Text functionality (using Web Speech API)
class SpeechRecognition {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.initializeRecognition();
    }

    initializeRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        } else {
            console.warn('Speech recognition not supported');
            return;
        }

        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.onListeningStart && this.onListeningStart();
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            this.onResult && this.onResult(finalTranscript, interimTranscript);
        };

        this.recognition.onerror = (event) => {
            this.isListening = false;
            this.onError && this.onError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.onListeningEnd && this.onListeningEnd();
        };
    }

    startListening(language = 'en-US') {
        if (!this.recognition) {
            throw new Error('Speech recognition not supported');
        }

        this.recognition.lang = language;
        this.recognition.start();
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }
}

// Export classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TextProcessor, SpeechProcessor, SpeechRecognition };
}