// Advanced AI Features for DyslexiaAssist - Google AI Studio Integration
class AdvancedAIProcessor {
    constructor() {
        this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/';
        this.model = 'gemini-pro';
        this.apiKey = null;
        this.userProfile = new UserLearningProfile();
        this.contextualMemory = new Map();
    }

    // Initialize with API key
    async initialize() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['google-ai-key'], (result) => {
                this.apiKey = result['google-ai-key'];
                resolve(this.apiKey);
            });
        });
    }

    // Enhanced API call with retry logic for Google AI
    async callGoogleAI(prompt, options = {}, retries = 3) {
        if (!this.apiKey) {
            throw new Error('Google AI API key not configured. Please set it in extension options.');
        }

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
                maxOutputTokens: options.maxOutputTokens || 1024,
            }
        };

        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetch(`${this.apiEndpoint}${this.model}:generateContent?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    if (response.status === 503 && attempt < retries - 1) {
                        // Service unavailable, wait and retry
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        continue;
                    }
                    const errorData = await response.json().catch(() => ({ error: response.statusText }));
                    throw new Error(`Google AI API call failed: ${errorData.error?.message || response.statusText}`);
                }

                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            } catch (error) {
                if (attempt === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // Real-time Reading Assistant with AI
    async createReadingAssistant(text, userPreferences = {}) {
        const assistant = {
            originalText: text,
            analysis: null,
            suggestions: [],
            difficulty: null,
            keywords: [],
            emotions: null,
            personalizedContent: null
        };

        try {
            // Parallel processing for speed
            const [
                difficultyAnalysis,
                keywordExtraction,
                sentimentAnalysis,
                personalizedSuggestions
            ] = await Promise.all([
                this.assessReadingDifficulty(text),
                this.extractKeywords(text),
                this.analyzeSentiment(text),
                this.getPersonalizedSuggestions(text, userPreferences)
            ]);

            assistant.analysis = difficultyAnalysis;
            assistant.keywords = keywordExtraction;
            assistant.emotions = sentimentAnalysis;
            assistant.suggestions = personalizedSuggestions;
            assistant.difficulty = difficultyAnalysis.gradeLevel;

            // Store context for learning
            this.updateContextualMemory(text, assistant);

            return assistant;
        } catch (error) {
            console.error('Reading assistant creation failed:', error);
            return { ...assistant, error: error.message };
        }
    }

    // AI-powered reading difficulty assessment
    async assessReadingDifficulty(text) {
        const basicMetrics = this.calculateBasicReadability(text);
        
        try {
            // Use Google AI for advanced analysis
            const prompt = `Analyze the reading difficulty of this text for someone with dyslexia. 

Text: "${text.substring(0, 500)}"

Please provide:
1. A difficulty score from 1-10 (1=very easy, 10=very hard)
2. Specific reasons why it's difficult or easy
3. Grade level estimate
4. Recommendations for improvement

Format your response as:
Score: [1-10]
Grade Level: [number]
Reasons: [bullet points]
Recommendations: [bullet points]`;
            
            const result = await this.callGoogleAI(prompt, {
                temperature: 0.3,
                maxOutputTokens: 500
            });

            const aiScore = this.extractDifficultyScore(result);
            const recommendations = this.extractRecommendations(result);

            return {
                basicMetrics,
                aiScore,
                aiAnalysis: result,
                gradeLevel: Math.round((basicMetrics.fleschKincaid + aiScore) / 2),
                recommendations: recommendations
            };
        } catch (error) {
            return {
                basicMetrics,
                gradeLevel: basicMetrics.fleschKincaid,
                error: 'AI analysis unavailable'
            };
        }
    }

    // Extract keywords using Google AI
    async extractKeywords(text) {
        try {
            const prompt = `Extract the 10 most important keywords and concepts from this text. For each keyword, rate its importance from 0.1 to 1.0.

Text: "${text.substring(0, 1000)}"

Format your response as:
Keyword1: 0.9
Keyword2: 0.8
[etc.]`;

            const result = await this.callGoogleAI(prompt, {
                temperature: 0.2,
                maxOutputTokens: 300
            });

            return this.parseKeywords(result);
        } catch (error) {
            // Fallback to simple keyword extraction
            return this.extractKeywordsSimple(text);
        }
    }

    // Analyze sentiment using Google AI
    async analyzeSentiment(text) {
        try {
            const prompt = `Analyze the emotional tone and sentiment of this text for accessibility purposes:

Text: "${text.substring(0, 500)}"

Please provide:
1. Overall sentiment (POSITIVE, NEGATIVE, or NEUTRAL)
2. Confidence level (0.0 to 1.0)
3. Emotional tone description
4. Reading recommendations for someone with dyslexia

Format as:
Sentiment: [POSITIVE/NEGATIVE/NEUTRAL]
Confidence: [0.0-1.0]
Tone: [description]
Recommendations: [tips]`;

            const result = await this.callGoogleAI(prompt, {
                temperature: 0.3,
                maxOutputTokens: 400
            });

            return this.parseSentimentAnalysis(result);
        } catch (error) {
            return { error: 'Sentiment analysis unavailable' };
        }
    }

    // Smart Q&A system using Google AI
    async answerQuestion(question, context) {
        try {
            const prompt = `You are a helpful reading assistant for someone with dyslexia. Answer this question based on the provided context. Use simple, clear language.

Context: "${context.substring(0, 2000)}"

Question: "${question}"

Please provide a clear, simple answer:`;

            const result = await this.callGoogleAI(prompt, {
                temperature: 0.4,
                maxOutputTokens: 300
            });

            return {
                answer: result,
                confidence: 0.8, // Default confidence for Google AI
                contextUsed: context.substring(0, 100) + '...'
            };
        } catch (error) {
            return { 
                error: 'Question answering unavailable', 
                fallback: this.generateFallbackAnswer(question, context) 
            };
        }
    }

    // Voice command processing with Google AI
    async processVoiceCommand(command, context = '') {
        const normalizedCommand = command.toLowerCase().trim();
        
        // Pattern matching for common commands first
        const commandPatterns = {
            read: /^(read|speak|say)\s*(.*)/i,
            simplify: /^(simplify|make\s+easier|easy\s+version)\s*(.*)/i,
            summarize: /^(summarize|summary|sum\s+up)\s*(.*)/i,
            translate: /^(translate|convert)\s+to\s+(\w+)\s*(.*)/i,
            explain: /^(explain|what\s+is|define)\s+(.*)/i,
            question: /^(what|how|why|when|where|who)\s+(.*)/i,
            navigate: /^(go\s+to|find|search\s+for)\s+(.*)/i
        };

        for (const [action, pattern] of Object.entries(commandPatterns)) {
            const match = normalizedCommand.match(pattern);
            if (match) {
                return await this.executeVoiceAction(action, match, context);
            }
        }

        // Use Google AI for complex command interpretation
        try {
            const prompt = `Interpret this voice command for a dyslexia assistance tool. 

Command: "${command}"

Available actions: read, simplify, summarize, translate, explain, question

Respond with the action and any parameters needed. Keep response concise.`;

            const result = await this.callGoogleAI(prompt, {
                temperature: 0.1,
                maxOutputTokens: 100
            });

            return this.parseAICommandResponse(result, context);
        } catch (error) {
            return { 
                error: 'Command not recognized', 
                suggestion: 'Try: "read this", "simplify text", "summarize page"' 
            };
        }
    }

    // Explain concepts using Google AI
    async explainConcept(concept, context) {
        try {
            const prompt = `Explain "${concept}" in simple terms for someone with dyslexia. Use:
- Short, clear sentences
- Simple vocabulary
- Examples when helpful
- Avoid jargon

${context ? `Context: ${context.substring(0, 200)}` : ''}

Simple explanation:`;
            
            const result = await this.callGoogleAI(prompt, {
                temperature: 0.4,
                maxOutputTokens: 300
            });

            return result || `I couldn't explain "${concept}" right now.`;
        } catch (error) {
            return `Sorry, I couldn't explain "${concept}" at the moment.`;
        }
    }

    // Calculate basic readability metrics
    calculateBasicReadability(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const syllables = words.reduce((acc, word) => acc + this.countSyllables(word), 0);

        const avgWordsPerSentence = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;

        // Flesch-Kincaid Grade Level
        const fleschKincaid = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;

        // Additional dyslexia-specific metrics
        const longWords = words.filter(word => word.length > 6).length;
        const complexWords = words.filter(word => this.countSyllables(word) > 2).length;

        return {
            fleschKincaid: Math.max(1, Math.round(fleschKincaid)),
            avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
            avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10,
            longWordPercentage: Math.round((longWords / words.length) * 100),
            complexWordPercentage: Math.round((complexWords / words.length) * 100),
            totalWords: words.length,
            totalSentences: sentences.length
        };
    }

    // Count syllables in a word
    countSyllables(word) {
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

        // Handle silent 'e'
        if (word.endsWith('e') && syllables > 1) {
            syllables--;
        }

        return Math.max(1, syllables);
    }

    // Extract keywords using AI
    async extractKeywords(text) {
        try {
            const result = await this.callHuggingFaceAPI(
                this.models.keywordExtraction,
                text.substring(0, 1000) // Limit for API
            );

            return result.slice(0, 10).map(item => ({
                keyword: item.word || item.label,
                confidence: item.score || 0.5,
                importance: this.calculateKeywordImportance(item.word || item.label, text)
            }));
        } catch (error) {
            // Fallback to simple keyword extraction
            return this.extractKeywordsSimple(text);
        }
    }

    // Simple keyword extraction fallback
    extractKeywordsSimple(text) {
        const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
        const frequency = {};
        
        words.forEach(word => {
            if (!this.isStopWord(word)) {
                frequency[word] = (frequency[word] || 0) + 1;
            }
        });

        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, count]) => ({
                keyword: word,
                confidence: Math.min(count / words.length * 10, 1),
                importance: count
            }));
    }

    // Analyze sentiment for emotional context
    async analyzeSentiment(text) {
        try {
            const result = await this.callHuggingFaceAPI(
                this.models.sentiment,
                text.substring(0, 500)
            );

            const sentiment = result[0];
            return {
                label: sentiment.label,
                confidence: sentiment.score,
                emotionalTone: this.interpretSentiment(sentiment.label, sentiment.score),
                recommendations: this.getSentimentBasedRecommendations(sentiment.label)
            };
        } catch (error) {
            return { error: 'Sentiment analysis unavailable' };
        }
    }

    // Get personalized suggestions based on user learning profile
    async getPersonalizedSuggestions(text, userPreferences) {
        const profile = await this.userProfile.getProfile();
        const suggestions = [];

        // Reading speed adjustment
        if (profile.avgReadingSpeed < 150) {
            suggestions.push({
                type: 'speed',
                message: 'Consider using text-to-speech to help with reading pace',
                action: 'enable_tts'
            });
        }

        // Difficulty-based suggestions
        const difficulty = await this.assessReadingDifficulty(text);
        if (difficulty.gradeLevel > profile.preferredDifficulty + 2) {
            suggestions.push({
                type: 'difficulty',
                message: 'This text might be challenging. Would you like a simplified version?',
                action: 'simplify_text'
            });
        }

        // Length-based suggestions
        if (text.length > 1000 && profile.prefersShortContent) {
            suggestions.push({
                type: 'length',
                message: 'This is a long text. Would you like a summary?',
                action: 'summarize_text'
            });
        }

        // Visual aids suggestions
        if (profile.visualAidsPreference.includes('highlighting')) {
            suggestions.push({
                type: 'visual',
                message: 'Key terms have been highlighted for easier reading',
                action: 'highlight_keywords'
            });
        }

        return suggestions;
    }

    // Smart Q&A system
    async answerQuestion(question, context) {
        try {
            const input = {
                question: question,
                context: context.substring(0, 2000) // Limit context size
            };

            const result = await this.callHuggingFaceAPI(
                this.models.questionAnswering,
                input
            );

            return {
                answer: result.answer,
                confidence: result.score,
                startIndex: result.start,
                endIndex: result.end,
                contextUsed: context.substring(result.start, result.end)
            };
        } catch (error) {
            return { error: 'Question answering unavailable', fallback: this.generateFallbackAnswer(question, context) };
        }
    }

    // Voice command processing with AI
    async processVoiceCommand(command, context = '') {
        const normalizedCommand = command.toLowerCase().trim();
        
        // Pattern matching for common commands
        const commandPatterns = {
            read: /^(read|speak|say)\s*(.*)/i,
            simplify: /^(simplify|make\s+easier|easy\s+version)\s*(.*)/i,
            summarize: /^(summarize|summary|sum\s+up)\s*(.*)/i,
            translate: /^(translate|convert)\s+to\s+(\w+)\s*(.*)/i,
            explain: /^(explain|what\s+is|define)\s+(.*)/i,
            question: /^(what|how|why|when|where|who)\s+(.*)/i,
            navigate: /^(go\s+to|find|search\s+for)\s+(.*)/i
        };

        for (const [action, pattern] of Object.entries(commandPatterns)) {
            const match = normalizedCommand.match(pattern);
            if (match) {
                return await this.executeVoiceAction(action, match, context);
            }
        }

        // Use AI for complex command interpretation
        try {
            const prompt = `Interpret this voice command for a dyslexia assistance tool: "${command}". Respond with action and parameters in JSON format.`;
            const result = await this.callHuggingFaceAPI(
                this.models.textGeneration,
                prompt,
                { max_length: 100, temperature: 0.1 }
            );

            return this.parseAICommandResponse(result[0]?.generated_text, context);
        } catch (error) {
            return { error: 'Command not recognized', suggestion: 'Try: "read this", "simplify text", "summarize page"' };
        }
    }

    // Execute voice action
    async executeVoiceAction(action, match, context) {
        const target = match[2] || context;

        switch (action) {
            case 'read':
                return { action: 'speak', text: target || context, success: true };
            
            case 'simplify':
                const simplified = await this.simplifyText(target || context);
                return { action: 'display', text: simplified, type: 'simplified', success: true };
            
            case 'summarize':
                const summary = await this.summarizeText(target || context);
                return { action: 'display', text: summary, type: 'summary', success: true };
            
            case 'translate':
                const language = match[2];
                const translated = await this.translateText(target, language);
                return { action: 'display', text: translated, type: 'translated', success: true };
            
            case 'explain':
                const explanation = await this.explainConcept(match[2], context);
                return { action: 'display', text: explanation, type: 'explanation', success: true };
            
            case 'question':
                const answer = await this.answerQuestion(command, context);
                return { action: 'display', text: answer.answer, type: 'answer', success: true };
            
            default:
                return { error: 'Action not supported' };
        }
    }

    // Explain concepts using AI
    async explainConcept(concept, context) {
        try {
            const prompt = `Explain "${concept}" in simple terms for someone with dyslexia. Use short sentences and common words. Context: ${context.substring(0, 200)}`;
            
            const result = await this.callHuggingFaceAPI(
                this.models.textGeneration,
                prompt,
                { max_length: 200, temperature: 0.3 }
            );

            return result[0]?.generated_text || `I couldn't explain "${concept}" right now.`;
        } catch (error) {
            return `Sorry, I couldn't explain "${concept}" at the moment.`;
        }
    }

    // Update contextual memory for learning
    updateContextualMemory(text, analysis) {
        const key = this.generateContextKey(text);
        this.contextualMemory.set(key, {
            timestamp: Date.now(),
            analysis,
            userInteractions: []
        });

        // Limit memory size
        if (this.contextualMemory.size > 100) {
            const oldestKey = Array.from(this.contextualMemory.keys())[0];
            this.contextualMemory.delete(oldestKey);
        }
    }

    // Generate context key for memory
    generateContextKey(text) {
        // Simple hash function
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Helper methods for parsing Google AI responses
    extractDifficultyScore(aiAnalysis) {
        const scoreMatch = aiAnalysis.match(/Score:\s*(\d+(?:\.\d+)?)/i) || 
                          aiAnalysis.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*10)?/);
        return scoreMatch ? parseFloat(scoreMatch[1]) : 5;
    }

    extractRecommendations(aiAnalysis) {
        const recommendations = [];
        const lines = aiAnalysis.split('\n');
        let inRecommendations = false;
        
        for (const line of lines) {
            if (line.toLowerCase().includes('recommendation')) {
                inRecommendations = true;
                continue;
            }
            if (inRecommendations && (line.includes('-') || line.includes('•'))) {
                recommendations.push(line.replace(/[-•]\s*/, '').trim());
            }
        }
        
        return recommendations.length > 0 ? recommendations : [
            'Consider using text simplification',
            'Break content into smaller sections',
            'Use text-to-speech for better comprehension'
        ];
    }

    parseKeywords(result) {
        const keywords = [];
        const lines = result.split('\n');
        
        for (const line of lines) {
            const match = line.match(/(.+?):\s*([0-9.]+)/);
            if (match) {
                keywords.push({
                    keyword: match[1].trim(),
                    confidence: parseFloat(match[2]),
                    importance: parseFloat(match[2])
                });
            }
        }
        
        return keywords.length > 0 ? keywords.slice(0, 10) : this.extractKeywordsSimple(result);
    }

    parseSentimentAnalysis(result) {
        const lines = result.split('\n');
        let sentiment = { label: 'NEUTRAL', confidence: 0.5 };
        
        for (const line of lines) {
            if (line.toLowerCase().includes('sentiment:')) {
                const match = line.match(/(POSITIVE|NEGATIVE|NEUTRAL)/i);
                if (match) sentiment.label = match[1].toUpperCase();
            }
            if (line.toLowerCase().includes('confidence:')) {
                const match = line.match(/([0-9.]+)/);
                if (match) sentiment.confidence = parseFloat(match[1]);
            }
        }
        
        return {
            label: sentiment.label,
            confidence: sentiment.confidence,
            emotionalTone: this.interpretSentiment(sentiment.label, sentiment.confidence),
            recommendations: this.getSentimentBasedRecommendations(sentiment.label)
        };
    }

    generateReadabilityRecommendations(basic, aiScore) {
        const recommendations = [];
        
        if (basic.avgWordsPerSentence > 20) {
            recommendations.push('Break long sentences into shorter ones');
        }
        
        if (basic.complexWordPercentage > 30) {
            recommendations.push('Replace complex words with simpler alternatives');
        }
        
        if (aiScore > 7) {
            recommendations.push('Consider using text simplification feature');
        }

        return recommendations;
    }

    interpretSentiment(label, confidence) {
        const tones = {
            'POSITIVE': 'uplifting and encouraging',
            'NEGATIVE': 'serious or challenging',
            'NEUTRAL': 'informational and balanced'
        };
        return tones[label] || 'mixed emotional tone';
    }

    getSentimentBasedRecommendations(sentiment) {
        const recommendations = {
            'NEGATIVE': ['Take breaks while reading', 'Consider positive content afterwards'],
            'POSITIVE': ['Great choice for motivation!', 'Perfect for learning'],
            'NEUTRAL': ['Good for focused learning', 'Clear and balanced content']
        };
        return recommendations[sentiment] || [];
    }

    calculateKeywordImportance(keyword, text) {
        const occurrences = (text.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
        return Math.min(occurrences / 10, 1);
    }

    isStopWord(word) {
        const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their'];
        return stopWords.includes(word);
    }

    generateFallbackAnswer(question, context) {
        // Simple keyword matching for fallback
        const questionWords = question.toLowerCase().split(/\s+/);
        const contextSentences = context.split(/[.!?]+/);
        
        for (const sentence of contextSentences) {
            const sentenceLower = sentence.toLowerCase();
            if (questionWords.some(word => sentenceLower.includes(word))) {
                return sentence.trim();
            }
        }
        
        return "I couldn't find a specific answer in the current text.";
    }

    parseAICommandResponse(response, context) {
        try {
            const jsonMatch = response.match(/\{[^}]+\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            // Fallback parsing
        }
        
        return { error: 'Could not interpret command', suggestion: 'Please try a simpler command' };
    }
}

// User Learning Profile for AI personalization
class UserLearningProfile {
    constructor() {
        this.profile = {
            avgReadingSpeed: 200, // words per minute
            preferredDifficulty: 6, // grade level
            prefersShortContent: false,
            visualAidsPreference: ['highlighting', 'spacing'],
            languagePreference: 'en',
            learningPatterns: {},
            improvementMetrics: {
                readingSpeed: [],
                comprehension: [],
                confidence: []
            }
        };
    }

    async getProfile() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['user_learning_profile'], (result) => {
                if (result.user_learning_profile) {
                    this.profile = { ...this.profile, ...result.user_learning_profile };
                }
                resolve(this.profile);
            });
        });
    }

    async updateProfile(updates) {
        this.profile = { ...this.profile, ...updates };
        return new Promise((resolve) => {
            chrome.storage.sync.set({ user_learning_profile: this.profile }, resolve);
        });
    }

    recordReadingSession(duration, wordCount, difficulty, comprehensionScore) {
        const speed = Math.round((wordCount / duration) * 60); // WPM
        
        this.profile.improvementMetrics.readingSpeed.push({
            date: new Date().toISOString(),
            speed: speed,
            difficulty: difficulty
        });

        if (comprehensionScore !== null) {
            this.profile.improvementMetrics.comprehension.push({
                date: new Date().toISOString(),
                score: comprehensionScore,
                difficulty: difficulty
            });
        }

        // Update average reading speed
        const recentSpeeds = this.profile.improvementMetrics.readingSpeed.slice(-10);
        this.profile.avgReadingSpeed = Math.round(
            recentSpeeds.reduce((acc, session) => acc + session.speed, 0) / recentSpeeds.length
        );

        this.updateProfile(this.profile);
    }

    getPersonalizedRecommendations() {
        const recommendations = [];
        
        // Reading speed recommendations
        if (this.profile.avgReadingSpeed < 150) {
            recommendations.push({
                type: 'speed',
                message: 'Try using text-to-speech to improve reading pace',
                priority: 'high'
            });
        }

        // Difficulty recommendations
        const recentComprehension = this.profile.improvementMetrics.comprehension.slice(-5);
        if (recentComprehension.length > 0) {
            const avgComprehension = recentComprehension.reduce((acc, s) => acc + s.score, 0) / recentComprehension.length;
            
            if (avgComprehension > 0.8 && this.profile.preferredDifficulty < 10) {
                recommendations.push({
                    type: 'difficulty',
                    message: 'You\'re doing great! Ready for slightly more challenging content?',
                    priority: 'medium'
                });
            } else if (avgComprehension < 0.6) {
                recommendations.push({
                    type: 'difficulty',
                    message: 'Consider using text simplification more often',
                    priority: 'high'
                });
            }
        }

        return recommendations;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedAIProcessor, UserLearningProfile };
}