class BubbleDesigner {
    constructor(options = {}) {
        this.options = {
            container: 'designer-container',
            width: 1000,
            height: 600,
            ...options
        };
        
        this.stickers = [
            '❤️', '⭐', '🔥', '🎉', '💡', '🖼️',
            '👍', '👎', '😊', '😂', '😍', '🎈',
            '✨', '🎁', '🎂', '🎄', '🎃', '🎓'
        ];
        
        this.init();
    }
    
    init() {
        console.log('Initializing BubbleDesigner with options:', this.options);
        this.createStyles();
        this.createHTML();
        this.initFabric();
        this.setupEventListeners();
        console.log('BubbleDesigner initialized successfully');
    }
    
    createStyles() {
        const style = document.createElement('style');
        style.id = 'bubble-designer-styles';
        style.textContent = `
            /* Main Container */
            .bubble-designer {
                --primary: #4A6CF7;
                --primary-hover: #3a5ce4;
                --sidebar-bg: #1E1E2D;
                --sidebar-text: #9899AC;
                --sidebar-hover: #2A2B3D;
                --border-color: #2D2D3D;
                --content-bg: #151521;
                --danger: #ff4d4f;
                --danger-hover: #ff7875;
                --success: #52c41a;
                --warning: #faad14;
                --info: #1890ff;
                --white: #ffffff;
                --black: #000000;
                --gray-1: #f0f0f0;
                --gray-2: #d9d9d9;
                --gray-3: #bfbfbf;
                --gray-4: #8c8c8c;
                --gray-5: #595959;
                --gray-6: #262626;
                --gray-7: #141414;
                --shadow-1: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
                --shadow-2: 0 1px 8px 0 rgba(0, 0, 0, 0.06);
                --shadow-3: 0 2px 15px 0 rgba(0, 0, 0, 0.08);
                --shadow-4: 0 4px 12px 0 rgba(0, 0, 0, 0.09);
                --shadow-5: 0 10px 25px 0 rgba(0, 0, 0, 0.1);
                --transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
                --border-radius-sm: 2px;
                --border-radius: 4px;
                --border-radius-lg: 8px;
                --border-radius-xl: 16px;
                --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                --font-size-xs: 12px;
                --font-size-sm: 14px;
                --font-size: 16px;
                --font-size-lg: 18px;
                --font-size-xl: 20px;
                --font-size-xxl: 24px;
                --line-height: 1.5;
                --spacing-xxs: 4px;
                --spacing-xs: 8px;
                --spacing-sm: 12px;
                --spacing: 16px;
                --spacing-md: 20px;
                --spacing-lg: 24px;
                --spacing-xl: 32px;
                --spacing-xxl: 48px;
                --zindex-dropdown: 1000;
                --zindex-sticky: 1020;
                --zindex-fixed: 1030;
                --zindex-modal: 1040;
                --zindex-popover: 1050;
                --zindex-tooltip: 1060;
                
                display: flex;
                flex-direction: column;
                height: 100vh;
                background: var(--content-bg);
                color: var(--white);
                font-family: var(--font-family);
                font-size: var(--font-size);
                line-height: var(--line-height);
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeLegibility;
                overflow: hidden;
            }
            
            /* Top Bar */
            .bubble-topbar {
                height: 64px;
                background: var(--sidebar-bg);
                border-bottom: 1px solid var(--border-color);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 24px;
                flex-shrink: 0;
                box-shadow: var(--shadow-1);
                z-index: var(--zindex-fixed);
            }
            
            .bubble-logo {
                display: flex;
                align-items: center;
                gap: 12px;
                font-weight: 600;
                font-size: var(--font-size-xl);
                color: var(--white);
            }
            
            .bubble-logo i {
                color: var(--primary);
                font-size: 1.2em;
            }
            
            .sticker-item:active {
                transform: scale(0.95);
            }
            
            /* Notifications */
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--sidebar-bg);
                color: white;
                padding: 12px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-3);
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                border-left: 4px solid var(--primary);
            }
            
            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .notification.success {
                border-left-color: var(--success);
            }
            
            .notification.error {
                border-left-color: var(--danger);
            }
            
            .notification.warning {
                border-left-color: var(--warning);
            }
            
            .notification i {
                font-size: 18px;
            }
            
            .notification.success i {
                color: var(--success);
            }
            
            .notification.error i {
                color: var(--danger);
            }
            
            .notification.warning i {
                color: var(--warning);
            }
            
            .topbar-actions {
                display: flex;
                gap: 8px;
            }
            
            .topbar-btn {
                width: 36px;
                height: 36px;
                border-radius: var(--border-radius);
                background: transparent;
                border: 1px solid var(--border-color);
                color: var(--sidebar-text);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
            }
            
            .topbar-btn:hover {
                background: var(--sidebar-hover);
                color: var(--white);
                border-color: var(--primary);
            }
            
            .topbar-btn i {
                font-size: 16px;
            }
            
            /* Main Content */
            .bubble-main-content {
                display: flex;
                flex: 1;
                overflow: hidden;
            }
            
            /* Left Sidebar */
            .bubble-sidebar {
                width: 280px;
                background: var(--sidebar-bg);
                border-right: 1px solid var(--border-color);
                padding: var(--spacing);
                overflow-y: auto;
                flex-shrink: 0;
                scrollbar-width: thin;
                scrollbar-color: var(--border-color) transparent;
            }
            
            .bubble-sidebar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            
            .bubble-sidebar::-webkit-scrollbar-thumb {
                background-color: var(--border-color);
                border-radius: 3px;
            }
            
            .bubble-sidebar::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .bubble-sidebar-section {
                margin-bottom: var(--spacing-lg);
                background: rgba(255, 255, 255, 0.03);
                border-radius: var(--border-radius);
                padding: var(--spacing-sm);
                border: 1px solid var(--border-color);
            }
            
            .bubble-sidebar-section:last-child {
                margin-bottom: 0;
            }
            
            .bubble-sidebar-title {
                color: var(--sidebar-text);
                font-size: var(--font-size-xs);
                font-weight: 600;
                text-transform: uppercase;
                margin: 0 0 var(--spacing-sm) 0;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            
            .bubble-sidebar-btn {
                width: 100%;
                background: var(--sidebar-hover);
                border: 1px solid var(--border-color);
                color: var(--sidebar-text);
                padding: var(--spacing-sm) var(--spacing);
                border-radius: var(--border-radius);
                margin-bottom: var(--spacing-xs);
                text-align: left;
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                font-size: var(--font-size-sm);
                transition: var(--transition);
                position: relative;
                overflow: hidden;
            }
            
            .bubble-sidebar-btn:hover {
                background: rgba(255, 255, 255, 0.05);
                border-color: var(--primary);
                color: var(--white);
            }
            
            .bubble-sidebar-btn i {
                width: 20px;
                text-align: center;
                font-size: 14px;
                opacity: 0.8;
            }
            
            .bubble-sidebar-btn:hover i {
                opacity: 1;
            }
            
            /* Canvas Area */
            .bubble-canvas-container {
                flex: 1;
                background: var(--gray-7);
                background-image: 
                    linear-gradient(45deg, var(--gray-6) 25%, transparent 25%),
                    linear-gradient(-45deg, var(--gray-6) 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, var(--gray-6) 75%),
                    linear-gradient(-45deg, transparent 75%, var(--gray-6) 75%);
                background-size: 20px 20px;
                background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: auto;
                padding: var(--spacing);
                position: relative;
            }
            
            .bubble-canvas-wrapper {
                background: white;
                box-shadow: var(--shadow-5);
                border-radius: var(--border-radius);
                overflow: hidden;
                position: relative;
                transition: all 0.3s ease;
            }
            
            .bubble-canvas-wrapper canvas {
                display: block;
            }
            
            /* Right Sidebar */
            .bubble-right-sidebar {
                width: 320px;
                background: var(--sidebar-bg);
                border-left: 1px solid var(--border-color);
                padding: var(--spacing);
                overflow-y: auto;
                flex-shrink: 0;
                scrollbar-width: thin;
                scrollbar-color: var(--border-color) transparent;
            }
            
            .bubble-right-sidebar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            
            .bubble-right-sidebar::-webkit-scrollbar-thumb {
                background-color: var(--border-color);
                border-radius: 3px;
            }
            
            .bubble-right-sidebar::-webkit-scrollbar-track {
                background: transparent;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    createHTML() {
        const container = document.getElementById(this.options.container);
        if (!container) {
            console.error('Container element not found:', this.options.container);
            return;
        }
        
        // Generate sticker grid HTML
        const stickerGrid = this.stickers.map(sticker => 
            `<div class="sticker-item" data-sticker="${sticker}">${sticker}</div>`
        ).join('');
        
        container.className = 'bubble-designer';
        container.innerHTML = `
            <!-- Top Bar -->
            <div class="bubble-topbar">
                <div class="bubble-logo">
                    <i class="fas fa-palette"></i>
                    <span>Bubble Designer</span>
                </div>
                <div class="topbar-actions">
                    <button id="save-btn" class="topbar-btn" title="Save Design">
                        <i class="fas fa-save"></i>
                    </button>
                    <button id="clear-btn" class="topbar-btn" title="Clear Canvas">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="bubble-main-content">
                <!-- Left Sidebar -->
                <div class="bubble-sidebar">
                    <div class="bubble-sidebar-section">
                        <div class="bubble-sidebar-title">Elements</div>
                        <button class="bubble-sidebar-btn" data-element="text">
                            <i class="fas fa-font"></i>
                            Text
                        </button>
                        <button class="bubble-sidebar-btn" data-element="button">
                            <i class="fas fa-square"></i>
                            Button
                        </button>
                        <button class="bubble-sidebar-btn" data-element="rectangle">
                            <i class="far fa-square"></i>
                            Rectangle
                        </button>
                        <button class="bubble-sidebar-btn" data-element="circle">
                            <i class="far fa-circle"></i>
                            Circle
                        </button>
                        <button class="bubble-sidebar-btn" data-element="image">
                            <i class="fas fa-image"></i>
                            Image
                        </button>
                    </div>
                    
                    <div class="bubble-sidebar-section">
                        <div class="bubble-sidebar-title">Stickers</div>
                        <div class="sticker-grid">
                            ${stickerGrid}
                        </div>
                        <button id="upload-sticker" class="bubble-sidebar-btn" style="margin-top: 10px;">
                            <i class="fas fa-plus"></i>
                            Add Custom Sticker
                        </button>
                        <input type="file" id="sticker-upload" accept="image/*" style="display: none;">
                    </div>
                </div>
                
                <!-- Canvas Area -->
                <div class="bubble-canvas-container">
                    <div class="bubble-canvas-wrapper">
                        <canvas id="design-canvas"></canvas>
                    </div>
                </div>
                
                <!-- Right Sidebar - Properties Panel -->
                <div class="bubble-right-sidebar">
                    <div class="properties-panel" id="properties-panel">
                        <p>Select an element to edit its properties</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    initFabric() {
        this.canvas = new fabric.Canvas('design-canvas', {
            width: this.options.width,
            height: this.options.height,
            backgroundColor: '#ffffff'
        });

        // Add Fabric.js selection event listeners here (canvas is now initialized)
        this.canvas.on('selection:created', this.updatePropertiesPanel.bind(this));
        this.canvas.on('selection:updated', this.updatePropertiesPanel.bind(this));
        this.canvas.on('selection:cleared', this.clearPropertiesPanel.bind(this));

        // Add sample text
        const text = new fabric.IText('Click to edit text', {
            left: 100,
            top: 100,
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#000000'
        });
        
        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        this.canvas.renderAll();
    }
    
    setupEventListeners() {
        // Add element buttons
        document.querySelectorAll('.bubble-sidebar-btn[data-element]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const elementType = e.currentTarget.dataset.element;
                this.addElement(elementType);
            });
        });

        // Sticker click handler
        document.querySelectorAll('.sticker-item').forEach(sticker => {
            sticker.addEventListener('click', (e) => {
                const emoji = e.currentTarget.dataset.sticker;
                this.addSticker(emoji);
            });
        });

        // Sticker upload
        const uploadBtn = document.getElementById('upload-sticker');
        const fileInput = document.getElementById('sticker-upload');
        
        uploadBtn?.addEventListener('click', () => fileInput?.click());
        
        fileInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.addImageSticker(event.target.result);
                };
                reader.readAsDataURL(file);
            }
            // Reset the input to allow uploading the same file again
            fileInput.value = '';
        });

        // Save and clear buttons
        document.getElementById('save-btn')?.addEventListener('click', () => this.saveDesign());
        document.getElementById('clear-btn')?.addEventListener('click', () => this.clearCanvas());
        // (Canvas event listeners moved to initFabric)
    }

    addElement(type) {
        let element;
        const left = 100 + Math.random() * 50; // Slight offset for multiple adds
        const top = 100 + Math.random() * 50;
        
        switch(type) {
            case 'text':
                element = new fabric.IText('Double click to edit', {
                    left: left,
                    top: top,
                    fontFamily: 'Arial',
                    fontSize: 24,
                    fill: '#000000',
                    type: 'text'
                });
                break;
                
            case 'button':
                const btnBg = new fabric.Rect({
                    width: 120,
                    height: 40,
                    fill: '#4A6CF7',
                    rx: 4,
                    ry: 4,
                    selectable: false
                });
                
                const btnText = new fabric.IText('Button', {
                    fontSize: 14,
                    fill: '#ffffff',
                    originX: 'center',
                    originY: 'center',
                    selectable: false
                });
                
                element = new fabric.Group([btnBg, btnText], {
                    left: left,
                    top: top,
                    type: 'button'
                });
                break;
                
            case 'rectangle':
                element = new fabric.Rect({
                    left: left,
                    top: top,
                    width: 150,
                    height: 100,
                    fill: '#4A6CF7',
                    stroke: '#3a5ce4',
                    strokeWidth: 1,
                    type: 'shape'
                });
                break;
                
            case 'circle':
                element = new fabric.Circle({
                    left: left,
                    top: top,
                    radius: 50,
                    fill: '#4A6CF7',
                    stroke: '#3a5ce4',
                    strokeWidth: 1,
                    type: 'shape'
                });
                break;
                
            case 'image':
                const imgUrl = prompt('Enter image URL:');
                if (!imgUrl) return;
                
                fabric.Image.fromURL(imgUrl, (img) => {
                    img.set({
                        left: left,
                        top: top,
                        type: 'image',
                        scaleX: 0.5,
                        scaleY: 0.5
                    });
                    this.canvas.add(img);
                    this.canvas.setActiveObject(img);
                    this.canvas.renderAll();
                });
                return;
                
            default:
                console.warn('Unknown element type:', type);
                return;
        }
        
        this.canvas.add(element);
        this.canvas.setActiveObject(element);
        this.canvas.renderAll();
    }
    
    addSticker(emoji) {
        const center = this.canvas.getCenter();
        const text = new fabric.Text(emoji, {
            left: center.left,
            top: center.top,
            fontSize: 64,
            fontFamily: 'Arial',
            type: 'sticker',
            originX: 'center',
            originY: 'center'
        });
        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        text.bringToFront();
        this.canvas.renderAll();
    }
    
    addImageSticker(dataUrl) {
        fabric.Image.fromURL(dataUrl, (img) => {
            // Center the image
            const center = this.canvas.getCenter();
            img.set({
                left: center.left,
                top: center.top,
                originX: 'center',
                originY: 'center',
                type: 'sticker'
            });
            // Scale to fit if too large
            const maxWidth = this.canvas.width * 0.4;
            const maxHeight = this.canvas.height * 0.4;
            let scale = 1;
            if (img.width > maxWidth || img.height > maxHeight) {
                scale = Math.min(maxWidth / img.width, maxHeight / img.height);
            }
            img.scale(scale);
            this.canvas.add(img);
            this.canvas.setActiveObject(img);
            img.bringToFront();
            this.canvas.renderAll();
        });
    }
    
    updatePropertiesPanel() {
        const panel = document.getElementById('properties-panel');
        const activeObject = this.canvas.getActiveObject();
        
        if (!activeObject) {
            panel.innerHTML = '<p>Select an element to edit its properties</p>';
            return;
        }
        let html = `<div class="property-group">
            <h4>Selected: ${activeObject.type.charAt(0).toUpperCase() + activeObject.type.slice(1)}</h4>
            <div class="property-row"><span class="property-label">X</span><input type="number" class="property-input" data-property="left" value="${Math.round(activeObject.left)}"></div>
            <div class="property-row"><span class="property-label">Y</span><input type="number" class="property-input" data-property="top" value="${Math.round(activeObject.top)}"></div>
            <div class="property-row"><span class="property-label">Width</span><input type="number" class="property-input" data-property="width" value="${Math.round((activeObject.type==='circle'?activeObject.radius*2:(activeObject.width * (activeObject.scaleX || 1))))}"></div>
            <div class="property-row"><span class="property-label">Height</span><input type="number" class="property-input" data-property="height" value="${Math.round((activeObject.type==='circle'?activeObject.radius*2:(activeObject.height * (activeObject.scaleY || 1))))}"></div>
            <div class="property-row"><span class="property-label">Rotation</span><input type="number" class="property-input" data-property="angle" value="${Math.round(activeObject.angle || 0)}"></div>
            <div class="property-row"><span class="property-label">Opacity</span><input type="range" min="0" max="1" step="0.01" class="property-input" data-property="opacity" value="${activeObject.opacity ?? 1}"></div>
            <div class="property-row"><span class="property-label">Lock</span><input type="checkbox" class="property-input" data-property="lockMovement" ${activeObject.lockMovementX && activeObject.lockMovementY ? 'checked' : ''}></div>
        </div>`;
        // Text-specific options
        if (activeObject.type === 'text' || activeObject.type === 'i-text') {
            html += `<div class="property-group"><h4>Text</h4>
                <div class="property-row"><span class="property-label">Content</span><input type="text" class="property-input" data-property="text" value="${activeObject.text ?? ''}"></div>
                <div class="property-row"><span class="property-label">Font Size</span><input type="number" class="property-input" data-property="fontSize" value="${activeObject.fontSize ?? 24}"></div>
                <div class="property-row"><span class="property-label">Font Family</span>${this.getFontDropdown('fontFamily', activeObject.fontFamily ?? 'Arial')}</div>
                <div class="property-row"><span class="property-label">Color</span><input type="color" class="property-input" data-property="fill" value="${this.rgbToHex(activeObject.fill || '#000000')}"></div>
                <div class="property-row"><span class="property-label">Align</span><select class="property-input" data-property="textAlign">
                    <option value="left" ${activeObject.textAlign === 'left' ? 'selected' : ''}>Left</option>
                    <option value="center" ${activeObject.textAlign === 'center' ? 'selected' : ''}>Center</option>
                    <option value="right" ${activeObject.textAlign === 'right' ? 'selected' : ''}>Right</option>
                </select></div>
                <div class="property-row"><span class="property-label">Padding</span><input type="number" min="0" class="property-input" data-property="padding" value="${activeObject.padding ?? 0}"></div>
            </div>`;
        }
        // Shape-specific options
        if (activeObject.type === 'rect' || activeObject.type === 'circle') {
            html += `<div class="property-group"><h4>Shape</h4>
                <div class="property-row"><span class="property-label">Fill</span><input type="color" class="property-input" data-property="fill" value="${this.rgbToHex(activeObject.fill || '#4A6CF7')}"></div>
                <div class="property-row"><span class="property-label">Stroke</span><input type="color" class="property-input" data-property="stroke" value="${this.rgbToHex(activeObject.stroke || '#3a5ce4')}"></div>
                <div class="property-row"><span class="property-label">Stroke Width</span><input type="number" class="property-input" data-property="strokeWidth" value="${activeObject.strokeWidth ?? 1}"></div>
                <div class="property-row"><span class="property-label">Padding</span><input type="number" min="0" class="property-input" data-property="padding" value="${activeObject.padding ?? 0}"></div>
            </div>`;
        }
        // Button group (fabric.Group) options
        if (activeObject.type === 'group') {
            html += `<div class="property-group"><h4>Button</h4>
                <div class="property-row"><span class="property-label">BG Color</span><input type="color" class="property-input" data-property="fill" data-target="bg" value="${this.rgbToHex(activeObject._objects[0].fill || '#4A6CF7')}"></div>
                <div class="property-row"><span class="property-label">Text Color</span><input type="color" class="property-input" data-property="fill" data-target="text" value="${this.rgbToHex(activeObject._objects[1].fill || '#ffffff')}"></div>
                <div class="property-row"><span class="property-label">Text</span><input type="text" class="property-input" data-property="text" data-target="text" value="${activeObject._objects[1].text ?? 'Button'}"></div>
                <div class="property-row"><span class="property-label">Font Size</span><input type="number" class="property-input" data-property="fontSize" data-target="text" value="${activeObject._objects[1].fontSize ?? 14}"></div>
                <div class="property-row"><span class="property-label">Font Family</span>${this.getFontDropdown('fontFamily', activeObject._objects[1].fontFamily ?? 'Arial', 'text')}</div>
                <div class="property-row"><span class="property-label">Padding</span><input type="number" min="0" class="property-input" data-property="padding" data-target="bg" value="${activeObject._objects[0].padding ?? 0}"></div>
            </div>`;
        }
        // Image-specific options
        if (activeObject.type === 'image' || activeObject.type === 'sticker') {
            html += `<div class="property-group"><h4>Image</h4>
                <div class="property-row"><span class="property-label">Scale X</span><input type="number" step="0.01" class="property-input" data-property="scaleX" value="${activeObject.scaleX ?? 1}"></div>
                <div class="property-row"><span class="property-label">Scale Y</span><input type="number" step="0.01" class="property-input" data-property="scaleY" value="${activeObject.scaleY ?? 1}"></div>
            </div>`;
        }
        html += `<div style='text-align:right;margin-top:12px;'><button class="property-delete-btn" style="background:#ff4d4f;color:#fff;border:none;border-radius:6px;padding:6px 16px;cursor:pointer;font-weight:600;font-size:1em;"><i class="fas fa-trash"></i> Delete</button></div>`;
        panel.innerHTML = html;
        // Add event listeners
        panel.querySelectorAll('.property-input').forEach(input => {
            input.addEventListener('change', this.handlePropertyChange.bind(this));
        });
        // Delete button
        const delBtn = panel.querySelector('.property-delete-btn');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                const obj = this.canvas.getActiveObject();
                if (obj) {
                    this.canvas.remove(obj);
                    this.clearPropertiesPanel();
                }
            });
        }
    }
    
    rgbToHex(color) {
        if (!color) return '#000000';
        if (color[0] === '#') return color;
        const rgb = color.match(/\d+/g);
        if (!rgb) return '#000000';
        return '#' + rgb.slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('');
    }

    clearPropertiesPanel() {
        const panel = document.getElementById('properties-panel');
        panel.innerHTML = '<p>Select an element to edit its properties</p>';
    }

    // --- Sidebar Stickers Dropdown ---
    enableStickersDropdown() {
        const section = document.querySelector('.bubble-sidebar-section:nth-child(2)');
        if (!section) return;
        let title = section.querySelector('.bubble-sidebar-title');
        let grid = section.querySelector('.sticker-grid');
        let uploadBtn = section.querySelector('#upload-sticker');
        let input = section.querySelector('#sticker-upload');
        if (!title || !grid) return;
        // Add dropdown arrow
        if (!title.querySelector('.dropdown-arrow')) {
            const arrow = document.createElement('span');
            arrow.className = 'dropdown-arrow';
            arrow.innerHTML = '&#9660;';
            arrow.style.marginLeft = '8px';
            title.appendChild(arrow);
        }
        title.style.cursor = 'pointer';
        title.addEventListener('click', () => {
            const isOpen = grid.style.display !== 'none';
            grid.style.display = isOpen ? 'none' : '';
            if (uploadBtn) uploadBtn.style.display = isOpen ? 'none' : '';
            if (input) input.style.display = isOpen ? 'none' : '';
            title.querySelector('.dropdown-arrow').style.transform = isOpen ? 'rotate(-90deg)' : 'rotate(0deg)';
        });
    }

    // --- Font Dropdown Helper ---
    getFontDropdown(property, current, target) {
        // 30+ popular web fonts
        const fonts = [
            'Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 'Brush Script MT',
            'Impact', 'Comic Sans MS', 'Lucida Sans', 'Lucida Console', 'Palatino', 'Optima', 'Candara', 'Geneva', 'Franklin Gothic Medium',
            'Gill Sans', 'Futura', 'Rockwell', 'Baskerville', 'Consolas', 'Monaco', 'Copperplate', 'Papyrus', 'Segoe UI', 'Roboto',
            'Lato', 'Montserrat', 'Oswald', 'Raleway', 'Merriweather', 'Nunito', 'Quicksand', 'Poppins', 'Dancing Script', 'Bebas Neue', 'Rubik', 'Mukta', 'PT Sans', 'Source Sans Pro', 'Playfair Display', 'Anton', 'Pacifico', 'Caveat', 'Orbitron', 'Archivo Black', 'Josefin Sans'
        ];
        let html = `<select class="property-input" data-property="${property}"${target ? ` data-target="${target}"` : ''}>`;
        fonts.forEach(font => {
            html += `<option value="${font}"${current && font.toLowerCase() === current.toLowerCase() ? ' selected' : ''} style="font-family:${font};">${font}</option>`;
        });
        html += '</select>';
        return html;
    }

    // --- Handle Property Changes ---
    handlePropertyChange(e) {
        const property = e.target.dataset.property;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;

        // Width/height logic for all types
        if (property === 'width') {
            if (activeObject.type === 'rect') {
                activeObject.set({ width: parseFloat(value), scaleX: 1 });
                activeObject.setCoords && activeObject.setCoords();
            } else if (activeObject.type === 'circle') {
                activeObject.set({ radius: parseFloat(value) / 2, scaleX: 1 });
                activeObject.setCoords && activeObject.setCoords();
            } else if (activeObject.type === 'image' || activeObject.type === 'sticker') {
                activeObject.set('scaleX', parseFloat(value) / activeObject.width);
            } else if (activeObject.type === 'text' || activeObject.type === 'i-text') {
                activeObject.set({ width: parseFloat(value), scaleX: 1 });
                activeObject.setCoords && activeObject.setCoords();
            } else if (activeObject.type === 'group') {
                activeObject.set('scaleX', parseFloat(value) / activeObject.width);
            }
        } else if (property === 'height') {
            if (activeObject.type === 'rect') {
                activeObject.set({ height: parseFloat(value), scaleY: 1 });
                activeObject.setCoords && activeObject.setCoords();
            } else if (activeObject.type === 'circle') {
                activeObject.set({ radius: parseFloat(value) / 2, scaleY: 1 });
                activeObject.setCoords && activeObject.setCoords();
            } else if (activeObject.type === 'image' || activeObject.type === 'sticker') {
                activeObject.set('scaleY', parseFloat(value) / activeObject.height);
            } else if (activeObject.type === 'text' || activeObject.type === 'i-text') {
                // Change font size for height (approximate)
                activeObject.set('fontSize', parseFloat(value));
                activeObject.setCoords && activeObject.setCoords();
            } else if (activeObject.type === 'group') {
                activeObject.set('scaleY', parseFloat(value) / activeObject.height);
            }
        } else if (property === 'padding') {
            if (activeObject.type === 'text' || activeObject.type === 'i-text' || activeObject.type === 'rect' || activeObject.type === 'circle') {
                activeObject.set('padding', parseFloat(value));
                activeObject.setCoords && activeObject.setCoords();
            } else if (activeObject.type === 'group') {
                // For button, apply padding to bg rect
                if (e.target.dataset.target === 'bg') {
                    activeObject._objects[0].set('padding', parseFloat(value));
                    activeObject._objects[0].setCoords && activeObject._objects[0].setCoords();
                }
                activeObject.setCoords && activeObject.setCoords();
            }
        } else if (property === 'left' || property === 'top') {
            activeObject.set(property, parseFloat(value));
        } else if (property === 'scaleX' || property === 'scaleY' || property === 'opacity' || property === 'angle' || property === 'fontSize' || property === 'strokeWidth') {
            activeObject.set(property, parseFloat(value));
        } else if (property === 'fill' || property === 'stroke' || property === 'fontFamily' || property === 'text' || property === 'textAlign') {
            // Special handling for button group (change bg or text color)
            if (activeObject.type === 'group') {
                // Assume first is bg, second is text
                if (property === 'fill') {
                    if (e.target.dataset.target === 'bg') {
                        activeObject._objects[0].set('fill', value);
                    } else if (e.target.dataset.target === 'text') {
                        activeObject._objects[1].set('fill', value);
                    }
                } else if (property === 'text') {
                    activeObject._objects[1].set('text', value);
                } else if (property === 'fontSize') {
                    activeObject._objects[1].set('fontSize', parseFloat(value));
                } else if (property === 'fontFamily') {
                    activeObject._objects[1].set('fontFamily', value);
                }
                activeObject._objects.forEach(obj => obj.setCoords && obj.setCoords());
                activeObject.setCoords && activeObject.setCoords();
            } else {
                activeObject.set(property, value);
            }
        } else if (property === 'lockMovement') {
            activeObject.set({
                lockMovementX: value,
                lockMovementY: value
            });
        }
        this.canvas.requestRenderAll();
    }
}

