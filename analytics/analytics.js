// Analytics Dashboard JavaScript
document.addEventListener('DOMContentLoaded', async function() {
    await loadAnalyticsData();
    setupEventListeners();
});

async function loadAnalyticsData() {
    try {
        // Load usage statistics
        const usageStats = await getUsageStats();
        const userProfile = await getUserProfile();
        
        displayBasicStats(usageStats);
        displayFeatureUsage(usageStats.featuresUsed);
        displayRecommendations();
        displayReadingMetrics(userProfile);
        drawUsageChart(usageStats.dailyUsage);
        
    } catch (error) {
        console.error('Failed to load analytics data:', error);
        showError('Failed to load analytics data');
    }
}

function getUsageStats() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['usage_logs'], (result) => {
            const logs = result.usage_logs || [];
            const last30Days = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const recentLogs = logs.filter(log => log.timestamp > last30Days);

            const stats = {
                totalSessions: recentLogs.length,
                featuresUsed: countFeatureUsage(recentLogs),
                dailyUsage: groupByDay(recentLogs),
                totalReadingTime: calculateReadingTime(recentLogs)
            };

            resolve(stats);
        });
    });
}

function getUserProfile() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['user_profile'], (result) => {
            resolve(result.user_profile || {});
        });
    });
}

function displayBasicStats(stats) {
    document.getElementById('total-sessions').textContent = stats.totalSessions;
    document.getElementById('reading-time').textContent = formatTime(stats.totalReadingTime);
    document.getElementById('texts-processed').textContent = stats.textsProcessed || 0;
    document.getElementById('features-used').textContent = Object.keys(stats.featuresUsed).length;
}

