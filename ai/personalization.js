// Personalization Engine - Learns user preferences and adapts AI processing
class PersonalizationEngine {
    constructor() {
        this.userProfile = {
            readingSpeed: 'medium', // slow, medium, fast
            preferredComplexity: 'simple', // simple, medium, complex
            frequentLanguages: ['en'],
            commonWords: new Map(), // Words user struggles with
            readingPatterns: {
                timeSpentReading: 0,
                textsProcessed: 0,
                preferredFeatures: new Set(),
                strugglingAreas: new Set()
            },
            adaptiveSettings: {
                autoSimplify: false,
                autoSummarize: false,
                autoTranslate: false,
                learningMode: true
            }
        };
        this.loadUserProfile();
    }

    // Load user profile from storage
    async loadUserProfile() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['user_profile'], (result) => {
                if (result.user_profile) {
                    this.userProfile = { ...this.userProfile, ...result.user_profile };
                    // Convert Map objects from storage
                    if (result.user_profile.commonWords) {
                        this.userProfile.commonWords = new Map(Object.entries(result.user_profile.commonWords));
                    }
                    if (result.user_profile.readingPatterns?.preferredFeatures) {
                        this.userProfile.readingPatterns.preferredFeatures = new Set(result.user_profile.readingPatterns.preferredFeatures);
                    }
                    if (result.user_profile.readingPatterns?.strugglingAreas) {
                        this.userProfile.readingPatterns.strugglingAreas = new Set(result.user_profile.readingPatterns.strugglingAreas);
                    }
                }
                resolve(this.userProfile);
            });
        });
    }

    // Save user profile to storage
    async saveUserProfile() {
        const profileToSave = {
            ...this.userProfile,
            commonWords: Object.fromEntries(this.userProfile.commonWords),
            readingPatterns: {
                ...this.userProfile.readingPatterns,
                preferredFeatures: Array.from(this.userProfile.readingPatterns.preferredFeatures),
                strugglingAreas: Array.from(this.userProfile.readingPatterns.strugglingAreas)
            }
        };

        return new Promise((resolve) => {
            chrome.storage.sync.set({ user_profile: profileToSave }, resolve);
        });
    }

    // Track user interaction with features
    trackFeatureUsage(feature, duration = 0, success = true) {
        if (success) {
            this.userProfile.readingPatterns.preferredFeatures.add(feature);
        } else {
            this.userProfile.readingPatterns.strugglingAreas.add(feature);
        }

        this.userProfile.readingPatterns.timeSpentReading += duration;
        this.userProfile.readingPatterns.textsProcessed += 1;

        this.saveUserProfile();
    }

    // Track words user struggles with
    trackDifficultWord(word, context = '') {
        const count = this.userProfile.commonWords.get(word) || 0;
        this.userProfile.commonWords.set(word, count + 1);
        
        // If a word is frequently difficult, add it to struggling areas
        if (count > 3) {
            this.userProfile.readingPatterns.strugglingAreas.add('complex-vocabulary');
        }

        this.saveUserProfile();
    }

    // Analyze reading patterns and suggest optimal settings
    getPersonalizedSettings() {
        const patterns = this.userProfile.readingPatterns;
        const suggestions = {
            enableSimplification: false,
            enableSummarization: false,
            enableTranslation: false,
            recommendedFontSize: 16,
            recommendedLineSpacing: 1.5,
            recommendedSpeechRate: 0.8,
            priorityFeatures: []
        };

        // Analyze struggling areas
        if (patterns.strugglingAreas.has('complex-vocabulary') || 
            patterns.strugglingAreas.has('long-sentences')) {
            suggestions.enableSimplification = true;
            suggestions.priorityFeatures.push('text-simplification');
        }

        if (patterns.strugglingAreas.has('long-content') || 
            patterns.timeSpentReading / patterns.textsProcessed > 300) { // More than 5 minutes per text
            suggestions.enableSummarization = true;
            suggestions.priorityFeatures.push('summarization');
        }

        // Analyze preferred features
        if (patterns.preferredFeatures.has('speech-synthesis')) {
            suggestions.priorityFeatures.push('text-to-speech');
            // Adjust speech rate based on reading speed
            switch (this.userProfile.readingSpeed) {
                case 'slow':
                    suggestions.recommendedSpeechRate = 0.6;
                    break;
                case 'fast':
                    suggestions.recommendedSpeechRate = 1.0;
                    break;
                default:
                    suggestions.recommendedSpeechRate = 0.8;
            }
        }

        if (patterns.preferredFeatures.has('font-changes')) {
            suggestions.priorityFeatures.push('font-customization');
            // Larger fonts for users who struggle with reading
            if (patterns.strugglingAreas.has('small-text')) {
                suggestions.recommendedFontSize = 18;
                suggestions.recommendedLineSpacing = 1.8;
            }
        }

        return suggestions;
    }

    // Adaptive learning - adjust settings based on usage
    adaptSettings() {
        const suggestions = this.getPersonalizedSettings();
        
        if (this.userProfile.adaptiveSettings.learningMode) {
            // Auto-enable features that user seems to benefit from
            if (suggestions.enableSimplification && !this.userProfile.adaptiveSettings.autoSimplify) {
                this.userProfile.adaptiveSettings.autoSimplify = true;
            }
            
            if (suggestions.enableSummarization && !this.userProfile.adaptiveSettings.autoSummarize) {
                this.userProfile.adaptiveSettings.autoSummarize = true;
            }

            this.saveUserProfile();
        }

        return suggestions;
    }

    // Get reading difficulty level for content
    assessContentDifficulty(text) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Check against user's known difficult words
        let difficultWordCount = 0;
        words.forEach(word => {
            if (this.userProfile.commonWords.has(word)) {
                difficultWordCount++;
            }
        });

        const avgSentenceLength = words.length / sentences.length;
        const difficultWordRatio = difficultWordCount / words.length;

        let difficulty = 'easy';
        if (avgSentenceLength > 20 || difficultWordRatio > 0.1) {
            difficulty = 'hard';
        } else if (avgSentenceLength > 15 || difficultWordRatio > 0.05) {
            difficulty = 'medium';
        }

        return {
            difficulty,
            avgSentenceLength,
            difficultWordRatio,
            totalWords: words.length,
            estimatedReadingTime: Math.ceil(words.length / this.getReadingSpeed())
        };
    }

    // Get user's reading speed (words per minute)
    getReadingSpeed() {
        const speedMap = {
            'slow': 150,
            'medium': 200,
            'fast': 250
        };
        return speedMap[this.userProfile.readingSpeed] || 200;
    }

    // Update user preferences based on manual settings
    updatePreferences(newSettings) {
        // Track which features user manually enables/disables
        Object.keys(newSettings).forEach(setting => {
            if (setting.startsWith('enable') && newSettings[setting]) {
                this.userProfile.readingPatterns.preferredFeatures.add(setting.replace('enable', '').toLowerCase());
            }
        });

        // Update reading speed if font size indicates preference
        if (newSettings['font-size']) {
            if (newSettings['font-size'] >= 20) {
                this.userProfile.readingSpeed = 'slow';
            } else if (newSettings['font-size'] <= 14) {
                this.userProfile.readingSpeed = 'fast';
            }
        }

        this.saveUserProfile();
    }

    // Generate insights for user dashboard
    generateInsights() {
        const patterns = this.userProfile.readingPatterns;
        const insights = [];

        if (patterns.textsProcessed > 10) {
            const avgTime = patterns.timeSpentReading / patterns.textsProcessed;
            if (avgTime > 300) {
                insights.push({
                    type: 'recommendation',
                    title: 'Reading Speed',
                    message: 'Consider enabling text summarization to reduce reading time',
                    action: 'enable-summarization'
                });
            }
        }

        if (this.userProfile.commonWords.size > 20) {
            insights.push({
                type: 'recommendation',
                title: 'Vocabulary Support',
                message: 'You might benefit from text simplification based on your reading patterns',
                action: 'enable-simplification'
            });
        }

        if (patterns.preferredFeatures.has('speech-synthesis')) {
            insights.push({
                type: 'tip',
                title: 'Audio Learning',
                message: 'You seem to prefer audio content. Consider adjusting speech rate in settings',
                action: 'adjust-speech-rate'
            });
        }

        return insights;
    }

    // Reset personalization data (for privacy)
    resetPersonalization() {
        this.userProfile = {
            readingSpeed: 'medium',
            preferredComplexity: 'simple',
            frequentLanguages: ['en'],
            commonWords: new Map(),
            readingPatterns: {
                timeSpentReading: 0,
                textsProcessed: 0,
                preferredFeatures: new Set(),
                strugglingAreas: new Set()
            },
            adaptiveSettings: {
                autoSimplify: false,
                autoSummarize: false,
                autoTranslate: false,
                learningMode: true
            }
        };
        
        chrome.storage.sync.remove(['user_profile']);
    }
}

