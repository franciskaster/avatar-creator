# 🎨 Avatar Generator

A modern and interactive avatar generator that creates custom avatars with letters, colors and predefined palettes.

## ✨ Features

- **Avatar Generation**: Create avatars with individual letters (A-Z) or double letters (AA-ZZ)
- **Customizable Colors**: Choose custom background and text colors
- **Predefined Palettes**: 6 ready-to-use color palettes
- **Multiple Sizes**: 64x64px, 128x128px, 256x256px, 512x512px
- **Real-time Preview**: See the avatar being generated instantly
- **Individual Download**: Download avatars as PNG
- **Batch Download**: Download multiple avatars in a ZIP file
- **Responsive Interface**: Works perfectly on desktop and mobile

## 🚀 How to Use

1. **Open the `index.html` file** in your browser
2. **Type the avatar text** (A-Z or AA-ZZ)
3. **Choose colors** using the selectors or predefined palettes
4. **Select the desired size**
5. **Click "Generate Avatar"** to add to the list
6. **Download individually** or **in batch as ZIP**

## 🎯 Usage Examples

- **Name initials**: A, B, C, etc.
- **Double initials**: AA, BB, CC, etc.
- **Team codes**: TM, DEV, UX, etc.
- **Brands**: LG, HP, etc.

## 🛠️ Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern design with gradients and animations
- **JavaScript ES6+**: Interactive logic
- **SVG**: Vector avatar generation
- **JSZip**: ZIP file creation
- **Canvas API**: SVG to PNG conversion

## 📁 Project Structure

```
avatar-creator/
├── index.html          # Main page
├── styles.css          # CSS styles
├── script.js           # JavaScript logic
└── README.md           # Documentation
```

## 🎨 Available Color Palettes

- **Orange**: #f39c12 with white text
- **Blue**: #3498db with white text
- **Red**: #e74c3c with white text
- **Green**: #2ecc71 with white text
- **Purple**: #9b59b6 with white text
- **Gray**: #34495e with white text

## 🔧 Customization

### Adding New Palettes

To add new palettes, edit the `index.html` file in the `.palette-grid` section:

```html
<div class="palette" data-bg="#your-color" data-text="#text-color">
    <div class="palette-color" style="background: #your-color;"></div>
    <span>Palette Name</span>
</div>
```

### Modifying Sizes

To add new sizes, edit the `index.html` file in the `#size-select` section:

```html
<option value="1024">1024x1024px</option>
```

## 🌐 Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 📱 Responsiveness

The project is fully responsive and works perfectly on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (up to 767px)

## 🚀 Deploy

To deploy the project:

1. **GitHub Pages**: Upload the files to a repository and enable GitHub Pages
2. **Netlify**: Drag the project folder to Netlify
3. **Vercel**: Connect the repository to Vercel
4. **Local Server**: Open `index.html` directly in the browser

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Open a Pull Request

## 📄 License

This project is under the MIT license. See the `LICENSE` file for more details.

## 🎉 Acknowledgments

- Google Fonts (Inter)
- JSZip library for ZIP file creation
- Developer community for inspiration

---

**Developed with ❤️ to create amazing avatars!**