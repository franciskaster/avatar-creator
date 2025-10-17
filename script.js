class AvatarGenerator {
    constructor() {
        this.currentText = 'A';
        this.currentSize = 256;
        this.currentShape = 'circle';
        this.currentFont = 'Inter';
        this.currentPalette = null;
        this.generatedAvatars = [];
        this.isGenerating = false;
        this.palettes = [];
        
        // Preview colors (fixed for consistency)
        this.previewColors = null;
        
        // Effects
        this.borderEnabled = false;
        this.borderWidth = 3;
        this.borderColor = '#000000';
        this.borderStyle = 'solid';
        this.borderOpacity = 100;
        this.downloadFormat = 'png';
        
        this.initializeElements();
        this.bindEvents();
        this.loadPalettes();
        this.updatePreview();
        this.updateDownloadButtonText();
    }

    initializeElements() {
        this.textInput = document.getElementById('text-input');
        this.sizeSelect = document.getElementById('size-select');
        this.shapeSelect = document.getElementById('shape-select');
        this.fontSelect = document.getElementById('font-select');
        this.generateAllBtn = document.getElementById('generate-all-btn');
        this.downloadSingleBtn = document.getElementById('download-single');
        this.downloadZipBtn = document.getElementById('download-zip');
        this.regeneratePreviewBtn = document.getElementById('regenerate-preview-btn');
        this.avatarSvg = document.getElementById('avatar-svg');
        this.generatedAvatarsSection = document.getElementById('generated-avatars');
        this.avatarsGrid = document.getElementById('avatars-grid');
        this.progressSection = document.getElementById('progress-section');
        this.progressText = document.getElementById('progress-text');
        this.progressCount = document.getElementById('progress-count');
        this.progressFill = document.getElementById('progress-fill');
        this.paletteGrid = document.getElementById('palette-grid');
        this.createPaletteBtn = document.getElementById('create-palette-btn');
        this.paletteModal = document.getElementById('palette-modal');
        this.paletteNameInput = document.getElementById('palette-name');
        this.colorInputs = document.getElementById('color-inputs');
        this.addColorBtn = document.getElementById('add-color-btn');
        this.savePaletteBtn = document.getElementById('save-palette-btn');
        this.cancelPaletteBtn = document.getElementById('cancel-palette-btn');
        this.closePaletteCreator = document.getElementById('close-palette-creator');
        
        // Effects
        this.borderEnabledCheckbox = document.getElementById('border-enabled');
        this.borderWidthSlider = document.getElementById('border-width');
        this.borderWidthValue = document.getElementById('border-width-value');
        this.borderColorInput = document.getElementById('border-color');
        this.borderStyleSelect = document.getElementById('border-style');
        this.borderOpacitySlider = document.getElementById('border-opacity');
        this.borderOpacityValue = document.getElementById('border-opacity-value');
        this.borderControls = document.getElementById('border-controls');
        
        // Download format
        this.downloadFormatRadios = document.querySelectorAll('input[name="download-format"]');
    }

    bindEvents() {
        // Input events
        this.textInput.addEventListener('input', (e) => {
            this.currentText = e.target.value.toUpperCase();
            this.updatePreview();
        });


        this.sizeSelect.addEventListener('change', (e) => {
            this.currentSize = parseInt(e.target.value);
            this.updatePreview();
        });

        this.shapeSelect.addEventListener('change', (e) => {
            this.currentShape = e.target.value;
            this.updatePreview();
        });

        this.fontSelect.addEventListener('change', (e) => {
            this.currentFont = e.target.value;
            this.updatePreview();
        });

        // Palette events
        this.createPaletteBtn.addEventListener('click', () => this.showPaletteModal());
        this.addColorBtn.addEventListener('click', () => this.addColorInput());
        this.savePaletteBtn.addEventListener('click', () => this.saveCustomPalette());
        this.cancelPaletteBtn.addEventListener('click', () => this.hidePaletteModal());
        this.closePaletteCreator.addEventListener('click', () => this.hidePaletteModal());
        
        // Close modal when clicking outside
        this.paletteModal.addEventListener('click', (e) => {
            if (e.target === this.paletteModal) {
                this.hidePaletteModal();
            }
        });
        
        // Effects events
        this.borderEnabledCheckbox.addEventListener('change', (e) => {
            this.borderEnabled = e.target.checked;
            this.borderControls.style.display = this.borderEnabled ? 'block' : 'none';
            this.updatePreview();
        });
        
        this.borderWidthSlider.addEventListener('input', (e) => {
            this.borderWidth = parseInt(e.target.value);
            this.borderWidthValue.textContent = this.borderWidth + 'px';
            this.updatePreview();
        });
        
        this.borderColorInput.addEventListener('input', (e) => {
            this.borderColor = e.target.value;
            this.updatePreview();
        });
        
        this.borderStyleSelect.addEventListener('change', (e) => {
            this.borderStyle = e.target.value;
            this.updatePreview();
        });
        
        this.borderOpacitySlider.addEventListener('input', (e) => {
            this.borderOpacity = parseInt(e.target.value);
            this.borderOpacityValue.textContent = this.borderOpacity + '%';
            this.updatePreview();
        });
        
        // Download format events
        this.downloadFormatRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.downloadFormat = e.target.value;
                this.updateDownloadButtonText();
            });
        });
        
        // Regenerate preview button
        this.regeneratePreviewBtn.addEventListener('click', () => {
            this.previewColors = this.getRandomColors();
            this.updatePreview();
        });

        // Palette buttons
        document.querySelectorAll('.palette').forEach(palette => {
            palette.addEventListener('click', (e) => {
                this.currentBgColor = palette.dataset.bg;
                this.currentTextColor = palette.dataset.text;
                this.colorPicker.value = this.currentBgColor;
                this.textColorPicker.value = this.currentTextColor;
                this.updatePreview();
                this.updatePalettes();
            });
        });

        // Action buttons
        this.generateAllBtn.addEventListener('click', () => this.generateAllAvatars());
        this.downloadSingleBtn.addEventListener('click', () => this.downloadSingle());
        this.downloadZipBtn.addEventListener('click', () => this.downloadZip());
    }

    updatePalettes() {
        document.querySelectorAll('.palette').forEach(palette => {
            palette.classList.remove('active');
            if (palette.dataset.bg === this.currentBgColor && palette.dataset.text === this.currentTextColor) {
                palette.classList.add('active');
            }
        });
    }

    generateAvatarSVG(text, bgColor, textColor, size, shape = 'circle') {
        const fontSize = Math.floor(size * 0.4);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
        svg.setAttribute('viewBox', '0 0 256 256');
        svg.setAttribute('version', '1.1');

        // Background shape
        let backgroundElement;
        if (shape === 'circle') {
            backgroundElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            backgroundElement.setAttribute('cx', '128');
            backgroundElement.setAttribute('cy', '128');
            backgroundElement.setAttribute('r', '128');
            backgroundElement.setAttribute('fill', bgColor);
        } else if (shape === 'square') {
            backgroundElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            backgroundElement.setAttribute('x', '0');
            backgroundElement.setAttribute('y', '0');
            backgroundElement.setAttribute('width', '256');
            backgroundElement.setAttribute('height', '256');
            backgroundElement.setAttribute('fill', bgColor);
        } else if (shape === 'rounded') {
            backgroundElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            backgroundElement.setAttribute('x', '0');
            backgroundElement.setAttribute('y', '0');
            backgroundElement.setAttribute('width', '256');
            backgroundElement.setAttribute('height', '256');
            backgroundElement.setAttribute('rx', '32');
            backgroundElement.setAttribute('ry', '32');
            backgroundElement.setAttribute('fill', bgColor);
        } else if (shape === 'diamond') {
            backgroundElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            backgroundElement.setAttribute('points', '128,0 256,128 128,256 0,128');
            backgroundElement.setAttribute('fill', bgColor);
        }
        
        svg.appendChild(backgroundElement);

        // Border
        if (this.borderEnabled) {
            let borderElement;
            const opacity = this.borderOpacity / 100;
            const strokeWidth = this.borderWidth * 2;
            
            if (shape === 'circle') {
                borderElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                borderElement.setAttribute('cx', '128');
                borderElement.setAttribute('cy', '128');
                borderElement.setAttribute('r', 128 - this.borderWidth);
                borderElement.setAttribute('fill', 'none');
                borderElement.setAttribute('stroke', this.borderColor);
                borderElement.setAttribute('stroke-width', strokeWidth);
                borderElement.setAttribute('stroke-dasharray', this.getDashArray());
                borderElement.setAttribute('opacity', opacity);
            } else if (shape === 'square') {
                borderElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                borderElement.setAttribute('x', this.borderWidth);
                borderElement.setAttribute('y', this.borderWidth);
                borderElement.setAttribute('width', 256 - this.borderWidth * 2);
                borderElement.setAttribute('height', 256 - this.borderWidth * 2);
                borderElement.setAttribute('fill', 'none');
                borderElement.setAttribute('stroke', this.borderColor);
                borderElement.setAttribute('stroke-width', strokeWidth);
                borderElement.setAttribute('stroke-dasharray', this.getDashArray());
                borderElement.setAttribute('opacity', opacity);
            } else if (shape === 'rounded') {
                borderElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                borderElement.setAttribute('x', this.borderWidth);
                borderElement.setAttribute('y', this.borderWidth);
                borderElement.setAttribute('width', 256 - this.borderWidth * 2);
                borderElement.setAttribute('height', 256 - this.borderWidth * 2);
                borderElement.setAttribute('rx', 32 - this.borderWidth);
                borderElement.setAttribute('ry', 32 - this.borderWidth);
                borderElement.setAttribute('fill', 'none');
                borderElement.setAttribute('stroke', this.borderColor);
                borderElement.setAttribute('stroke-width', strokeWidth);
                borderElement.setAttribute('stroke-dasharray', this.getDashArray());
                borderElement.setAttribute('opacity', opacity);
            } else if (shape === 'diamond') {
                const points = `128,${this.borderWidth} ${256 - this.borderWidth},128 128,${256 - this.borderWidth} ${this.borderWidth},128`;
                borderElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                borderElement.setAttribute('points', points);
                borderElement.setAttribute('fill', 'none');
                borderElement.setAttribute('stroke', this.borderColor);
                borderElement.setAttribute('stroke-width', strokeWidth);
                borderElement.setAttribute('stroke-dasharray', this.getDashArray());
                borderElement.setAttribute('opacity', opacity);
            }
            svg.appendChild(borderElement);
        }

        // Text
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', '50%');
        textElement.setAttribute('y', '50%');
        textElement.setAttribute('fill', textColor);
        textElement.setAttribute('font-size', fontSize);
        textElement.setAttribute('font-weight', '400');
        textElement.setAttribute('font-family', this.currentFont + ', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif');
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('alignment-baseline', 'middle');
        textElement.setAttribute('dominant-baseline', 'middle');
        textElement.setAttribute('dy', '.1em');
        textElement.textContent = text;
        svg.appendChild(textElement);

        return svg;
    }

    getDashArray() {
        switch (this.borderStyle) {
            case 'dashed':
                return `${this.borderWidth * 4} ${this.borderWidth * 2}`;
            case 'dotted':
                return `0 ${this.borderWidth * 2}`;
            case 'double':
                return `${this.borderWidth} ${this.borderWidth * 2}`;
            default:
                return 'none';
        }
    }

    updatePreview() {
        // Use fixed colors for preview consistency
        if (!this.previewColors) {
            this.previewColors = this.getRandomColors();
        }
        
        // Use a fixed size for preview (larger for better visibility)
        const previewSize = 300;
        
        const svg = this.generateAvatarSVG(
            this.currentText || 'A',
            this.previewColors.bg,
            this.previewColors.text,
            previewSize,
            this.currentShape
        );

        // Update the preview SVG
        this.avatarSvg.innerHTML = svg.innerHTML;
        this.avatarSvg.setAttribute('width', previewSize);
        this.avatarSvg.setAttribute('height', previewSize);
    }

    loadDefaultPalettes() {
        return [
            {
                name: "Vibrant",
                colors: [
                    { bg: "#FF6B6B", text: "#FFFFFF" },
                    { bg: "#4ECDC4", text: "#FFFFFF" },
                    { bg: "#45B7D1", text: "#FFFFFF" },
                    { bg: "#96CEB4", text: "#FFFFFF" },
                    { bg: "#FFEAA7", text: "#2D3436" },
                    { bg: "#DDA0DD", text: "#FFFFFF" }
                ]
            },
            {
                name: "Professional",
                colors: [
                    { bg: "#2C3E50", text: "#FFFFFF" },
                    { bg: "#34495E", text: "#FFFFFF" },
                    { bg: "#7F8C8D", text: "#FFFFFF" },
                    { bg: "#95A5A6", text: "#2C3E50" },
                    { bg: "#BDC3C7", text: "#2C3E50" },
                    { bg: "#ECF0F1", text: "#2C3E50" }
                ]
            },
            {
                name: "Nature",
                colors: [
                    { bg: "#27AE60", text: "#FFFFFF" },
                    { bg: "#2ECC71", text: "#FFFFFF" },
                    { bg: "#16A085", text: "#FFFFFF" },
                    { bg: "#1ABC9C", text: "#FFFFFF" },
                    { bg: "#55A3FF", text: "#FFFFFF" },
                    { bg: "#3498DB", text: "#FFFFFF" }
                ]
            },
            {
                name: "Warm",
                colors: [
                    { bg: "#E74C3C", text: "#FFFFFF" },
                    { bg: "#C0392B", text: "#FFFFFF" },
                    { bg: "#F39C12", text: "#FFFFFF" },
                    { bg: "#E67E22", text: "#FFFFFF" },
                    { bg: "#D35400", text: "#FFFFFF" },
                    { bg: "#A93226", text: "#FFFFFF" }
                ]
            },
            {
                name: "Pastel",
                colors: [
                    { bg: "#FFB3BA", text: "#2C3E50" },
                    { bg: "#FFDFBA", text: "#2C3E50" },
                    { bg: "#FFFFBA", text: "#2C3E50" },
                    { bg: "#BAFFC9", text: "#2C3E50" },
                    { bg: "#BAE1FF", text: "#2C3E50" },
                    { bg: "#E1BAFF", text: "#2C3E50" }
                ]
            },
            {
                name: "Dark",
                colors: [
                    { bg: "#1A1A1A", text: "#FFFFFF" },
                    { bg: "#2D2D2D", text: "#FFFFFF" },
                    { bg: "#404040", text: "#FFFFFF" },
                    { bg: "#4A4A4A", text: "#FFFFFF" },
                    { bg: "#5A5A5A", text: "#FFFFFF" },
                    { bg: "#6A6A6A", text: "#FFFFFF" }
                ]
            }
        ];
    }

    loadPalettes() {
        // Load custom palettes from localStorage
        const savedPalettes = localStorage.getItem('customPalettes');
        if (savedPalettes) {
            const customPalettes = JSON.parse(savedPalettes);
            this.palettes = [...this.loadDefaultPalettes(), ...customPalettes];
        } else {
            this.palettes = this.loadDefaultPalettes();
        }

        // Remove duplicates
        this.removeDuplicatePalettes();
        this.renderPalettes();
    }

    removeDuplicatePalettes() {
        const seen = new Set();
        this.palettes = this.palettes.filter(palette => {
            const key = palette.name;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    renderPalettes() {
        this.paletteGrid.innerHTML = '';
        
        this.palettes.forEach((palette, index) => {
            const paletteElement = document.createElement('div');
            paletteElement.className = 'palette';
            paletteElement.dataset.paletteIndex = index;
            
            const isCustom = true; // All palettes can be edited
            
            paletteElement.innerHTML = `
                <div class="palette-name">${palette.name}</div>
                <div class="palette-colors">
                    ${palette.colors.map(color => 
                        `<div class="palette-color" style="background: ${color.bg}; border-color: ${color.text};"></div>`
                    ).join('')}
                </div>
                ${isCustom ? '<button class="palette-edit-btn" title="Edit palette">✎</button>' : ''}
            `;
            
            
            paletteElement.addEventListener('click', (e) => {
                if (!e.target.classList.contains('palette-edit-btn')) {
                    // Check if it's a custom palette (double click to edit)
                    if (e.detail === 2 && isCustom) {
                        this.editPalette(index);
                    } else {
                        this.selectPalette(index);
                    }
                }
            });
            
            // Add edit button event
            const editBtn = paletteElement.querySelector('.palette-edit-btn');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editPalette(index);
                });
            }
            
            this.paletteGrid.appendChild(paletteElement);
        });

        // Select first palette by default
        if (this.palettes.length > 0 && !this.currentPalette) {
            this.selectPalette(0);
        }
    }

    selectPalette(index) {
        this.currentPalette = this.palettes[index];
        
        // Update active palette
        document.querySelectorAll('.palette').forEach(p => p.classList.remove('active'));
        document.querySelector(`[data-palette-index="${index}"]`).classList.add('active');
        
        // Reset preview colors when palette changes
        this.previewColors = this.getRandomColors();
        this.updatePreview();
    }

    getRandomColors() {
        if (!this.currentPalette || this.currentPalette.colors.length === 0) {
            return { bg: '#f39c12', text: '#ffffff' };
        }
        
        const randomColor = this.currentPalette.colors[Math.floor(Math.random() * this.currentPalette.colors.length)];
        return randomColor;
    }

    showPaletteModal() {
        this.paletteModal.style.display = 'flex';
        document.getElementById('palette-creator-title').textContent = 'Create New Palette';
        this.paletteNameInput.value = '';
        this.editingPaletteIndex = undefined;
        this.colorInputs.innerHTML = '';
        this.addColorInput();
    }

    hidePaletteModal() {
        this.paletteModal.style.display = 'none';
        this.editingPaletteIndex = undefined;
    }

    addColorInput(bgColor = '#f39c12', textColor = '#ffffff') {
        const colorRow = document.createElement('div');
        colorRow.className = 'color-input-row';
        colorRow.innerHTML = `
            <span class="color-input-label">Background:</span>
            <input type="color" class="color-input" value="${bgColor}">
            <span class="color-input-label">Text:</span>
            <input type="color" class="text-color-input" value="${textColor}">
            <button class="remove-color-btn" onclick="this.parentElement.remove()" title="Remove color">×</button>
        `;
        this.colorInputs.appendChild(colorRow);
    }

    saveCustomPalette() {
        const name = this.paletteNameInput.value.trim();
        if (!name) {
            alert('Please enter a name for the palette!');
            return;
        }

        const colorRows = this.colorInputs.querySelectorAll('.color-input-row');
        if (colorRows.length === 0) {
            alert('Please add at least one color!');
            return;
        }

        const colors = Array.from(colorRows).map(row => ({
            bg: row.querySelector('.color-input').value,
            text: row.querySelector('.text-color-input').value
        }));

        if (this.editingPaletteIndex !== undefined) {
            // Editing existing palette
            const defaultPalettes = this.loadDefaultPalettes();
            const isDefaultPalette = this.editingPaletteIndex < defaultPalettes.length;
            
            if (isDefaultPalette) {
                // If editing a default palette, create a new custom one
                const newPalette = { name: name + ' (Edited)', colors };
                this.palettes.push(newPalette);
            } else {
                // If editing a custom palette, update it
                this.palettes[this.editingPaletteIndex] = { name, colors };
            }
            this.editingPaletteIndex = undefined;
        } else {
            // Creating new palette
            const newPalette = { name, colors };
            this.palettes.push(newPalette);
        }
        
        // Save to localStorage (only custom palettes)
        const defaultPalettes = this.loadDefaultPalettes();
        const customPalettes = this.palettes.filter(p => !defaultPalettes.some(dp => dp.name === p.name));
        localStorage.setItem('customPalettes', JSON.stringify(customPalettes));
        
        this.renderPalettes();
        this.hidePaletteModal();
        
        // Select the palette (always select the last one if creating new or editing default)
        const paletteIndex = this.palettes.length - 1;
        this.selectPalette(paletteIndex);
    }

    editPalette(index) {
        const palette = this.palettes[index];
        this.editingPaletteIndex = index;
        
        const defaultPalettes = this.loadDefaultPalettes();
        const isDefaultPalette = index < defaultPalettes.length;
        
        this.paletteModal.style.display = 'flex';
        document.getElementById('palette-creator-title').textContent = isDefaultPalette ? 'Edit Palette (Will create a copy)' : 'Edit Palette';
        this.paletteNameInput.value = isDefaultPalette ? palette.name + ' (Edited)' : palette.name;
        
        this.colorInputs.innerHTML = '';
        palette.colors.forEach(color => {
            this.addColorInput(color.bg, color.text);
        });
    }

    addColorInput(bgColor = '#f39c12', textColor = '#ffffff') {
        const colorRow = document.createElement('div');
        colorRow.className = 'color-input-row';
        colorRow.innerHTML = `
            <span class="color-label">Background:</span>
            <input type="color" class="color-input" value="${bgColor}">
            <span class="color-label">Text:</span>
            <input type="color" class="text-color-input" value="${textColor}">
            <button class="remove-color-btn" onclick="this.parentElement.remove()" title="Remove color">×</button>
        `;
        this.colorInputs.appendChild(colorRow);
    }

    generateAllAvatars() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.generatedAvatars = [];
        
        // Clear previous generation stats
        const existingStats = this.generatedAvatarsSection.querySelector('.generation-stats');
        if (existingStats) {
            existingStats.remove();
        }
        
        // Clear the avatars grid
        this.avatarsGrid.innerHTML = '';
        
        this.progressSection.style.display = 'block';
        this.generateAllBtn.disabled = true;
        this.generateAllBtn.textContent = 'Generating...';

        const range = document.querySelector('input[name="range"]:checked').value;
        let avatarsToGenerate = [];

        if (range === 'single' || range === 'both') {
            // A-Z
            for (let i = 65; i <= 90; i++) {
                avatarsToGenerate.push(String.fromCharCode(i));
            }
        }

        if (range === 'double' || range === 'both') {
            // AA-ZZ
            for (let i = 65; i <= 90; i++) {
                for (let j = 65; j <= 90; j++) {
                    avatarsToGenerate.push(String.fromCharCode(i) + String.fromCharCode(j));
                }
            }
        }

        this.generateAvatarsBatch(avatarsToGenerate, 0);
    }

    async generateAvatarsBatch(avatarsToGenerate, currentIndex) {
        const batchSize = 20; // Aumentar para 20 avatares por vez para melhor performance
        const endIndex = Math.min(currentIndex + batchSize, avatarsToGenerate.length);

        for (let i = currentIndex; i < endIndex; i++) {
            const text = avatarsToGenerate[i];
            const colors = this.getRandomColors();
            const avatar = {
                text: text,
                bgColor: colors.bg,
                textColor: colors.text,
                size: this.currentSize,
                shape: this.currentShape,
                font: this.currentFont,
                borderEnabled: this.borderEnabled,
                borderWidth: this.borderWidth,
                borderColor: this.borderColor,
                borderStyle: this.borderStyle,
                borderOpacity: this.borderOpacity,
                timestamp: Date.now()
            };

            this.generatedAvatars.push(avatar);
            
            // Update progress
            const progress = ((i + 1) / avatarsToGenerate.length) * 100;
            this.progressText.textContent = `Generating avatar: ${text}`;
            this.progressCount.textContent = `${i + 1}/${avatarsToGenerate.length}`;
            this.progressFill.style.width = `${progress}%`;
        }

        if (endIndex < avatarsToGenerate.length) {
            // Continue with next batch
            setTimeout(() => {
                this.generateAvatarsBatch(avatarsToGenerate, endIndex);
            }, 30); // Reduzir delay para melhor performance
        } else {
            // Finished
            this.isGenerating = false;
            this.generateAllBtn.disabled = false;
            this.generateAllBtn.textContent = 'Generate All Avatars';
            this.progressText.textContent = `Completed! ${avatarsToGenerate.length} avatars generated`;
            this.displayGeneratedAvatars();
        }
    }

    displayGeneratedAvatars() {
        this.generatedAvatarsSection.style.display = 'block';
        this.avatarsGrid.innerHTML = '';

        // Show all avatares generated with batch rendering for better performance
        this.renderAvatarsBatch(0);
    }

    renderAvatarsBatch(startIndex) {
        const batchSize = 50; // Render 50 avatares at a time
        const endIndex = Math.min(startIndex + batchSize, this.generatedAvatars.length);

        for (let i = startIndex; i < endIndex; i++) {
            const avatar = this.generatedAvatars[i];
            const avatarItem = document.createElement('div');
            avatarItem.className = 'avatar-item';
            
            // Temporarily set effects for this avatar
            const originalBorderEnabled = this.borderEnabled;
            const originalBorderWidth = this.borderWidth;
            const originalBorderColor = this.borderColor;
            const originalBorderStyle = this.borderStyle;
            const originalBorderOpacity = this.borderOpacity;
            const originalFont = this.currentFont;
            
            this.borderEnabled = avatar.borderEnabled;
            this.borderWidth = avatar.borderWidth;
            this.borderColor = avatar.borderColor;
            this.borderStyle = avatar.borderStyle;
            this.borderOpacity = avatar.borderOpacity;
            this.currentFont = avatar.font;
            
            const svg = this.generateAvatarSVG(avatar.text, avatar.bgColor, avatar.textColor, 70, avatar.shape);
            
            // Restore original effects
            this.borderEnabled = originalBorderEnabled;
            this.borderWidth = originalBorderWidth;
            this.borderColor = originalBorderColor;
            this.borderStyle = originalBorderStyle;
            this.borderOpacity = originalBorderOpacity;
            this.currentFont = originalFont;
            avatarItem.appendChild(svg);
            
            const textDiv = document.createElement('div');
            textDiv.className = 'avatar-text';
            textDiv.textContent = avatar.text;
            avatarItem.appendChild(textDiv);
            
            this.avatarsGrid.appendChild(avatarItem);
        }

        // Continue with next batch if there are more avatares
        if (endIndex < this.generatedAvatars.length) {
            setTimeout(() => {
                this.renderAvatarsBatch(endIndex);
            }, 10);
        } else {
            // All avatares rendered, show stats
            this.showGenerationStats();
        }
    }

    showGenerationStats() {
        const statsDiv = document.createElement('div');
        statsDiv.className = 'generation-stats';
        statsDiv.innerHTML = `
            <h4>Generation Statistics</h4>
            <p><strong>Total avatars:</strong> ${this.generatedAvatars.length}</p>
            <p><strong>Shape:</strong> ${this.currentShape}</p>
            <p><strong>Size:</strong> ${this.currentSize}x${this.currentSize}px</p>
            <p><strong>Font:</strong> ${this.currentFont}</p>
            <p><strong>Palette:</strong> ${this.currentPalette ? this.currentPalette.name : 'None'}</p>
        `;
        this.generatedAvatarsSection.appendChild(statsDiv);
    }

    svgToPng(svg, size) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            canvas.width = size;
            canvas.height = size;
            
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            
            img.onload = () => {
                ctx.drawImage(img, 0, 0, size, size);
                canvas.toBlob(resolve);
                URL.revokeObjectURL(url);
            };
            
            img.src = url;
        });
    }

    async downloadSingle() {
        if (!this.currentText.trim()) {
            alert('Please enter text for the avatar!');
            return;
        }

        const colors = this.getRandomColors();
        const svg = this.generateAvatarSVG(this.currentText, colors.bg, colors.text, this.currentSize, this.currentShape);
        
        if (this.downloadFormat === 'svg') {
            this.downloadSVG(svg, this.currentText);
        } else {
            const pngBlob = await this.svgToPng(svg, this.currentSize);
            this.downloadPNG(pngBlob, this.currentText);
        }
    }

    downloadSVG(svg, text) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        
        const link = document.createElement('a');
        link.download = `avatar-${text}-${Date.now()}.svg`;
        link.href = URL.createObjectURL(svgBlob);
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    downloadPNG(pngBlob, text) {
        const link = document.createElement('a');
        link.download = `avatar-${text}-${Date.now()}.png`;
        link.href = URL.createObjectURL(pngBlob);
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    updateDownloadButtonText() {
        const format = this.downloadFormat.toUpperCase();
        this.downloadSingleBtn.textContent = `Download Preview (${format})`;
    }

    async downloadZip() {
        if (this.generatedAvatars.length === 0) {
            alert('Please generate at least one avatar before downloading the ZIP!');
            return;
        }

        this.downloadZipBtn.innerHTML = '<span class="loading"></span> Generating ZIP...';
        this.downloadZipBtn.disabled = true;

        try {
            const zip = new JSZip();
            
            for (let i = 0; i < this.generatedAvatars.length; i++) {
                const avatar = this.generatedAvatars[i];
                
                // Temporarily set effects for this avatar
                const originalBorderEnabled = this.borderEnabled;
                const originalBorderWidth = this.borderWidth;
                const originalBorderColor = this.borderColor;
                const originalBorderStyle = this.borderStyle;
                const originalBorderOpacity = this.borderOpacity;
                const originalFont = this.currentFont;
                
                this.borderEnabled = avatar.borderEnabled;
                this.borderWidth = avatar.borderWidth;
                this.borderColor = avatar.borderColor;
                this.borderStyle = avatar.borderStyle;
                this.borderOpacity = avatar.borderOpacity;
                this.currentFont = avatar.font;
                
                const svg = this.generateAvatarSVG(avatar.text, avatar.bgColor, avatar.textColor, avatar.size, avatar.shape);
                
                if (this.downloadFormat === 'svg') {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                    const filename = `avatar-${avatar.text}-${i + 1}.svg`;
                    zip.file(filename, svgBlob);
                } else {
                    const pngBlob = await this.svgToPng(svg, avatar.size);
                    const filename = `avatar-${avatar.text}-${i + 1}.png`;
                    zip.file(filename, pngBlob);
                }
                
                // Restore original effects
                this.borderEnabled = originalBorderEnabled;
                this.borderWidth = originalBorderWidth;
                this.borderColor = originalBorderColor;
                this.borderStyle = originalBorderStyle;
                this.borderOpacity = originalBorderOpacity;
                this.currentFont = originalFont;
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            
            const link = document.createElement('a');
            link.download = `avatars-${this.downloadFormat.toUpperCase()}-${Date.now()}.zip`;
            link.href = URL.createObjectURL(zipBlob);
            link.click();
            
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error generating ZIP:', error);
            alert('Error generating ZIP file. Please try again.');
        } finally {
            this.downloadZipBtn.innerHTML = 'Download ZIP';
            this.downloadZipBtn.disabled = false;
        }
    }
}

// Initialize the avatar generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AvatarGenerator();
});