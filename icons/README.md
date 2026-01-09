# Icon Creation Instructions

The current icon files are SVG placeholders. For a production browser extension, you need to create actual PNG icon files.

## Required Icon Sizes
- `icon16.png` - 16x16 pixels (toolbar)
- `icon32.png` - 32x32 pixels (Windows)
- `icon48.png` - 48x48 pixels (extension management)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Design Guidelines
1. **Simple and recognizable** - Should be clear at small sizes
2. **Consistent color scheme** - Use the extension's brand colors (#667eea)
3. **Accessibility symbol** - Consider using symbols like:
   - Stylized "D" for Dyslexia
   - Eye symbol for visual assistance
   - Text/book icon with accessibility elements
   - Reading guide line symbol

## Tools for Creating Icons
- **Figma** (free, web-based)
- **Adobe Illustrator**
- **Canva** (has icon templates)
- **GIMP** (free alternative)
- **Sketch** (Mac only)

## Converting SVG to PNG
You can convert the provided SVG files to PNG using:
- Online converters (svg2png.com)
- Command line tools (ImageMagick, Inkscape)
- Design software export functions

## Quick Conversion Commands
If you have ImageMagick installed:
```bash
magick convert icon16.svg icon16.png
magick convert icon32.svg icon32.png
magick convert icon48.svg icon48.png
magick convert icon128.svg icon128.png
```

## After Creating PNG Files
1. Replace the SVG files with PNG files
2. Update the manifest.json references if needed (they should already point to .png)
3. Test the extension to ensure icons display correctly
4. The extension will automatically use the PNG files once they're in place