// --- Improved Modern CSS for Properties Panel and Sidebar ---
(function() {
    const style = document.createElement('style');
    style.textContent = `
    .properties-panel {
        padding: 18px 14px 18px 18px;
        background: #232336;
        border-radius: 12px;
        box-shadow: 0 2px 16px 0 #0002;
        min-width: 260px;
        color: #fff;
        font-family: inherit;
    }
    .property-group {
        margin-bottom: 18px;
        padding-bottom: 10px;
        border-bottom: 1px solid #35354c;
    }
    .property-group:last-child {
        border-bottom: none;
    }
    .property-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        gap: 10px;
    }
    .property-label {
        min-width: 70px;
        color: #b3b3c6;
        font-size: 0.98em;
    }
    .property-input[type="number"],
    .property-input[type="text"],
    .property-input[type="color"],
    .property-input select {
        flex: 1;
        border: none;
        outline: none;
        border-radius: 6px;
        padding: 6px 8px;
        background: #292947;
        color: #fff;
        font-size: 1em;
        margin-left: 8px;
    }
    .property-input[type="range"] {
        flex: 1;
        margin-left: 8px;
    }
    .property-input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: #4A6CF7;
        margin-left: 8px;
    }
    .bubble-sidebar-section {
        margin-bottom: 24px;
        background: #232336;
        border-radius: 10px;
        box-shadow: 0 1px 8px 0 #0001;
        padding: 12px 10px 10px 10px;
    }
    .bubble-sidebar-title {
        font-weight: 600;
        font-size: 1.09em;
        color: #fff;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .dropdown-arrow {
        margin-left: 8px;
        font-size: 1em;
        transition: transform 0.2s;
    }
    .sticker-grid {
        margin-top: 8px;
        transition: height 0.2s;
    }
    `;
    document.head.appendChild(style);
})();


// Make it available globally
window.BubbleDesigner = BubbleDesigner;

document.addEventListener('DOMContentLoaded', () => {
    // If initialized via auto or manually, enable stickers dropdown logic
    setTimeout(() => {
        if (window.BubbleDesigner) {
            try {
                const designer = document.getElementById('designer-container');
                if (designer && designer.BubbleDesignerInstance) {
                    designer.BubbleDesignerInstance.enableStickersDropdown();
                } else {
                    // fallback: try to enable for the first instance
                    const instance = window.BubbleDesignerInstance || window.designer;
                    if (instance && instance.enableStickersDropdown) {
                        instance.enableStickersDropdown();
                    }
                }
                // Or just always try
                if (window.BubbleDesigner.prototype.enableStickersDropdown) {
                    window.BubbleDesigner.prototype.enableStickersDropdown();
                }
            } catch(e) {}
        }
    }, 100);
});