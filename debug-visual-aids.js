// Debug script to test Visual Aids and Color Filters
document.addEventListener('DOMContentLoaded', () => {
    // Test reading guide
    window.testReadingGuide = function() {
        console.log('Testing reading guide...');
        
        // Remove existing guide
        const existing = document.getElementById('dyslexia-reading-guide');
        if (existing) existing.remove();
        
        // Create reading guide
        const guide = document.createElement('div');
        guide.id = 'dyslexia-reading-guide';
        guide.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 0 !important;
            right: 0 !important;
            height: 2px !important;
            background: linear-gradient(90deg, rgba(255,0,0,0.8), rgba(255,0,0,0.4), rgba(255,0,0,0.8)) !important;
            z-index: 999999 !important;
            pointer-events: none !important;
            box-shadow: 0 0 10px rgba(255,0,0,0.5) !important;
        `;
        
        document.body.appendChild(guide);
        console.log('Reading guide created');
        
        // Auto-remove after 5 seconds for testing
        setTimeout(() => {
            guide.remove();
            console.log('Reading guide removed');
        }, 5000);
    };
    
    // Test highlight links
    window.testHighlightLinks = function() {
        console.log('Testing highlight links...');
        
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.style.cssText += `
                background-color: yellow !important;
                color: black !important;
                text-decoration: underline !important;
                border: 2px solid orange !important;
                padding: 2px !important;
            `;
        });
        
        console.log(`Highlighted ${links.length} links`);
        
        // Reset after 5 seconds
        setTimeout(() => {
            links.forEach(link => {
                link.style.cssText = link.style.cssText
                    .replace(/background-color: yellow !important;/g, '')
                    .replace(/color: black !important;/g, '')
                    .replace(/border: 2px solid orange !important;/g, '')
                    .replace(/padding: 2px !important;/g, '');
            });
            console.log('Link highlighting removed');
        }, 5000);
    };
    
    // Test color filter
    window.testColorFilter = function(filterType = 'blue') {
        console.log('Testing color filter:', filterType);
        
        // Remove existing filter
        const existing = document.getElementById('dyslexia-color-filter');
        if (existing) existing.remove();
        
        const filterMap = {
            'blue': 'sepia(0.2) saturate(0.8) hue-rotate(180deg)',
            'yellow': 'sepia(0.5) saturate(1.2) hue-rotate(20deg)',
            'green': 'sepia(0.3) saturate(0.9) hue-rotate(90deg)',
            'gray': 'grayscale(0.3) contrast(1.1)',
            'high-contrast': 'contrast(1.5) brightness(1.1)'
        };
        
        const filter = filterMap[filterType] || '';
        
        if (filter) {
            // Apply filter to entire page
            document.documentElement.style.filter = filter;
            console.log('Color filter applied:', filter);
            
            // Reset after 5 seconds
            setTimeout(() => {
                document.documentElement.style.filter = '';
                console.log('Color filter removed');
            }, 5000);
        }
    };
    
    // Test reduce animations
    window.testReduceAnimations = function() {
        console.log('Testing reduce animations...');
        
        const style = document.createElement('style');
        style.id = 'dyslexia-reduce-animations';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.1s !important;
                animation-delay: 0s !important;
                transition-duration: 0.1s !important;
                transition-delay: 0s !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('Animation reduction applied');
        
        // Reset after 5 seconds
        setTimeout(() => {
            style.remove();
            console.log('Animation reduction removed');
        }, 5000);
    };
    
    console.log('Visual Aids Debug Script Loaded');
    console.log('Test functions available:');
    console.log('- testReadingGuide()');
    console.log('- testHighlightLinks()');
    console.log('- testColorFilter("blue")');
    console.log('- testReduceAnimations()');
});