function displayFeatureUsage(featuresUsed) {
    const container = document.getElementById('feature-usage-list');
    container.innerHTML = '';

    const sortedFeatures = Object.entries(featuresUsed)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10); // Top 10 features

    const maxUsage = Math.max(...Object.values(featuresUsed));

    sortedFeatures.forEach(([feature, count]) => {
        const item = document.createElement('li');
        item.className = 'feature-usage-item';
        
        const percentage = (count / maxUsage) * 100;
        
        item.innerHTML = `
            <span>${formatFeatureName(feature)}</span>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${count} times</span>
                <div class="feature-usage-bar">
                    <div class="feature-usage-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        
        container.appendChild(item);
    });
}

function displayRecommendations() {
    const container = document.getElementById('recommendations-list');
    container.innerHTML = '';

    // Get personalized recommendations (mock data for now)
    const recommendations = [
        {
            title: 'Text Simplification',
            description: 'Based on your reading patterns, enabling auto-simplification could reduce reading time by 20%'
        },
        {
            title: 'Speech Rate Adjustment',
            description: 'Your preferred speech rate appears to be slower. Consider adjusting to 0.7x speed'
        },
        {
            title: 'Reading Breaks',
            description: 'You tend to read for long periods. Consider taking breaks every 15 minutes'
        },
        {
            title: 'Color Filter',
            description: 'Users with similar patterns benefit from blue tint filters. Try enabling it'
        }
    ];

    recommendations.forEach(rec => {
        const item = document.createElement('li');
        item.className = 'recommendation-item';
        item.innerHTML = `
            <div class="recommendation-title">${rec.title}</div>
            <div class="recommendation-desc">${rec.description}</div>
        `;
        container.appendChild(item);
    });
}

function displayReadingMetrics(userProfile) {
    const readingSpeed = estimateReadingSpeed(userProfile);
    document.getElementById('avg-reading-speed').textContent = readingSpeed;
    
    const comprehension = estimateComprehension(userProfile);
    document.getElementById('comprehension-score').textContent = comprehension + '%';
    
    const difficulty = userProfile.preferredComplexity || 'Medium';
    document.getElementById('difficulty-preference').textContent = difficulty;
    
    const trend = calculateTrend(userProfile);
    document.getElementById('improvement-trend').textContent = trend;
}

function drawUsageChart(dailyUsage) {
    const canvas = document.getElementById('usage-chart');
    const ctx = canvas.getContext('2d');
    
    // Simple chart drawing (for a real app, consider using Chart.js)
    const days = Object.keys(dailyUsage).slice(-7); // Last 7 days
    const values = days.map(day => dailyUsage[day] || 0);
    
    const maxValue = Math.max(...values) || 1;
    const chartWidth = canvas.width - 80;
    const chartHeight = canvas.height - 60;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw axes
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(40, chartHeight + 20);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(40, chartHeight + 20);
    ctx.lineTo(chartWidth + 40, chartHeight + 20);
    ctx.stroke();
    
    // Draw bars
    const barWidth = chartWidth / days.length * 0.8;
    const barSpacing = chartWidth / days.length * 0.2;
    
    ctx.fillStyle = '#667eea';
    
    days.forEach((day, index) => {
        const value = values[index];
        const barHeight = (value / maxValue) * chartHeight;
        const x = 40 + index * (barWidth + barSpacing) + barSpacing / 2;
        const y = 20 + chartHeight - barHeight;
        
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw day labels
        ctx.fillStyle = '#6c757d';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        const dayLabel = new Date(day).toLocaleDateString('en', { weekday: 'short' });
        ctx.fillText(dayLabel, x + barWidth / 2, chartHeight + 40);
        
        ctx.fillStyle = '#667eea';
    });
    
    // Draw value labels
    ctx.fillStyle = '#6c757d';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxValue / 5) * i);
        const y = 20 + chartHeight - (chartHeight / 5) * i;
        ctx.fillText(value.toString(), 35, y + 3);
    }
}

// Helper functions
function countFeatureUsage(logs) {
    const usage = {};
    logs.forEach(log => {
        usage[log.feature] = (usage[log.feature] || 0) + 1;
    });
    return usage;
}

function groupByDay(logs) {
    const dayGroups = {};
    logs.forEach(log => {
        const day = new Date(log.timestamp).toDateString();
        dayGroups[day] = (dayGroups[day] || 0) + 1;
    });
    return dayGroups;
}

function calculateReadingTime(logs) {
    // Estimate based on feature usage (mock calculation)
    return logs.length * 5; // 5 minutes per log entry
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function formatFeatureName(feature) {
    return feature.replace(/-/g, ' ')
                 .replace(/\b\w/g, l => l.toUpperCase());
}

function estimateReadingSpeed(userProfile) {
    const speedMap = {
        'slow': '120-150',
        'medium': '180-220',
        'fast': '250-300'
    };
    return speedMap[userProfile.readingSpeed] || '180-220';
}

function estimateComprehension(userProfile) {
    // Mock calculation based on user patterns
    const baseScore = 75;
    const featureBonus = (userProfile.readingPatterns?.preferredFeatures?.length || 0) * 5;
    return Math.min(95, baseScore + featureBonus);
}

function calculateTrend(userProfile) {
    // Mock trend calculation
    const trends = ['↗', '→', '↘'];
    return trends[Math.floor(Math.random() * trends.length)];
}

function setupEventListeners() {
    // Add event listeners for interactive elements
    document.addEventListener('click', function(e) {
        if (e.target.closest('.stat-card')) {
            // Could show detailed view
        }
    });
}

function exportData() {
    chrome.storage.local.get(null, function(data) {
        const exportData = {
            timestamp: new Date().toISOString(),
            usage_logs: data.usage_logs || [],
            error_logs: data.error_logs || []
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'dyslexia-assist-analytics.json';
        link.click();
    });
}

function clearData() {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
        chrome.storage.local.clear(function() {
            location.reload();
        });
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'ai-status-message error';
    errorDiv.textContent = message;
    document.querySelector('.analytics-container').prepend(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}