// Usage Analytics (Privacy-friendly)
class UsageAnalytics {
    constructor() {
        this.sessionData = {
            startTime: Date.now(),
            featuresUsed: new Set(),
            textsProcessed: 0,
            timeSpent: 0,
            errors: []
        };
    }

    // Track feature usage
    trackFeature(featureName, metadata = {}) {
        this.sessionData.featuresUsed.add(featureName);
        
        // Log to local storage for user insights (not sent anywhere)
        const usageLog = {
            timestamp: Date.now(),
            feature: featureName,
            metadata: metadata
        };

        chrome.storage.local.get(['usage_logs'], (result) => {
            const logs = result.usage_logs || [];
            logs.push(usageLog);
            
            // Keep only last 100 entries to prevent storage bloat
            if (logs.length > 100) {
                logs.splice(0, logs.length - 100);
            }
            
            chrome.storage.local.set({ usage_logs: logs });
        });
    }

    // Track errors for improvement
    trackError(error, context = '') {
        const errorLog = {
            timestamp: Date.now(),
            error: error.message || error,
            context: context,
            stack: error.stack || ''
        };

        this.sessionData.errors.push(errorLog);

        chrome.storage.local.get(['error_logs'], (result) => {
            const errors = result.error_logs || [];
            errors.push(errorLog);
            
            // Keep only last 50 error entries
            if (errors.length > 50) {
                errors.splice(0, errors.length - 50);
            }
            
            chrome.storage.local.set({ error_logs: errors });
        });
    }

