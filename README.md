# DyslexiaAssist - AI-Powered Browser Extension

A comprehensive, AI-powered browser extension designed to help people with dyslexia and other reading difficulties by providing intelligent, personalized accessibility features.

## 🤖 AI-Powered Features

### 🧠 Intelligent Text Processing
- **Smart Text Simplification** using Hugging Face AI models
- **Automatic Summarization** for long articles and content
- **Context-aware Translation** supporting Indian languages
- **Adaptive Content Processing** based on user preferences

### 🎯 Personalization Engine
- **Learning Algorithm** that adapts to your reading patterns
- **Personalized Recommendations** for optimal settings
- **Usage Analytics** with insights and improvement tracking
- **Adaptive Settings** that auto-adjust based on your behavior

### 🗣️ Advanced Speech Features
- **Natural Text-to-Speech** with customizable voices and speed
- **Voice Commands** for hands-free control
- **Speech-to-Text** for voice input and dictation
- **Multi-language Speech Support**

### 📊 Smart Analytics
- **Reading Pattern Analysis** to understand your preferences
- **Feature Usage Tracking** to optimize your experience
- **Progress Monitoring** with improvement metrics
- **Privacy-First Analytics** (all data stays local)

## 🌍 Multilingual Support

### Indian Language Support
- **Hindi (हिन्दी)** - Full translation and speech support
- **Tamil (தமிழ்)** - Translation with regional voice options
- **Telugu (తెలుగు)** - Comprehensive language processing
- **Bengali (বাংলা)** - Smart text simplification
- **Gujarati (ગુજરાતી)** - Audio and text features
- **Marathi (मराठी)** - Cultural context awareness
- **Kannada (ಕನ್ನಡ)** - Regional reading patterns
- **Malayalam (മലയാളം)** - Advanced text processing

## 🔤 Traditional Accessibility Features

### 🔤 Font Customization
- **Dyslexia-friendly fonts** including OpenDyslexic
- **Adjustable font size** (10px - 32px)
- **Font weight control** (normal, bold, lighter)
- **Multiple font options** (Arial, Verdana, Comic Sans MS, Calibri, Trebuchet MS)

### 📏 Text Spacing
- **Line height adjustment** for better readability
- **Letter spacing** to prevent character confusion
- **Word spacing** for improved word recognition
- **Paragraph spacing** to reduce text density

### 👁️ Visual Aids
- **Reading guide** - horizontal line that follows your cursor
- **Link highlighting** with background colors
- **Enhanced focus indicators** for better navigation
- **Improved text selection** highlighting

### 🎨 Color Filters & Contrast
- **Color overlays** (Yellow, Blue, Green, Pink, Sepia)
- **High contrast mode** for better visibility
- **Brightness adjustment** (30% - 200%)
- **Contrast control** (50% - 200%)

### ⚡ Motion & Animation
- **Reduce animations** to minimize distractions
- **Pause GIFs** automatically
- **Simplified layouts** to reduce visual clutter

### ⌨️ Keyboard Shortcuts
- `Ctrl+Shift+D` - Toggle extension
- `Ctrl+Shift+R` - Toggle reading guide

## Installation

### From Chrome Web Store
1. Visit the Chrome Web Store
2. Search for "DyslexiaAssist"
3. Click "Add to Chrome"

### Manual Installation (Development)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your browser toolbar

## Usage

### Quick Access
- Click the DyslexiaAssist icon in your browser toolbar
- Use the popup interface to quickly adjust common settings

### Advanced Settings
- Right-click the extension icon and select "Options"
- Or click "More Options" in the popup
- Access the full settings page with all customization options

### Context Menu
- Right-click on any webpage to access quick toggle options
- Toggle reading guide, reset settings, or enable/disable the extension

## Settings

### Reading Tab
- **Font Settings**: Choose fonts, size, and weight
- **Text Spacing**: Adjust line height, letter spacing, word spacing, and paragraph spacing

### Visual Tab
- **Visual Aids**: Enable reading guides, link highlighting, focus enhancement
- **Color Filters**: Apply color overlays, adjust brightness and contrast

### Advanced Tab
- **Animation Control**: Reduce animations, pause GIFs
- **Content Formatting**: Simplify layouts, force left-align text
- **Keyboard Shortcuts**: View and customize shortcuts

### AI Features Tab
- **AI Configuration**: Enable AI features and set API key
- **Text Processing**: Auto-simplify and auto-summarize options
- **Multilingual Support**: Translation to Indian languages
- **Speech Features**: Text-to-speech and voice commands
- **Personalization**: Adaptive learning and usage insights

### About Tab
- Extension information and reading tips

## Browser Compatibility

- **Chrome** (Version 88+)
- **Microsoft Edge** (Chromium-based)
- **Opera** (Version 74+)
- **Brave Browser**

