// Advanced Accessibility Analyzer for DyslexiaAssist
class AccessibilityAnalyzer {
    constructor() {
        this.metrics = {
            readabilityScore: 0,
            colorContrastScore: 0,
            layoutScore: 0,
            fontScore: 0,
            overallScore: 0
        };
        this.issues = [];
        this.recommendations = [];
    }

    // Comprehensive accessibility analysis
    async analyzePageAccessibility() {
        const analysis = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            title: document.title
        };

        try {
            // Run all analysis modules
            const readabilityResults = this.analyzeReadability();
            const colorResults = this.analyzeColorContrast();
            const layoutResults = this.analyzeLayout();
            const fontResults = this.analyzeFonts();
            const navigationResults = this.analyzeNavigation();
            const motionResults = this.analyzeMotionAndAnimations();
            const semanticResults = this.analyzeSemanticStructure();

            // Compile results
            analysis.metrics = {
                readability: readabilityResults,
                colorContrast: colorResults,
                layout: layoutResults,
                fonts: fontResults,
                navigation: navigationResults,
                motion: motionResults,
                semantics: semanticResults
            };

            // Calculate overall accessibility score
            analysis.overallScore = this.calculateOverallScore(analysis.metrics);
            analysis.grade = this.getAccessibilityGrade(analysis.overallScore);
            analysis.issues = this.compileIssues(analysis.metrics);
            analysis.recommendations = this.generateRecommendations(analysis.metrics);
            analysis.dyslexiaFriendliness = this.assessDyslexiaFriendliness(analysis.metrics);

            return analysis;
        } catch (error) {
            console.error('Accessibility analysis failed:', error);
            return {
                ...analysis,
                error: error.message,
                overallScore: 0,
                grade: 'Unable to analyze'
            };
        }
    }

    // Analyze text readability
    analyzeReadability() {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, div');
        let totalWords = 0;
        let totalSentences = 0;
        let totalSyllables = 0;
        let complexWords = 0;
        let longSentences = 0;

        textElements.forEach(element => {
            const text = element.textContent.trim();
            if (text.length < 10) return; // Skip very short text

            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const words = text.split(/\s+/).filter(w => w.length > 0);

            totalSentences += sentences.length;
            totalWords += words.length;

            sentences.forEach(sentence => {
                const sentenceWords = sentence.split(/\s+/).filter(w => w.length > 0);
                if (sentenceWords.length > 20) longSentences++;
            });

            words.forEach(word => {
                const syllables = this.countSyllables(word);
                totalSyllables += syllables;
                if (syllables > 2) complexWords++;
            });
        });

        const avgWordsPerSentence = totalWords / Math.max(totalSentences, 1);
        const avgSyllablesPerWord = totalSyllables / Math.max(totalWords, 1);
        const complexWordPercentage = (complexWords / Math.max(totalWords, 1)) * 100;

        // Calculate Flesch Reading Ease
        const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        
        // Calculate grade level
        const gradeLevel = Math.max(1, Math.min(12, 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59));

        return {
            score: Math.max(0, Math.min(100, fleschScore)),
            gradeLevel: Math.round(gradeLevel * 10) / 10,
            metrics: {
                totalWords,
                totalSentences,
                avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
                avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10,
                complexWordPercentage: Math.round(complexWordPercentage * 10) / 10,
                longSentencePercentage: Math.round((longSentences / Math.max(totalSentences, 1)) * 100)
            },
            issues: this.getReadabilityIssues(avgWordsPerSentence, complexWordPercentage, longSentences, totalSentences)
        };
    }

    // Analyze color contrast
    analyzeColorContrast() {
        const issues = [];
        let totalElements = 0;
        let passedElements = 0;

        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a, button, input, label');
        
        textElements.forEach(element => {
            if (element.textContent.trim().length === 0) return;
            
            totalElements++;
            const styles = window.getComputedStyle(element);
            const bgColor = this.getEffectiveBackgroundColor(element);
            const textColor = styles.color;
            
            const contrast = this.calculateContrastRatio(textColor, bgColor);
            const fontSize = parseFloat(styles.fontSize);
            const isLargeText = fontSize >= 18 || (fontSize >= 14 && styles.fontWeight === 'bold');
            
            const requiredRatio = isLargeText ? 3 : 4.5;
            
            if (contrast >= requiredRatio) {
                passedElements++;
            } else {
                issues.push({
                    element: element.tagName.toLowerCase(),
                    contrast: Math.round(contrast * 100) / 100,
                    required: requiredRatio,
                    textColor,
                    backgroundColor: bgColor,
                    fontSize
                });
            }
        });

        const score = totalElements > 0 ? (passedElements / totalElements) * 100 : 100;

        return {
            score: Math.round(score),
            totalElements,
            passedElements,
            failedElements: totalElements - passedElements,
            issues: issues.slice(0, 10), // Limit to first 10 issues
            recommendations: this.getContrastRecommendations(issues.length)
        };
    }

    // Analyze page layout for dyslexia-friendliness
    analyzeLayout() {
        const issues = [];
        let score = 100;

        // Check line length
        const textBlocks = document.querySelectorAll('p, div');
        let longLineCount = 0;
        textBlocks.forEach(block => {
            const width = block.offsetWidth;
            const fontSize = parseFloat(window.getComputedStyle(block).fontSize);
            const charactersPerLine = width / (fontSize * 0.6); // Approximate
            
            if (charactersPerLine > 80) {
                longLineCount++;
            }
        });

        if (longLineCount > textBlocks.length * 0.3) {
            issues.push('Text lines are too long (over 80 characters)');
            score -= 15;
        }

        // Check spacing
        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
        let poorSpacingCount = 0;
        elements.forEach(element => {
            const styles = window.getComputedStyle(element);
            const lineHeight = parseFloat(styles.lineHeight);
            const fontSize = parseFloat(styles.fontSize);
            const ratio = lineHeight / fontSize;
            
            if (ratio < 1.4) {
                poorSpacingCount++;
            }
        });

        if (poorSpacingCount > elements.length * 0.5) {
            issues.push('Insufficient line spacing (should be at least 1.4x font size)');
            score -= 20;
        }

        // Check justification
        const justifiedElements = Array.from(document.querySelectorAll('*')).filter(el => {
            return window.getComputedStyle(el).textAlign === 'justify';
        });

        if (justifiedElements.length > 0) {
            issues.push('Justified text found (can create uneven spacing)');
            score -= 10;
        }

        return {
            score: Math.max(0, score),
            issues,
            metrics: {
                longLinePercentage: Math.round((longLineCount / Math.max(textBlocks.length, 1)) * 100),
                poorSpacingPercentage: Math.round((poorSpacingCount / Math.max(elements.length, 1)) * 100),
                justifiedElementsCount: justifiedElements.length
            }
        };
    }

    // Analyze font choices
    analyzeFonts() {
        const fontAnalysis = {
            fonts: new Set(),
            issues: [],
            score: 100
        };

        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const fontFamily = window.getComputedStyle(element).fontFamily;
            fontAnalysis.fonts.add(fontFamily);
        });

        // Check for dyslexia-friendly fonts
        const dyslexiaFriendlyFonts = [
            'opendyslexic', 'arial', 'helvetica', 'verdana', 'tahoma', 'calibri', 'trebuchet'
        ];

        const hasDyslexiaFriendlyFont = Array.from(fontAnalysis.fonts).some(font => {
            return dyslexiaFriendlyFonts.some(friendly => 
                font.toLowerCase().includes(friendly)
            );
        });

        if (!hasDyslexiaFriendlyFont) {
            fontAnalysis.issues.push('No dyslexia-friendly fonts detected');
            fontAnalysis.score -= 30;
        }

        // Check for too many fonts
        if (fontAnalysis.fonts.size > 3) {
            fontAnalysis.issues.push('Too many different fonts used');
            fontAnalysis.score -= 15;
        }

        return {
            score: Math.max(0, fontAnalysis.score),
            fontCount: fontAnalysis.fonts.size,
            fonts: Array.from(fontAnalysis.fonts),
            issues: fontAnalysis.issues,
            hasDyslexiaFriendlyFont
        };
    }

    // Analyze navigation structure
    analyzeNavigation() {
        const issues = [];
        let score = 100;

        // Check for proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
        
        let hierarchyIssues = 0;
        for (let i = 1; i < headingLevels.length; i++) {
            if (headingLevels[i] - headingLevels[i-1] > 1) {
                hierarchyIssues++;
            }
        }

        if (hierarchyIssues > 0) {
            issues.push('Heading hierarchy is not sequential');
            score -= 20;
        }

        // Check for skip links
        const skipLinks = document.querySelectorAll('a[href^="#"]');
        const hasSkipToContent = Array.from(skipLinks).some(link => 
            link.textContent.toLowerCase().includes('skip') || 
            link.textContent.toLowerCase().includes('main')
        );

        if (!hasSkipToContent && headings.length > 5) {
            issues.push('No skip navigation links found');
            score -= 15;
        }

        // Check for ARIA landmarks
        const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer');
        
        if (landmarks.length === 0) {
            issues.push('No ARIA landmarks or semantic elements found');
            score -= 25;
        }

        return {
            score: Math.max(0, score),
            headingCount: headings.length,
            hierarchyIssues,
            hasSkipLinks: hasSkipToContent,
            landmarkCount: landmarks.length,
            issues
        };
    }

    // Analyze motion and animations
    analyzeMotionAndAnimations() {
        const issues = [];
        let score = 100;

        // Check for CSS animations
        const animatedElements = Array.from(document.querySelectorAll('*')).filter(element => {
            const styles = window.getComputedStyle(element);
            return styles.animationName !== 'none' || styles.transitionProperty !== 'none';
        });

        // Check for auto-playing videos
        const autoplayVideos = document.querySelectorAll('video[autoplay], iframe[src*="autoplay=1"]');
        
        // Check for moving GIFs (approximation)
        const images = document.querySelectorAll('img[src*=".gif"]');

        if (animatedElements.length > 10) {
            issues.push('Excessive animations detected');
            score -= 20;
        }

        if (autoplayVideos.length > 0) {
            issues.push('Auto-playing videos found');
            score -= 25;
        }

        if (images.length > 0) {
            issues.push('Animated GIFs detected (may be distracting)');
            score -= 10;
        }

        return {
            score: Math.max(0, score),
            animatedElementCount: animatedElements.length,
            autoplayVideoCount: autoplayVideos.length,
            gifCount: images.length,
            issues
        };
    }

    // Analyze semantic structure
    analyzeSemanticStructure() {
        const issues = [];
        let score = 100;

        // Check for proper alt text
        const images = document.querySelectorAll('img');
        const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
        
        if (imagesWithoutAlt.length > 0) {
            issues.push(`${imagesWithoutAlt.length} images missing alt text`);
            score -= Math.min(30, imagesWithoutAlt.length * 5);
        }

        // Check for form labels
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea, select');
        const unlabeledInputs = Array.from(inputs).filter(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledby = input.getAttribute('aria-labelledby');
            return !label && !ariaLabel && !ariaLabelledby;
        });

        if (unlabeledInputs.length > 0) {
            issues.push(`${unlabeledInputs.length} form inputs missing labels`);
            score -= Math.min(25, unlabeledInputs.length * 5);
        }

        // Check for proper button text
        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
        const vagueButtons = Array.from(buttons).filter(button => {
            const text = button.textContent || button.value || '';
            return text.trim().length < 3 || /^(click|here|more|go)$/i.test(text.trim());
        });

        if (vagueButtons.length > 0) {
            issues.push(`${vagueButtons.length} buttons with unclear text`);
            score -= Math.min(15, vagueButtons.length * 3);
        }

        return {
            score: Math.max(0, score),
            imageCount: images.length,
            imagesWithoutAlt: imagesWithoutAlt.length,
            inputCount: inputs.length,
            unlabeledInputs: unlabeledInputs.length,
            buttonCount: buttons.length,
            vagueButtons: vagueButtons.length,
            issues
        };
    }

    // Helper methods
    countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }

    calculateContrastRatio(color1, color2) {
        const rgb1 = this.parseColor(color1);
        const rgb2 = this.parseColor(color2);
        
        const l1 = this.getLuminance(rgb1);
        const l2 = this.getLuminance(rgb2);
        
        const brightest = Math.max(l1, l2);
        const darkest = Math.min(l1, l2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    }

    parseColor(color) {
        const div = document.createElement('div');
        div.style.color = color;
        document.body.appendChild(div);
        const computed = window.getComputedStyle(div).color;
        document.body.removeChild(div);
        
        const match = computed.match(/\d+/g);
        return match ? [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])] : [0, 0, 0];
    }

    getLuminance([r, g, b]) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    getEffectiveBackgroundColor(element) {
        let current = element;
        while (current && current !== document.body) {
            const bgColor = window.getComputedStyle(current).backgroundColor;
            if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                return bgColor;
            }
            current = current.parentElement;
        }
        return 'rgb(255, 255, 255)'; // Default to white
    }

    calculateOverallScore(metrics) {
        const weights = {
            readability: 0.25,
            colorContrast: 0.20,
            layout: 0.15,
            fonts: 0.15,
            navigation: 0.10,
            motion: 0.10,
            semantics: 0.05
        };

        let totalScore = 0;
        Object.entries(weights).forEach(([key, weight]) => {
            if (metrics[key] && typeof metrics[key].score === 'number') {
                totalScore += metrics[key].score * weight;
            }
        });

        return Math.round(totalScore);
    }

    getAccessibilityGrade(score) {
        if (score >= 90) return 'A+ (Excellent)';
        if (score >= 80) return 'A (Very Good)';
        if (score >= 70) return 'B (Good)';
        if (score >= 60) return 'C (Fair)';
        if (score >= 50) return 'D (Poor)';
        return 'F (Very Poor)';
    }

    assessDyslexiaFriendliness(metrics) {
        const factors = {
            readability: metrics.readability?.gradeLevel <= 8 ? 'Good' : 'Needs Improvement',
            fonts: metrics.fonts?.hasDyslexiaFriendlyFont ? 'Good' : 'Needs Improvement',
            layout: metrics.layout?.score >= 70 ? 'Good' : 'Needs Improvement',
            contrast: metrics.colorContrast?.score >= 80 ? 'Good' : 'Needs Improvement'
        };

        const goodCount = Object.values(factors).filter(v => v === 'Good').length;
        const overallRating = goodCount >= 3 ? 'Dyslexia Friendly' : 
                            goodCount >= 2 ? 'Moderately Friendly' : 'Not Dyslexia Friendly';

        return {
            rating: overallRating,
            factors
        };
    }

    compileIssues(metrics) {
        const allIssues = [];
        Object.values(metrics).forEach(metric => {
            if (metric.issues) {
                allIssues.push(...metric.issues);
            }
        });
        return allIssues.slice(0, 15); // Limit to most important issues
    }

    generateRecommendations(metrics) {
        const recommendations = [];

        if (metrics.readability?.gradeLevel > 8) {
            recommendations.push('Simplify language and use shorter sentences');
        }

        if (metrics.colorContrast?.score < 80) {
            recommendations.push('Improve color contrast for better readability');
        }

        if (!metrics.fonts?.hasDyslexiaFriendlyFont) {
            recommendations.push('Use dyslexia-friendly fonts like Arial, Verdana, or OpenDyslexic');
        }

        if (metrics.layout?.score < 70) {
            recommendations.push('Improve text spacing and line length');
        }

        if (metrics.motion?.score < 80) {
            recommendations.push('Reduce animations and auto-playing content');
        }

        return recommendations.slice(0, 8);
    }

    getReadabilityIssues(avgWords, complexPercent, longSentences, totalSentences) {
        const issues = [];
        if (avgWords > 20) issues.push('Sentences are too long');
        if (complexPercent > 15) issues.push('Too many complex words');
        if ((longSentences / totalSentences) > 0.3) issues.push('Many sentences exceed 20 words');
        return issues;
    }

    getContrastRecommendations(issueCount) {
        if (issueCount === 0) return ['Color contrast is excellent'];
        if (issueCount < 5) return ['Minor contrast improvements needed'];
        return ['Significant contrast improvements required for accessibility'];
    }
}

// Make available globally
window.AccessibilityAnalyzer = AccessibilityAnalyzer;