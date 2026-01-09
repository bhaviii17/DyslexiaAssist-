// Simple TTS test script
function testTTS() {
    console.log('Testing TTS...');
    
    if (!('speechSynthesis' in window)) {
        console.error('speechSynthesis not supported');
        alert('Speech synthesis not supported in this browser');
        return;
    }
    
    // Stop any existing speech
    speechSynthesis.cancel();
    
    const text = 'Hello! This is a test of text to speech. Can you hear me?';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
        console.log('Speech started');
        alert('Speech started - you should hear audio now');
    };
    
    utterance.onend = () => {
        console.log('Speech ended');
    };
    
    utterance.onerror = (event) => {
        console.error('Speech error:', event.error);
        alert('Speech error: ' + event.error);
    };
    
    console.log('About to speak...');
    speechSynthesis.speak(utterance);
    
    // Force check
    setTimeout(() => {
        console.log('Speech synthesis speaking:', speechSynthesis.speaking);
        console.log('Speech synthesis pending:', speechSynthesis.pending);
    }, 500);
}

// Auto-run test when script loads
testTTS();