    // Get usage statistics for user dashboard
    async getUsageStats() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['usage_logs'], (result) => {
                const logs = result.usage_logs || [];
                const last30Days = Date.now() - (30 * 24 * 60 * 60 * 1000);
                const recentLogs = logs.filter(log => log.timestamp > last30Days);

                const stats = {
                    totalSessions: recentLogs.length,
                    featuresUsed: [...new Set(recentLogs.map(log => log.feature))],
                    mostUsedFeature: this.getMostFrequent(recentLogs.map(log => log.feature)),
                    dailyUsage: this.groupByDay(recentLogs)
                };

                resolve(stats);
            });
        });
    }

    // Helper method to find most frequent item
    getMostFrequent(array) {
        const frequency = {};
        let maxCount = 0;
        let mostFrequent = null;

        array.forEach(item => {
            frequency[item] = (frequency[item] || 0) + 1;
            if (frequency[item] > maxCount) {
                maxCount = frequency[item];
                mostFrequent = item;
            }
        });

        return mostFrequent;
    }

    // Group usage by day
    groupByDay(logs) {
        const dayGroups = {};
        logs.forEach(log => {
            const day = new Date(log.timestamp).toDateString();
            dayGroups[day] = (dayGroups[day] || 0) + 1;
        });
        return dayGroups;
    }
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PersonalizationEngine, UsageAnalytics };
}