## File Structure

```
dyslexia-assist/
├── manifest.json              # Extension manifest
├── popup/
│   ├── popup.html            # Popup interface
│   ├── popup.css             # Popup styles
│   └── popup.js              # Popup functionality
├── content/
│   ├── content.js            # Main content script with AI integration
│   └── content.css           # Content script styles
├── background/
│   └── background.js         # Background service worker
├── options/
│   ├── options.html          # Options page with AI settings
│   ├── options.css           # Options page styles
│   └── options.js            # Options page functionality
├── ai/
│   ├── text-processor.js     # AI text processing module
│   └── personalization.js   # Personalization and analytics
├── analytics/
│   ├── analytics.html        # Usage dashboard
│   └── analytics.js          # Analytics functionality
├── icons/
│   ├── icon16.svg            # 16x16 icon
│   ├── icon32.svg            # 32x32 icon
│   ├── icon48.svg            # 48x48 icon
│   └── icon128.svg           # 128x128 icon
└── README.md                 # This file
```

## AI Features Setup

### Getting Started with AI
1. **Get API Key**: Sign up at [Hugging Face](https://huggingface.co) and get a free API key
2. **Configure Extension**: Enter API key in Options > AI Features
3. **Enable Features**: Turn on desired AI processing options
4. **Set Languages**: Choose your preferred languages for translation
5. **Personalization**: Enable adaptive learning for better experience

### Keyboard Shortcuts
- `Ctrl+Shift+D` - Toggle extension
- `Ctrl+Shift+R` - Toggle reading guide
- `Ctrl+Shift+P` - Process selected text with AI
- `Ctrl+Shift+S` - Speak selected text aloud

## AI Technology Integration

### Text Processing Models
- **Simplification**: Advanced language models for readable text
- **Summarization**: BART model for content condensation
- **Translation**: Helsinki-NLP models for Indian languages
- **Personalization**: Local learning algorithms

### Privacy & Security
- **Local Processing**: Personal data never leaves your device
- **Secure API**: Encrypted communication with AI services
- **User Control**: Full control over data and privacy settings
- **No Tracking**: No user behavior tracking or data collection

## Privacy & Permissions

### Required Permissions
- **Active Tab**: To apply accessibility features to the current webpage
- **Storage**: To save your preferences across browser sessions
- **Scripting**: To inject accessibility enhancements into webpages

### Data Privacy
- All settings are stored locally in your browser
- No data is transmitted to external servers
- No tracking or analytics are implemented
- Your browsing data remains private

## Development

### Prerequisites
- Node.js (for development tools, optional)
- Chrome browser for testing
- Basic knowledge of HTML, CSS, and JavaScript

### Setting Up Development Environment
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/dyslexia-assist.git
   cd dyslexia-assist
   ```

2. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project folder

3. Make changes and reload the extension as needed

### Testing
- Test on various websites to ensure compatibility
- Check console for errors in background script and content scripts
- Verify settings persistence across browser restarts
- Test all features in different scenarios

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Areas for Contribution
- Additional dyslexia-friendly fonts
- New color filter options
- Improved reading aids
- Better mobile support
- Accessibility enhancements
- Bug fixes and optimizations

## Accessibility Guidelines

This extension follows WCAG 2.1 guidelines and aims to:
- Provide sufficient color contrast
- Support keyboard navigation
- Include proper ARIA labels
- Maintain focus indicators
- Offer text alternatives

## Support

### Troubleshooting
- **Extension not working**: Try refreshing the webpage or reloading the extension
- **Settings not saving**: Check if you have sufficient storage permissions
- **Performance issues**: Disable unused features in the options page

### Getting Help
- Check the FAQ section in the options page
- Report bugs through the Chrome Web Store or GitHub issues
- Contact support for accessibility-related questions

## Changelog

### Version 1.0.0
- Initial release
- Basic font and spacing customization
- Reading guide functionality
- Color filters and contrast adjustment
- Options page with full settings
- Keyboard shortcuts support

## License

MIT License - see LICENSE file for details

## Acknowledgments

- OpenDyslexic font team for creating the dyslexia-friendly font
- Dyslexia research community for insights into reading difficulties
- Web accessibility advocates for guidance on inclusive design

## Tips for Better Reading

1. **Font Choice**: OpenDyslexic is specifically designed for dyslexia
2. **Spacing**: Increase line spacing to 1.5 or higher
3. **Color**: Try different color overlays to find what works best
4. **Brightness**: Adjust based on your environment and time of day
5. **Reading Guide**: Use when reading long passages or articles
6. **Breaks**: Take regular breaks to prevent eye strain

---

**Made with ❤️ for accessibility and inclusive web browsing**