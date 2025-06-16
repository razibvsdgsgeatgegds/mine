// Console log to confirm script loading
console.log("designer-plugin.js script loaded.");

// Helper array for common style properties to copy
const STYLES_TO_COPY = [
    'fill', 'stroke', 'strokeWidth', 'opacity', 'fontFamily', 'fontSize',
    'fontWeight', 'fontStyle', 'textDecoration', 'textAlign', 'lineHeight',
    'charSpacing', 'backgroundColor', 'overline', 'underline', 'linethrough',
    'shadow', // Shadow object
    'rx', 'ry', // For rounded rectangles
    'radius', // For circles
    'clipPath', // If you implement clipping
    'filters' // For image filters
];

class BubbleDesigner {
    constructor(options = {}) {
        console.log('BubbleDesigner: Constructor called with initial options:', options);
        this.options = {
            container: 'designer-container',       // default
            width: 900,
            height: 550,

            // Sidebar toggles (read from Bubble plugin fields)
            showTextTool: true, // Default to true if not overridden by Bubble
            showImageTool: true,
            showStickerTool: true,
            showElementTool: true,
            showSizeTool: true,
            showSaveTool: true,
            showUndoRedo: true, // New option for undo/redo buttons

            // Customization
            logoText: 'Bubble Designer',
            logoImage: '',
            primaryColor: '#4A6CF7', // Default value
            fontFamily: 'Poppins',
            canvasBackgroundColor: '#FFFFFF', // New: Default canvas background color

            ...options  // Bubble will override these
        };
        console.log('BubbleDesigner: Final options initialized in constructor:', this.options);

        this.stickers = [
            '😀', '😂', '😍', '🥳', '😎', '🤩', '👍', '❤️', '🔥', '✨',
            '🚀', '🌈', '💡', '🎉', '🌟', '💫', '💯', '✅', '❌', '❤️‍🔥',
            '🏆', '👑', '💰', '🎤', '🎧', '💻', '📱', '📚', '🎵', '🎨',
            '🍔', '🍕', '☕', '🎁', '🎈', '🎂', '🎄', '🎃', '🌸', '🌼'
        ];

        this.stockImages = [
            'https://picsum.photos/id/10/300/200', 'https://picsum.photos/id/100/300/200', 'https://picsum.photos/id/1000/300/200',
            'https://picsum.photos/id/1001/300/200', 'https://picsum.photos/id/1002/300/200', 'https://picsum.photos/id/1003/300/200',
            'https://picsum.photos/id/1004/300/200', 'https://picsum.photos/id/1005/300/200', 'https://picsum.photos/id/1006/300/200',
            'https://picsum.photos/id/1008/300/200', 'https://picsum.photos/id/101/300/200', 'https://picsum.photos/id/1010/300/200',
            'https://picsum.photos/id/1011/300/200', 'https://picsum.photos/id/1012/300/200', 'https://picsum.photos/id/1013/300/200',
            'https://picsum.photos/id/1014/300/200', 'https://picsum.photos/id/1015/300/200', 'https://picsum.photos/id/1016/300/200',
            'https://picsum.photos/id/1018/300/200', 'https://picsum.photos/id/1019/300/200', 'https://picsum.photos/id/102/300/200',
            'https://picsum.photos/id/1020/300/200', 'https://picsum.photos/id/1021/300/200', 'https://picsum.photos/id/1022/300/200',
            'https://picsum.photos/id/1023/300/200', 'https://picsum.photos/id/1024/300/200', 'https://picsum.photos/id/1025/300/200',
            'https://picsum.photos/id/1026/300/200', 'https://picsum.photos/id/1027/300/200', 'https://picsum.photos/id/1028/300/200',
            'https://picsum.photos/id/1029/300/200'
        ];

        this.elements = [
            { name: 'Star', type: 'star', icon: 'fas fa-star' },
            { name: 'Circle', type: 'circle', icon: 'fas fa-circle' },
            { name: 'Rectangle', type: 'rect', icon: 'fas fa-square' },
            { name: 'Rounded Rect', type: 'roundedRect', icon: 'fas fa-square-full' }, // Using square-full as a stand-in
            { name: 'Line', type: 'line', icon: 'fas fa-slash' },
            { name: 'Triangle', type: 'triangle', icon: 'fas fa-play', iconStyle: 'transform: rotate(90deg);' },
            { name: 'Arrow', type: 'arrow', icon: 'fas fa-arrow-right' },
            { name: 'Heart', type: 'heart', icon: 'fas fa-heart' },
            { name: 'Diamond', type: 'diamond', icon: 'fas fa-gem' },
            { name: 'Pentagon', type: 'polygon', icon: 'fas fa-fan', sides: 5 }, // Using fan as a stand-in
            { name: 'Hexagon', type: 'polygon', icon: 'fas fa-cube', sides: 6 }, // Using cube as a stand-in
            { name: 'Octagon', type: 'polygon', icon: 'fas fa-octagon', sides: 8 }, // Using octagon as a stand-in
            { name: 'Cloud', type: 'cloud', icon: 'fas fa-cloud' },
            { name: 'Sun', type: 'sun', icon: 'fas fa-sun' },
            { name: 'Moon', type: 'moon', icon: 'fas fa-moon' },
            { name: 'Bell', type: 'icon', icon: 'fas fa-bell' },
            { name: 'Home', type: 'icon', icon: 'fas fa-home' },
            { name: 'Building', type: 'icon', icon: 'fas fa-building' },
            { name: 'Car', type: 'icon', icon: 'fas fa-car' },
            { name: 'Plane', type: 'icon', icon: 'fas fa-plane' },
            { name: 'Bicycle', type: 'icon', icon: 'fas fa-bicycle' },
            { name: 'Tree', type: 'icon', icon: 'fas fa-tree' },
            { name: 'Leaf', type: 'icon', icon: 'fas fa-leaf' },
            { name: 'Camera', type: 'icon', icon: 'fas fa-camera' },
            { name: 'Video', type: 'icon', icon: 'fas fa-video' },
            { name: 'Music Note', type: 'icon', icon: 'fas fa-music' },
            { name: 'Book', type: 'icon', icon: 'fas fa-book' },
            { name: 'Lightbulb', type: 'icon', icon: 'fas fa-lightbulb' },
            { name: 'Search', type: 'icon', icon: 'fas fa-search' },
            { name: 'Thumbs Up', type: 'icon', icon: 'fas fa-thumbs-up' },
            { name: 'Check Mark', type: 'icon', icon: 'fas fa-check' }, 
            { name: 'Cross', type: 'icon', icon: 'fas fa-times' },
            { name: 'Plus', type: 'icon', icon: 'fas fa-plus' },
            { name: 'Minus', type: 'icon', icon: 'fas fa-minus' },
            { name: 'Folder', type: 'icon', icon: 'fas fa-folder' },
            { name: 'Document', type: 'icon', icon: 'fas fa-file-alt' },
            { name: 'Gear', type: 'icon', icon: 'fas fa-cog' },
            { name: 'Puzzle', type: 'icon', icon: 'fas fa-puzzle-piece' },
            { name: 'Bolt', type: 'icon', icon: 'fas fa-bolt' },
            { name: 'Droplet', type: 'icon', icon: 'fas fa-tint' },
            { name: 'Crown', type: 'icon', icon: 'fas fa-crown' },
            { name: 'Shield', type: 'icon', icon: 'fas fa-shield-alt' },
            { name: 'Flag', type: 'icon', icon: 'fas fa-flag' },
            { name: 'Map Pin', type: 'icon', icon: 'fas fa-map-pin' },
            { name: 'Wifi', type: 'icon', icon: 'fas fa-wifi' },
            { name: 'Battery', type: 'icon', icon: 'fas fa-battery-full' }
        ];

        // shapeColors will be initialized/updated based on primaryColor
        this.shapeColors = [
            this.options.primaryColor,
            this._darkenHex(this.options.primaryColor, 10), // A slightly darker version
            this._hexToRgba(this.options.primaryColor, 0.7), // A slightly transparent version
            '#6d5dfc', '#00B894', '#FF7F50', '#FFD700', '#ADD8E6', '#90EE90', '#DA70D6' // Keep some diverse colors
        ]; 

        this.copiedObject = null;
        this.copiedStyle = null;
        this.contextMenu = null;
        this.messageTimeout = null; // For the temporary message box

        this.isCanvasInitialized = false; // Tracks if Fabric.js canvas and main UI are initialized

        // --- Undo/Redo History ---
        this.history = [];
        this.historyPointer = -1;
        this.isRedoing = false;
        this.isUndoing = false;
        // --- End Undo/Redo ---

        // Initial setup sequence
        this.createStyles();
        this.createHTML();
        this.init();
    }

    // Method to dispose of the Fabric.js canvas cleanly
    disposeCanvas() {
        if (this.canvas) {
            console.log('BubbleDesigner: Disposing Fabric.js canvas.');
            this.canvas.dispose(); // Release event listeners and canvas context
            this.canvas = null; // Clear reference
            this.isCanvasInitialized = false; // Reset flag
            // Clear history on dispose/re-init to prevent state mismatches
            this.history = [];
            this.historyPointer = -1;
        }
    }

    // Method to update options and re-render UI based on Bubble property changes
    updateOptions(newOptions) {
        console.log('BubbleDesigner: updateOptions called with:', newOptions);
        // Merge new options, preserving existing ones unless explicitly overridden
        this.options = { ...this.options, ...newOptions };
        console.log('BubbleDesigner: Options after update:', this.options);

        // Dynamically set shapeColors based on the current primaryColor
        this.shapeColors = [
            this.options.primaryColor,
            this._darkenHex(this.options.primaryColor, 10), // A slightly darker version
            this._hexToRgba(this.options.primaryColor, 0.7), // A slightly transparent version
            '#6d5dfc', '#00B894', '#FF7F50', '#FFD700', '#ADD8E6', '#90EE90', '#DA70D6' // Keep some diverse colors
        ];


        // Dispose old canvas before creating new HTML/canvas element
        this.disposeCanvas(); 

        // Re-create HTML and re-initialize Fabric.js with new options
        this.createStyles();   // UI elements and new canvas tag are re-rendered
        this.createHTML();     // Re-generate HTML with potentially new sidebar options/logo
        this.init();           // Fabric.js re-initializes on the new canvas, and event listeners re-attach
        
        this._showMessage('Designer settings updated.', 'info');
    }

    init() {
        // Dispose of any lingering old canvas instance if init is called again without explicit dispose
        if (this.isCanvasInitialized) {
            console.warn("Designer already initialized. Disposing and re-initializing.");
            this.disposeCanvas();
        }
        
        console.log('BubbleDesigner: Calling initFabric and setupEventListeners.');

        this.initFabric();
        this.setupEventListeners();
        
        // Try to load saved canvas state from localStorage
        const loadedFromStorage = this.loadFromLocalStorage();
        
        // If no saved state was loaded, save the initial state
        if (!loadedFromStorage) {
            this.saveCanvasState(); // Save initial state after canvas is ready
        }
        
        this.updateUndoRedoButtons(); // Update buttons initially

        console.log('BubbleDesigner: Initialized successfully!');
        this.isCanvasInitialized = true;
    }

    // Helper to convert hex color to rgba with transparency
    _hexToRgba(hex, alpha) {
        const defaultHex = '#000000'; // Fallback if hex is invalid
        const validHex = (hex && typeof hex === 'string' && /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) ? hex : defaultHex;

        let r, g, b;
        if (validHex.length === 4) { // #RGB (e.g., #F00)
            r = parseInt(validHex[1] + validHex[1], 16);
            g = parseInt(validHex[2] + validHex[2], 16);
            b = parseInt(validHex[3] + validHex[3], 16);
        } else { // #RRGGBB (e.g., #FF0000)
            r = parseInt(validHex.slice(1, 3), 16);
            g = parseInt(validHex.slice(3, 5), 16);
            b = parseInt(validHex.slice(5, 7), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Helper to darken a hex color (more robust version)
    _darkenHex(hex, percent) {
        const defaultHex = '#000000'; // Fallback if hex is invalid
        const validHex = (hex && typeof hex === 'string' && /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) ? hex : defaultHex;

        let r, g, b;
        if (validHex.length === 4) { // #RGB
            r = parseInt(validHex[1] + validHex[1], 16);
            g = parseInt(validHex[2] + validHex[2], 16);
            b = parseInt(validHex[3] + validHex[3], 16);
        } else { // #RRGGBB
            r = parseInt(validHex.slice(1, 3), 16);
            g = parseInt(validHex.slice(3, 5), 16);
            b = parseInt(validHex.slice(5, 7), 16);
        }

        const factor = 1 - (Math.abs(percent) / 100); // percent is given as 10 or 15, representing 10% or 15%
        r = Math.round(r * factor);
        g = Math.round(g * factor);
        b = Math.round(b * factor);

        // Clamp values to 0-255
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        // Convert to hex and pad
        const toHex = (c) => c.toString(16).padStart(2, '0');

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    createStyles() {
        console.log('BubbleDesigner: Creating styles.');
        let existingStyle = document.getElementById('bubble-designer-styles');
        if (existingStyle) {
            existingStyle.remove(); // Remove the old style tag to ensure fresh styles are applied
            console.log('BubbleDesigner: Removed existing style tag.');
        }

        const style = document.createElement('style');
        style.id = 'bubble-designer-styles';
        document.head.appendChild(style); // Append the new style tag

        // Use default values if options are undefined or empty
        const primaryColor = this.options.primaryColor || '#4A6CF7';
        const fontFamily = this.options.fontFamily || 'Poppins';

        console.log(`BubbleDesigner: Styles being generated with primaryColor: ${primaryColor}, fontFamily: ${fontFamily}`); // More explicit log

        // Pre-calculate dynamic colors to avoid complex JS in template literal
        const darkenPrimary15 = this._darkenHex(primaryColor, 15);
        const darkenPrimary10 = this._darkenHex(primaryColor, 10);
        const rgbaPrimary0_1 = this._hexToRgba(primaryColor, 0.1);
        const rgbaPrimary0_2 = this._hexToRgba(primaryColor, 0.2);
        const rgbaPrimary0_3 = this._hexToRgba(primaryColor, 0.3);
        const rgbaPrimary0_15 = this._hexToRgba(primaryColor, 0.15);


        style.textContent = `
            /* Base styles for the entire page */
            body, html {
                margin: 0; padding: 0;
                overflow: hidden; /* Prevent global page scroll */
                font-family: 'Poppins', sans-serif; background-color: #1a1a2e;
                box-sizing: border-box;
                height: 100%; /* Ensure html and body take full viewport height */
            }

            /* Core Bubble Designer Layout - Always visible by default */
            .bubble-designer {
                display: flex; flex-direction: column; width: 100vw;
                height: 100vh; /* Use 100vh to ensure it fills the viewport exactly */
                background: linear-gradient(120deg, #20203a 0%, ${darkenPrimary15} 100%); /* Dynamic gradient */
                position: relative; box-sizing: border-box;
                font-family: ${fontFamily}; /* Dynamic font family */
            }

            /* Main Content Area (Sidebar, Canvas, Right Sidebar) */
            .bubble-main {
                display: flex; flex: 1; width: 100%; position: relative; z-index: 10;
                justify-content: space-between; padding: 20px; box-sizing: border-box;
                min-height: 0; /* Important for flex items within a constrained parent */
            }

            /* LEFT SIDEBAR STYLES */
            .bubble-sidebar {
                display: flex; flex-direction: column; gap: 10px;
                background: rgba(34, 34, 51, 0.92); padding: 20px 0; border-radius: 16px;
                box-shadow: 4px 0 16px 0 rgba(31, 38, 135, 0.08); width: 80px; min-width: 80px;
                z-index: 20;
                height: 100%; /* Make it fill the height of .bubble-main */
                box-sizing: border-box;
                align-items: center;
                overflow-y: auto; /* This correctly enables internal scroll for the sidebar */
                scrollbar-width: thin;
                scrollbar-color: ${primaryColor} #292947; /* Dynamic scrollbar color */
            }
            /* Custom scrollbar for left sidebar */
            .bubble-sidebar::-webkit-scrollbar { width: 8px; }
            .bubble-sidebar::-webkit-scrollbar-track { background: #292947; border-radius: 10px; }
            .bubble-sidebar::-webkit-scrollbar-thumb { background-color: ${primaryColor}; border-radius: 10px; border: 2px solid #292947; }


            .sidebar-btn {
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                width: 60px; height: 60px; background: transparent; border: none; color: #dcdce6;
                font-size: 0.75em; font-weight: 600; border-radius: 10px; cursor: pointer;
                transition: background 0.15s, color 0.15s, transform 0.1s; gap: 4px; text-align: center;
            }
            .sidebar-btn i { font-size: 1.5em; color: #a9b1bf; transition: color 0.15s; }
            .sidebar-btn:hover { background: ${rgbaPrimary0_1}; color: #fff; transform: translateY(-2px); }
            .sidebar-btn:active { transform: translateY(0); background: ${rgbaPrimary0_2}; }
            .sidebar-btn.active { background: ${rgbaPrimary0_3}; color: #fff; }
            .sidebar-btn.active i { color: ${primaryColor}; } /* Dynamic color */
            .bubble-logo {
                margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);
                width: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column;
                gap: 5px; cursor: default;
            }
            .bubble-logo i {
                font-size: 2em; margin: 0;
                color: ${primaryColor}; /* Dynamic color */
            }
            .bubble-logo span { /* This ensures logoText is visible if no image */
                font-size: 0.75em;
                font-weight: 600;
                color: ${primaryColor}; /* Dynamic color */
            }

            /* Undo/Redo container moved to top of properties/layers panel */
            .canvas-controls-top-right {
                position: relative;
                display: flex;
                gap: 8px;
                z-index: 50;
                margin-bottom: 10px;
                margin-top: 5px;
                justify-content: flex-end;
            }

            .undo-redo-btn {
                width: 38px; /* Slightly smaller for top-right */
                height: 38px;
                border-radius: 8px;
                background: rgba(34, 34, 51, 0.8); /* Semi-transparent background */
                color: #a9b1bf;
                border: none;
                cursor: pointer;
                font-size: 1.1em;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s, color 0.2s, transform 0.1s;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                backdrop-filter: blur(5px); /* Frosted glass effect */
            }
            .undo-redo-btn:hover:not(:disabled) {
                background: ${rgbaPrimary0_2};
                color: #fff;
                transform: translateY(-1px);
            }
            .undo-redo-btn:active:not(:disabled) { transform: translateY(0); }
            .undo-redo-btn:disabled { opacity: 0.5; cursor: not-allowed; }


            /* Canvas Container Styles */
            .bubble-canvas-container {
                flex: 1; display: flex; align-items: center; justify-content: center;
                background: rgba(255, 255, 255, 0.05); border-radius: 24px; margin: 0 20px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1); min-width: 0;
                height: 100%; /* Explicitly set height to 100% of its flex parent */
                overflow: hidden; /* Ensure canvas container also hides overflow if canvas is too big */
                position: relative; /* For absolutely positioned undo/redo buttons */
            }
            .bubble-canvas-wrapper {
                background: ${this.options.canvasBackgroundColor}; /* Dynamic canvas background initially set from options */
                border-radius: 18px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
                padding: 14px 14px 14px 0px; overflow: hidden; /* Ensures canvas itself doesn't cause overflow */
                max-height: 100%; /* Ensures wrapper scales down if parent is smaller */
                max-width: 100%;  /* Ensures wrapper scales down if parent is smaller */
                display: flex; /* Helps center the canvas */
                align-items: center;
                justify-content: center;
            }
            .canvas-container { /* Fabric.js specific override */ border-radius: 10px; }

            /* Right Sidebar Styles (Properties Panel) */
            .bubble-right-sidebar {
                width: 340px; min-width: 320px; max-width: 400px;
                background: rgba(34, 34, 51, 0.93); border-radius: 18px;
                box-shadow: -4px 0 32px 0 rgba(31, 38, 135, 0.13); padding: 20px 18px 20px 18px;
                margin-left: 20px; display: flex; flex-direction: column; align-items: flex-start;
                z-index: 30;
                height: 100%; /* Make it fill the height of .bubble-main */
                position: relative;
                transition: background 0.2s, box-shadow 0.2s; box-sizing: border-box;
            }

            /* Right Sidebar Tabs */
            .sidebar-tabs {
                display: flex; width: 100%; margin-bottom: 10px; background: rgba(30, 30, 45, 0.94);
                border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); flex-shrink: 0;
            }
            .sidebar-tab-btn {
                flex: 1; padding: 10px 0; text-align: center; color: #a9b1bf; font-weight: 600;
                font-size: 0.95em; background: transparent; border: none; cursor: pointer;
                transition: background 0.2s, color 0.2s;
            }
            .sidebar-tab-btn.active { background: linear-gradient(90deg, ${darkenPrimary15} 0%, ${primaryColor} 100%); color: #fff; } /* Dynamic gradient */
            .sidebar-tab-btn:hover:not(.active) { background: ${rgbaPrimary0_1}; color: #fff; }

            /* Tab Content Panels - Use visibility/opacity for no reflow */
            .properties-panel, .layers-panel {
                display: flex; visibility: hidden; opacity: 0; width: 100%;
                padding: 20px 14px 18px 14px; background: rgba(44, 44, 66, 0.98);
                border-radius: 16px; box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.05);
                min-width: 0; color: #fff; font-family: 'Poppins', sans-serif; margin: 0;
                flex-direction: column; gap: 14px; box-sizing: border-box; max-height: calc(100% - 60px);
                overflow-y: auto; scrollbar-width: thin; scrollbar-color: ${primaryColor} #292947; /* Dynamic scrollbar color */
                position: absolute; /* Positioned relative to .bubble-right-sidebar */
                top: 60px; left: 18px; right: 18px; bottom: 18px; /* Cover full area of parent below tabs with margins */
                height: auto; /* Let content dictate height, but respect parent bounds */
            }
            .properties-panel.active, .layers-panel.active { 
                visibility: visible; opacity: 1; transition: opacity 0.2s ease-in-out; 
                margin-top: 67px; margin-left: 1px; width: 302px; 
            }

            /* Scrollbar styling for panels */
            .properties-panel::-webkit-scrollbar, .layers-panel::-webkit-scrollbar { width: 8px; }
            .properties-panel::-webkit-scrollbar-track { background: #292947; border-radius: 10px; }
            .properties-panel::-webkit-scrollbar-thumb { background-color: ${primaryColor}; border-radius: 10px; border: 2px solid #292947; }

            /* Properties Panel specific styles */
            .properties-panel h4 {
                color: #fff; font-size: 1.1em; font-weight: 700; margin: 0; padding-bottom: 8px; border-bottom: 1px solid #35354c;
            }
            .property-group {
                margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1px solid #35354c;
                width: 100%; box-sizing: border-box;
            }
            .property-group:last-child {
                border-bottom: none; margin-bottom: 0;
            }
            .property-row {
                display: flex; align-items: center; margin-bottom: 10px; gap: 10px;
                width: 100%; box-sizing: border-box; flex-wrap: nowrap;
            }
            .property-label {
                min-width: 70px; width: 70px; color: #b3b3c6; font-size: 0.98em;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .property-input[type="number"], .property-input[type="text"], .property-input[type="color"], .property-input select {
                flex: 1; border: none; outline: none; border-radius: 6px; padding: 6px 8px; background: #292947;
                color: #fff; font-size: 1em; box-sizing: border-box; transition: background 0.2s, box-shadow 0.2s;
                min-width: 0; max-width: 100%; width: calc(100% - 80px);
            }
            .property-input[type="number"]:focus, .property-input[type="text"]:focus, .property-input[type="color"]:focus, .property-input select:focus {
                background: #35354c; box-shadow: 0 0 0 2px ${primaryColor};
            }
            .property-input[type="range"] {
                -webkit-appearance: none; /* Override default look */
                appearance: none;
                width: 100%; /* Full-width */
                height: 8px; /* Specify height of the track */
                background: #35354c; /* Color of the track */
                border-radius: 5px;
                outline: none;
                transition: opacity .2s;
            }
            .property-input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${primaryColor};
                cursor: grab; box-shadow: 0 0 0 3px ${rgbaPrimary0_3}; margin-top: -4px; /* Adjust thumb vertical position */
                transition: background 0.2s, box-shadow 0.2s;
            }
            .property-input[type="range"]::-moz-range-thumb {
                width: 16px; height: 16px; border-radius: 50%; background: ${primaryColor};
                cursor: grab; box-shadow: 0 0 0 3px ${rgbaPrimary0_3};
                transition: background 0.2s, box-shadow 0.2s;
            }
            .property-input[type="range"]::-webkit-slider-thumb:active { cursor: grabbing; }
            .property-input[type="checkbox"] {
                width: 18px; height: 18px; accent-color: ${primaryColor};
                cursor: pointer;
            }

            /* New: Color/Gradient Switch (for objects) */
            .color-type-toggle {
                display: flex;
                border-radius: 6px;
                overflow: hidden;
                margin-bottom: 10px;
                width: 100%;
                box-sizing: border-box;
            }
            .color-type-toggle button {
                flex: 1;
                padding: 6px 0;
                background: #292947;
                color: #b3b3c6;
                border: none;
                cursor: pointer;
                font-size: 0.9em;
                font-weight: 600;
                transition: background 0.2s, color 0.2s;
            }
            .color-type-toggle button.active {
                background: ${primaryColor};
                color: #fff;
            }
            .color-type-toggle button:hover:not(.active) {
                background: #35354c;
            }

            .gradient-options {
                display: none; /* Hidden by default */
                flex-direction: column;
                gap: 8px;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #35354c;
                width: 100%;
                box-sizing: border-box;
            }
            .gradient-options.active {
                display: flex;
            }
            .gradient-color-input {
                flex: 1;
                padding: 4px;
                border-radius: 4px;
                border: 1px solid #35354c;
                background: #292947;
            }
            .gradient-color-row {
                display: flex;
                gap: 8px;
                align-items: center;
                width: 100%;
                box-sizing: border-box;
                flex-wrap: nowrap;
            }
            .gradient-add-stop-btn {
                background: ${primaryColor};
                color: #fff;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 0.8em;
                transition: background 0.2s;
            }
            .gradient-add-stop-btn:hover { background: ${darkenPrimary10}; }
            .gradient-remove-stop-btn {
                background: none;
                border: none;
                color: #ff4d4f;
                font-size: 1.2em;
                cursor: pointer;
                transition: color 0.2s;
            }
            .gradient-remove-stop-btn:hover {
                color: #e63946;
            }

            /* New: Canvas Background Fill Style controls */
            .canvas-color-type-toggle {
                display: flex;
                border-radius: 6px;
                overflow: hidden;
                margin-bottom: 10px;
                width: 100%;
                box-sizing: border-box;
            }
            .canvas-color-type-toggle button {
                flex: 1;
                padding: 6px 0;
                background: #292947;
                color: #b3b3c6;
                border: none;
                cursor: pointer;
                font-size: 0.9em;
                font-weight: 600;
                transition: background 0.2s, color 0.2s;
            }
            .canvas-color-type-toggle button.active {
                background: ${primaryColor};
                color: #fff;
            }
            .canvas-color-type-toggle button:hover:not(.active) {
                background: #35354c;
            }

            .canvas-gradient-options {
                display: none; /* Hidden by default */
                flex-direction: column;
                gap: 8px;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #35354c;
                width: 100%;
                box-sizing: border-box;
            }
            .canvas-gradient-options.active {
                display: flex;
            }
            .canvas-gradient-color-input {
                flex: 1;
                padding: 4px;
                border-radius: 4px;
                border: 1px solid #35354c;
                background: #292947;
            }
            .canvas-gradient-color-row {
                display: flex;
                gap: 8px;
                align-items: center;
                width: 100%;
                box-sizing: border-box;
                flex-wrap: nowrap;
            }
            .canvas-gradient-add-stop-btn {
                background: ${primaryColor};
                color: #fff;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 0.8em;
                transition: background 0.2s;
            }
            .canvas-gradient-add-stop-btn:hover { background: ${darkenPrimary10}; }
            .canvas-gradient-remove-stop-btn {
                background: none;
                border: none;
                color: #ff4d4f;
                font-size: 1.2em;
                cursor: pointer;
                transition: color 0.2s;
            }
            .canvas-gradient-remove-stop-btn:hover {
                color: #e63946;
            }


            .property-delete-btn {
                background: #ff4d4f; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer;
                font-weight: 600; font-size: 0.95em; display: inline-flex; align-items: center; justify-content: center; gap: 8px; 
                transition: background 0.2s, transform 0.1s; max-width: 100%; box-sizing: border-box;
            }
            .property-delete-btn:hover { background: #e63946; transform: translateY(-1px); }
            .property-delete-btn:active { transform: translateY(0); }

            /* LAYER PANEL STYLES */
            .layers-panel .layer-list { flex-grow: 1; padding-top: 10px; width: 100%; box-sizing: border-box; }
            .layer-list-item {
                display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: #292947;
                border-radius: 6px; margin-bottom: 8px; color: #e0e0e0; font-size: 0.9em; cursor: pointer;
                transition: background 0.15s, border 0.15s; border: 1px solid transparent; user-select: none;
                width: 100%; box-sizing: border-box;
            }
            .layer-list-item:hover { background: #35354c; }
            .layer-list-item.selected { background: ${rgbaPrimary0_15}; border: 1px solid ${primaryColor}; }
            .layer-list-item .layer-icon { font-size: 1.1em; color: #a9b1bf; transition: color 0.15s; min-width: 20px; text-align: center; } /* Added transition and min-width */
            .layer-list-item .layer-name { flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .layer-list-item .layer-actions { display: flex; gap: 5px; }
            .layer-action-btn {
                background: none; border: none; color: #a9b1bf; font-size: 0.9em; cursor: pointer;
                padding: 4px; border-radius: 4px; transition: background 0.15s, color 0.15s;
            }
            .layer-action-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
            .layer-action-btn.delete-layer:hover { background: rgba(255,77,79,0.1); color: #ff4d4f; }
            .layer-action-btn.visibility-toggle.hidden { color: #ff4d4f; }
            .layer-controls {
                display: flex; justify-content: space-around; gap: 10px; margin-top: 15px;
                padding-top: 10px; border-top: 1px solid #35354c; flex-shrink: 0;
                width: 100%; box-sizing: border-box;
            }
            .layer-control-btn {
                font-size: 0.9em; padding: 8px 12px; border-radius: 8px; background: ${primaryColor};
                color: #fff; border: none; cursor: pointer; transition: background 0.2s, transform 0.1s;
                flex: 1; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .layer-control-btn:hover { background: ${darkenPrimary10}; transform: translateY(-1px); }

            /* SLIDE-IN PANELS (GENERIC) */
            .slidein-panel {
                position: fixed; top: 0; left: 0; height: 100vh; width: 410px;
                background: rgba(36, 36, 58, 0.97); box-shadow: 4px 0 32px 0 rgba(31, 38, 135, 0.17);
                transform: translateX(-100%); transition: transform 0.33s cubic-bezier(.77,0,.18,1);
                z-index: 1002; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box;
                overflow-y: auto; /* Allow panels themselves to scroll */
                scrollbar-width: thin;
                scrollbar-color: ${primaryColor} #292947;
            }
            .slidein-panel::-webkit-scrollbar { width: 8px; }
            .slidein-panel::-webkit-scrollbar-track { background: #292947; border-radius: 10px; }
            .slidein-panel::-webkit-scrollbar-thumb { background-color: ${primaryColor}; border-radius: 10px; border: 2px solid #292947; }


            .slidein-panel.open { transform: translateX(0); }
            .panel-header {
                display: flex; justify-content: space-between; align-items: center; padding: 22px 0px 10px 0px;
                font-size: 1.4em; font-weight: 800; color: #fff; border-bottom: 1px solid #35354c; margin-bottom: 20px;
                flex-shrink: 0;
            }
            .close-panel {
                background: none; border: none; color: #fff; font-size: 2em; cursor: pointer; transition: color 0.2s;
            }
            .close-panel:hover { color: #ff4d4f; }

            .slidein-content-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 15px;
                padding-bottom: 20px; /* Allow space for scrollbar thumb */
            }
            .slidein-item {
                background: #292947; /* Default background for items */
                color: #e0e0e0;
                border-radius: 8px;
                padding: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                font-size: 0.9em;
            }
            .slidein-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                background: ${primaryColor}; /* Dynamic hover color */
                color: #fff;
            }
            .slidein-item img {
                max-width: 100%;
                height: auto;
                border-radius: 6px;
                margin-bottom: 8px;
                pointer-events: none; /* Prevent dragging img itself */
            }
            .slidein-item .icon {
                font-size: 2.5em;
                margin-bottom: 8px;
                color: #fff;
                text-shadow: 0 0 10px rgba(255,255,255,0.3);
            }

            /* Specific Panel Adjustments */
            .stickers-grid .sticker-item {
                font-size: 2.5em; /* Make emojis larger */
                padding: 5px;
                box-shadow: none; /* No shadow needed for emojis */
                background: transparent; /* No background for emojis */
                transition: transform 0.1s;
            }
            .stickers-grid .sticker-item:hover {
                transform: scale(1.2);
                background: transparent;
                box-shadow: none;
            }

            .media-panel-options {
                display: flex;
                flex-direction: column;
                gap: 15px;
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #35354c;
            }
            .media-panel-options input[type="text"] {
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                border: 1px solid #35354c;
                background: #292947;
                color: #fff;
                font-size: 1em;
                box-sizing: border-box;
            }
            .media-panel-options button {
                width: 100%;
                padding: 10px 15px;
                border-radius: 8px;
                border: none;
                background: ${primaryColor};
                color: #fff;
                font-size: 1em;
                cursor: pointer;
                transition: background 0.2s, transform 0.1s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            .media-panel-options button:hover {
                background: ${darkenPrimary10};
                transform: translateY(-2px);
            }
            .media-panel-options .or-separator {
                text-align: center;
                color: #b3b3c6;
                margin: 10px 0;
                font-weight: 600;
            }


            /* CANVAS SIZE MODAL */
            .canvas-size-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.7);
                display: none; /* Hidden by default, shown by JS button click */
                justify-content: center; align-items: center;
                z-index: 10001; backdrop-filter: blur(5px);
            }
            .canvas-size-modal-content {
                background: rgba(36, 36, 58, 0.98); border-radius: 16px; padding: 30px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.5); color: #fff; text-align: center;
                width: 400px; max-width: 90vw; position: relative;
            }
            .canvas-size-modal-content h3 { margin-top: 0; color: ${primaryColor}; }
            .canvas-size-options {
                display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 15px; margin-top: 20px; margin-bottom: 20px;
            }
            .canvas-size-option {
                background: #292947; padding: 15px 10px; border-radius: 8px; cursor: pointer;
                transition: background 0.2s, border 0.2s; border: 1px solid transparent;
            }
            .canvas-size-option:hover { background: #35354c; border-color: ${primaryColor}; }
            .canvas-size-option.active-size { background: ${primaryColor}; border-color: ${primaryColor}; color: #fff; font-weight: 600; }
            .canvas-size-option p { margin: 5px 0; font-size: 0.9em; }
            .canvas-size-option .dimensions { font-weight: 700; font-size: 1.1em; }
            .custom-size-inputs { display: flex; gap: 10px; justify-content: center; margin-top: 15px; }
            .custom-size-inputs input {
                width: 80px; padding: 8px; border-radius: 6px; border: 1px solid #35354c;
                background: #292947; color: #fff; font-size: 1em; text-align: center;
            }
            .custom-size-inputs span { align-self: center; font-size: 1.2em; color: #a9b1bf; }
            .modal-actions { display: flex; justify-content: center; gap: 15px; margin-top: 25px; }
            .modal-btn {
                padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;
                border: none; transition: background 0.2s, transform 0.1s;
                background: linear-gradient(90deg, ${darkenPrimary15} 0%, ${primaryColor} 100%); /* Dynamic gradient */
                color: #fff;
            }
            .modal-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px ${this._hexToRgba(primaryColor, 0.2)}; }
            .modal-btn.secondary { background: #35354c; color: #dcdce6; }
            .modal-btn.secondary:hover { background: #44445c; transform: translateY(-1px); }
            .modal-close-btn {
                position: absolute; top: 15px; right: 15px; background: none; border: none;
                font-size: 1.8em; color: #a9b1bf; cursor: pointer; transition: color 0.2s;
            }
            .modal-close-btn:hover { color: #ff4d4f; }

            /* EXPORT MODAL */
            .export-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.7); display: none; justify-content: center; align-items: center;
                z-index: 10002; backdrop-filter: blur(5px);
            }
            .export-modal-content {
                background: rgba(36, 36, 58, 0.98); border-radius: 16px; padding: 30px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.5); color: #fff; text-align: center;
                width: 350px; max-width: 90vw; position: relative;
            }
            .export-modal-content h3 { margin-top: 0; color: ${primaryColor}; }
            .export-options-grid {
                display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;
            }
            .export-option-group {
                display: flex; flex-direction: column; gap: 10px;
            }
            .export-option-group label { text-align: left; font-size: 0.9em; color: #b3b3c6; }
            .export-option-group input[type="number"], .export-option-group select {
                width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #35354c;
                background: #292947; color: #fff; font-size: 1em; box-sizing: border-box;
            }
            .export-option-group select { appearance: none; } /* Remove default dropdown arrow */
            .export-buttons {
                display: flex; flex-direction: column; gap: 10px; margin-top: 20px;
            }
            .export-btn {
                padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;
                border: none; transition: background 0.2s, transform 0.1s;
                background: linear-gradient(90deg, #00B894 0%, #55E6C1 100%); /* Green for export */
                color: #fff;
            }
            .export-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,200,150,0.2); }
            .export-btn.secondary { background: #35354c; } /* Gray for cancel */
            .export-btn.secondary:hover { background: #44445c; transform: translateY(-1px); }

            /* CONTEXT MENU STYLES */
            .custom-context-menu {
                display: none; position: fixed; background-color: rgba(44, 44, 66, 0.98);
                border: 1px solid #35354c; border-radius: 8px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                z-index: 10000; min-width: 180px; padding: 8px 0; font-family: 'Poppins', sans-serif;
                max-height: 80vh; /* Limit height to 80% of viewport height */
                overflow-y: auto; /* Enable vertical scrolling */
                scrollbar-width: thin;
                scrollbar-color: ${primaryColor} #292947;
            }
            /* Custom scrollbar for context menu */
            .custom-context-menu::-webkit-scrollbar { width: 8px; }
            .custom-context-menu::-webkit-scrollbar-track { background: #292947; border-radius: 10px; }
            .custom-context-menu::-webkit-scrollbar-thumb { background-color: ${primaryColor}; border-radius: 10px; border: 2px solid #292947; }

            .custom-context-menu ul { list-style: none; margin: 0; padding: 0; }
            .custom-context-menu li {
                padding: 8px 15px; color: #e0e0e0; font-size: 0.9em; cursor: pointer;
                transition: background-color 0.15s, color 0.15s; display: flex;
                justify-content: space-between; align-items: center;
            }
            .custom-context-menu li:hover:not(.disabled):not(.separator) { background-color: ${rgbaPrimary0_2}; color: #ffffff; }
            .custom-context-menu li.disabled { color: #6a6a6a; cursor: not-allowed; opacity: 0.6; }
            .custom-context-menu li.separator { height: 1px; background-color: #35354c; margin: 5px 0; cursor: default; }
            .custom-context-menu li .shortcut { font-size: 0.8em; color: #999; margin-left: 15px; }

            /* Notification styles */
            #messageBox {
                border-left: 5px solid ${primaryColor};
            }
        `;
    }

    /**
     * Creates the main HTML structure of the Bubble Designer application.
     */
    createHTML() {
        console.log('BubbleDesigner: createHTML called.');
        // Added log to explicitly show options used for HTML creation
        console.log('BubbleDesigner: Options used for createHTML:', this.options);

        const container = document.getElementById(this.options.container);
        if (!container) {
            console.error("❌ Container not found:", this.options.container, ". This is critical. Ensure it's appended by Bubble's initialize and available.");
            return; // This return is important if container is not found.
        }
        container.className = 'bubble-designer'; // Assign the main class for styling
        container.innerHTML = `
            <div class="bubble-main">
                <div class="bubble-sidebar">
                    <div class="bubble-logo">
                        ${
                          this.options.logoImage
                            ? `<img src="${this.options.logoImage}" alt="Logo" style="height: 30px;" />`
                            : `<i class="fas fa-paint-brush"></i><span>${this.options.logoText}</span>`
                        }
                    </div>
                    <button class="sidebar-btn new-canvas-btn" title="New Canvas">
                        <i class="fas fa-file-alt"></i> New
                    </button>
                    ${this.options.showTextTool ? `<button class="sidebar-btn add-text-btn" title="Add Text">
                        <i class="fas fa-text-width"></i> Text
                    </button>` : ''}
                    ${this.options.showImageTool ? `<button class="sidebar-btn add-media-btn" title="Add Image/Media">
                        <i class="fas fa-image"></i> Media
                    </button>` : ''}
                    ${this.options.showStickerTool ? `<button class="sidebar-btn stickers-btn" title="Stickers">
                        <i class="fas fa-smile"></i> Stickers
                    </button>` : ''}
                    ${this.options.showElementTool ? `<button class="sidebar-btn elements-btn" title="Elements">
                        <i class="fas fa-vector-square"></i> Elements
                    </button>` : ''}
                    ${this.options.showSizeTool ? `<button class="sidebar-btn change-size-btn" title="Change Canvas Size">
                        <i class="fas fa-expand-alt"></i> Size
                    </button>` : ''}
                    ${this.options.showSaveTool ? `<button class="sidebar-btn save-btn" title="Save Design">
                        <i class="fas fa-save"></i> Save
                    </button>` : ''}
                </div>

                <div class="bubble-canvas-container">
                    <div class="bubble-canvas-wrapper" style="background-color: ${this.options.canvasBackgroundColor};">
                        <canvas id="design-canvas" width="${this.options.width}" height="${this.options.height}"></canvas>
                    </div>

                </div>

                <div class="bubble-right-sidebar">
                    ${this.options.showUndoRedo ? `
                        <div class="canvas-controls-top-right">
                            <button class="undo-redo-btn" id="undoBtn" title="Undo">
                                <i class="fas fa-undo"></i>
                            </button>
                            <button class="undo-redo-btn" id="redoBtn" title="Redo">
                                <i class="fas fa-redo"></i>
                            </button>
                        </div>
                    ` : ''}
                    <div class="sidebar-tabs">
                        <button class="sidebar-tab-btn active" data-tab="properties" id="properties-tab-btn">Properties</button>
                        <button class="sidebar-tab-btn" data-tab="layers" id="layers-tab-btn">Layers</button>
                    </div>
                    <div class="properties-panel active" id="properties-panel">
                        <p style="text-align:center; color:#b3b3c6; padding-top:20px;">Select an element to edit its properties</p>
                    </div>
                    <div class="layers-panel" id="layers-panel">
                        <div class="layer-list" id="layer-list">
                            <p style="text-align:center; color:#b3b3c6; padding-top:20px;">No layers yet.</p>
                        </div>
                        <div class="layer-controls">
                            <button class="layer-control-btn" data-layer-action="bring-front">Bring to Front</button>
                            <button class="layer-control-btn" data-layer-action="send-back">Send to Back</button>
                        </div>
                    </div>
                </div>

                <div class="slidein-panel stickers-panel">
                    <div class="panel-header"><span>Stickers</span><button class="close-panel">&times;</button></div>
                    <div class="slidein-content-grid stickers-grid"></div>
                </div>

                <div class="slidein-panel media-panel">
                    <div class="panel-header"><span>Add Media</span><button class="close-panel">&times;</button></div>
                    <div class="media-panel-options">
                        <button id="uploadImageBtn"><i class="fas fa-upload"></i> Upload from Device</button>
                        <div class="or-separator">OR</div>
                        <input type="text" id="imageUrlInput" placeholder="Enter image URL here...">
                        <button id="addImageUrlBtn"><i class="fas fa-link"></i> Add Image from URL</button>
                    </div>
                    <div style="font-size: 1.1em; font-weight: 700; color: #fff; margin-bottom: 15px;">Stock Images</div>
                    <div class="slidein-content-grid stock-images-grid"></div>
                </div>

                <div class="slidein-panel elements-panel">
                    <div class="panel-header"><span>Elements</span><button class="close-panel">&times;</button></div>
                    <div class="slidein-content-grid elements-grid"></div>
                </div>

                <div id="custom-context-menu" class="custom-context-menu">
                    <ul>
                        <li data-action="delete">Delete <span class="shortcut">Del</span></li>
                        <li data-action="copy">Copy <span class="shortcut">Ctrl+C</span></li>
                        <li data-action="paste" class="disabled">Paste <span class="shortcut">Ctrl+V</span></li>
                        <li class="separator"></li>
                        <li data-action="copy-style">Copy Style</li>
                        <li class="separator"></li>
                        <li data-action="paste-style" class="disabled">Paste Style</li>
                        <li class="separator"></li>
                        <li data-action="bring-forward">Bring Forward</li>
                        <li data-action="send-backward">Send Backward</li>
                    </ul>
                </div>
            </div>
            <div id="canvasSizeModal" class="canvas-size-modal-overlay">
                <div class="canvas-size-modal-content">
                    <button class="modal-close-btn">&times;</button>
                    <h3>Select Canvas Size</h3>
                    <div class="canvas-size-options">
                        <div class="canvas-size-option" data-width="1280" data-height="720" data-name="YouTube HD">
                            <p>YouTube HD</p><p class="dimensions">1280x720</p>
                        </div>
                        <div class="canvas-size-option" data-width="1920" data-height="1080" data-name="Full HD">
                            <p>Full HD</p><p class="dimensions">1920x1080</p>
                        </div>
                        <div class="canvas-size-option" data-width="1080" data-height="1080" data-name="Instagram Post">
                            <p>Insta Post</p><p class="dimensions">1080x1080</p>
                        </div>
                        <div class="canvas-size-option" data-width="1080" data-height="1920" data-name="TikTok/Reel">
                            <p>TikTok/Reel</p><p class="dimensions">1080x1920</p>
                        </div>
                        <div class="canvas-size-option" data-width="800" data-height="600" data-name="Standard">
                            <p>Standard</p><p class="dimensions">800x600</p>
                        </div>
                        <div class="canvas-size-option" data-width="600" data-height="400" data-name="Small Card">
                            <p>Small Card</p><p class="dimensions">600x400</p>
                        </div>
                    </div>
                    <div class="custom-size-inputs">
                        <input type="number" id="customWidth" placeholder="Width" value="${this.options.width}">
                        <span>x</span>
                        <input type="number" id="customHeight" placeholder="Height" value="${this.options.height}">
                    </div>
                    <div class="modal-actions">
                        <button class="modal-btn primary" id="applyCanvasSizeBtn">Apply Size</button>
                        <button class="modal-btn secondary">Cancel</button>
                    </div>
                </div>
            </div>

            <div id="exportModal" class="export-modal-overlay">
                <div class="export-modal-content">
                    <button class="modal-close-btn export-close-modal">&times;</button>
                    <h3>Export Design</h3>
                    <div class="export-options-grid">
                        <div class="export-option-group">
                            <label for="exportFormat">Format:</label>
                            <select id="exportFormat">
                                <option value="png">PNG (Transparent)</option>
                                <option value="jpeg">JPEG (Lossy)</option>
                                <option value="svg">SVG (Vector)</option>
                            </select>
                        </div>
                        <div class="export-option-group">
                            <label for="exportScale">Scale (PNG/JPEG):</label>
                            <input type="number" id="exportScale" value="1" min="0.5" step="0.5">
                            </div>
                        <div class="export-option-group" id="jpegQualityGroup">
                            <label for="jpegQuality">JPEG Quality:</label>
                            <input type="range" min="0" max="1" step="0.05" value="0.9">
                        </div>
                    </div>
                    <div class="export-buttons">
                        <button class="export-btn primary" id="doExportBtn">Export</button>
                        <button class="export-btn secondary export-close-modal">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        console.log('BubbleDesigner: HTML created for container. Children count:', container.children.length);
        const computedStyle = window.getComputedStyle(container);
        console.log('BubbleDesigner: Container display:', computedStyle.display, 'height:', computedStyle.height);
    }

    /**
     * Initializes the Fabric.js canvas and sets up basic interactions.
     * This method is only called once by `init()`.
     */
    initFabric() {
        console.log('BubbleDesigner: Initializing Fabric.js canvas.');
        // Ensure canvas is null before attempting to create a new one,
        // as this function might be called after dispose.
        if (this.canvas) {
            console.warn("Fabric.js canvas already exists. Disposing and creating new instance.");
            this.canvas.dispose();
            this.canvas = null; // Clear reference
            this.isCanvasInitialized = false; // Reset flag
        }

        try {
            this.canvas = new fabric.Canvas('design-canvas', {
                width: this.options.width,
                height: this.options.height,
                backgroundColor: this.options.canvasBackgroundColor // Set initial background color
            });
            console.log('BubbleDesigner: Fabric.js canvas created successfully with dimensions:', this.canvas.width, 'x', this.canvas.height);
            const canvasElement = document.getElementById('design-canvas');
            if(canvasElement) {
                const computedCanvasStyle = window.getComputedStyle(canvasElement);
                console.log('BubbleDesigner: Canvas element computed dimensions:', computedCanvasStyle.width, 'x', computedCanvasStyle.height);
            }
        } catch (error) {
            console.error('BubbleDesigner: Error initializing Fabric.js canvas:', error);
            this._showMessage('Error initializing canvas. Check console for details.', 'error');
        }


        // Fabric.js Object prototype customizations
        fabric.Object.prototype.set({
            transparentCorners: false, borderColor: '#4A6CF7', cornerColor: '#4A6CF7',
            cornerSize: 10, cornerStyle: 'rect', borderScaleFactor: 2, padding: 5
        });
        // Fabric.js IText prototype customizations for cursor/selection
        fabric.IText.prototype.set({
            cursorColor: '#4A6CF7', selectionColor: 'rgba(74, 108, 247, 0.4)'
        });

        // Event listeners for object selection and modification to update the properties panel
        // Remove old listeners before adding new ones to prevent duplicates if initFabric is called multiple times
        this.canvas.off('selection:created');
        this.canvas.off('selection:updated');
        this.canvas.off('selection:cleared');
        this.canvas.off('object:modified');
        this.canvas.off('object:moving');
        this.canvas.off('object:scaling');
        this.canvas.off('object:rotating');
        this.canvas.off('object:added');
        this.canvas.off('object:removed');

        this.canvas.on('selection:created', (e) => {
            console.log("Canvas: selection created", e.selected[0]?.id || e.selected[0]?.type);
            this.updatePropertiesPanel(e);
            this.switchRightSidebarTab('properties'); // Explicitly switch to properties tab on selection
        });
        this.canvas.on('selection:updated', (e) => {
            console.log("Canvas: selection updated", e.selected[0]?.id || e.selected[0]?.type);
            this.updatePropertiesPanel(e);
            this.switchRightSidebarTab('properties'); // Explicitly switch to properties tab on selection
        });

        this.canvas.on('selection:cleared', this.clearPropertiesPanel.bind(this));
        
        // --- History Logic Integration ---
        // Listen for canvas modified events to save state
        this.canvas.on('object:modified', () => {
            if (!this.isUndoing && !this.isRedoing) {
                this.saveCanvasState();
            }
            this.updatePropertiesPanel(); // Still update UI
        });
        this.canvas.on('object:added', () => {
            if (!this.isUndoing && !this.isRedoing) {
                this.saveCanvasState();
            }
            this.updateLayersPanel();
        });
        this.canvas.on('object:removed', () => {
            if (!this.isUndoing && !this.isRedoing) {
                this.saveCanvasState();
            }
            this.updateLayersPanel();
        });
        // --- End History Logic Integration ---

        // Live updates for position, scale, rotation during drag/resize
        this.canvas.on('object:moving', this.updatePropertiesPanel.bind(this));
        this.canvas.on('object:scaling', this.updatePropertiesPanel.bind(this));
        this.canvas.on('object:rotating', this.updatePropertiesPanel.bind(this));
        
        // Show canvas properties when clicking on empty canvas areas
        this.canvas.on('mouse:down', (e) => {
            // If clicked on empty canvas (no target) or on canvas background
            if (!e.target) {
                this.clearPropertiesPanel(); // This will show canvas properties
                this.switchRightSidebarTab('properties'); // Switch to properties tab
            }
        });

        this.updateLayersPanel(); // Initial update of layers panel after canvas content is ready
    }

    /**
     * Sets up all event listeners for UI interactions.
     */
    setupEventListeners() {
        console.log('BubbleDesigner: Setting up event listeners.');
        // --- Left Sidebar Button Click Handlers ---
        const newCanvasBtn = document.querySelector('.new-canvas-btn');
        if (newCanvasBtn) {
            newCanvasBtn.onclick = () => this.startNewCanvas();
        } else {
            console.error("new-canvas-btn not found. This button should exist per createHTML.");
        }

        // Conditional event listeners for other buttons
        if (this.options.showTextTool) {
            const addTextBtn = document.querySelector('.add-text-btn');
            if (addTextBtn) addTextBtn.onclick = () => this.addText();
        }
        if (this.options.showImageTool) {
            const addMediaBtn = document.querySelector('.add-media-btn');
            if (addMediaBtn) addMediaBtn.onclick = () => this.openMediaPanel();
        }
        if (this.options.showStickerTool) {
            const stickersBtn = document.querySelector('.stickers-btn');
            if (stickersBtn) stickersBtn.onclick = () => this.openStickersPanel();
        }
        if (this.options.showElementTool) {
            const elementsBtn = document.querySelector('.elements-btn');
            if (elementsBtn) elementsBtn.onclick = () => this.openElementsPanel();
        }
        if (this.options.showSizeTool) {
            const changeSizeBtn = document.querySelector('.change-size-btn');
            if (changeSizeBtn) changeSizeBtn.onclick = () => this.openNewCanvasModal();
        }
        if (this.options.showSaveTool) {
            const saveBtn = document.querySelector('.save-btn');
            if (saveBtn) saveBtn.onclick = () => this.openExportModal();
        }

        // --- Undo/Redo Buttons ---
        if (this.options.showUndoRedo) {
            const undoBtn = document.getElementById('undoBtn');
            const redoBtn = document.getElementById('redoBtn');
            if (undoBtn) undoBtn.onclick = () => this.undo();
            if (redoBtn) redoBtn.onclick = () => this.redo();
        }


        // --- Slide-in Panel Close Button Handlers ---
        document.querySelectorAll('.close-panel').forEach(btn =>
            btn.onclick = (e) => e.target.closest('.slidein-panel').classList.remove('open')
        );

        // --- Canvas Size Modal Event Listeners ---
        const canvasSizeModal = document.getElementById('canvasSizeModal');
        if(canvasSizeModal) {
            const applySizeBtn = canvasSizeModal.querySelector('#applyCanvasSizeBtn');
            if (applySizeBtn) applySizeBtn.onclick = () => this.applyCanvasSize();

            const modalActionsCancelBtn = canvasSizeModal.querySelector('.modal-actions .modal-btn.secondary');
            if (modalActionsCancelBtn) modalActionsCancelBtn.onclick = () => canvasSizeModal.style.display = 'none';

            const modalCloseBtn = canvasSizeModal.querySelector('.modal-close-btn');
            if (modalCloseBtn) modalCloseBtn.onclick = () => canvasSizeModal.style.display = 'none';


            canvasSizeModal.querySelector('.canvas-size-options')?.addEventListener('click', (e) => {
                const option = e.target.closest('.canvas-size-option');
                if (option) {
                    canvasSizeModal.querySelectorAll('.canvas-size-option').forEach(opt => opt.classList.remove('active-size'));
                    option.classList.add('active-size');
                    document.getElementById('customWidth').value = option.dataset.width;
                    document.getElementById('customHeight').value = option.dataset.height;
                }
            });
        } else {
             console.error("Canvas size modal element not found!");
        }

        // --- Media Panel Event Listeners ---
        const mediaPanel = document.querySelector('.media-panel');
        if (mediaPanel) {
            const uploadImageBtn = mediaPanel.querySelector('#uploadImageBtn');
            if (uploadImageBtn) uploadImageBtn.onclick = () => this.openFilePicker();

            const addImageUrlBtn = mediaPanel.querySelector('#addImageUrlBtn'); // Corrected ID
            if (addImageUrlBtn) addImageUrlBtn.onclick = () => {
                const urlInput = mediaPanel.querySelector('#imageUrlInput');
                const url = urlInput.value;
                if (url) {
                    this.addImage(url);
                    urlInput.value = ''; // Clear input after adding
                    mediaPanel.classList.remove('open');
                } else {
                    this._showMessage('Please enter a valid image URL.', 'error');
                }
            };
        }

        // --- Right Sidebar Tabs Event Listeners ---
        const propertiesTabBtn = document.getElementById('properties-tab-btn');
        if (propertiesTabBtn) propertiesTabBtn.onclick = () => this.switchRightSidebarTab('properties');

        const layersTabBtn = document.getElementById('layers-tab-btn');
        if (layersTabBtn) layersTabBtn.onclick = () => this.switchRightSidebarTab('layers');

        // --- Layers Panel Control Buttons (Bring to Front / Send to Back) ---
        const layerControls = document.getElementById('layers-panel')?.querySelector('.layer-controls');
        if(layerControls) {
            const bringFrontBtn = layerControls.querySelector('[data-layer-action="bring-front"]');
            if (bringFrontBtn) bringFrontBtn.onclick = () => this.bringActiveLayerToFront();

            const sendBackBtn = layerControls.querySelector('[data-layer-action="send-back"]');
            if (sendBackBtn) sendBackBtn.onclick = () => this.sendActiveLayerToBack();
        } else {
            console.warn("Layers panel controls not found.");
        }


        // --- Export Modal Event Listeners ---
        const exportModal = document.getElementById('exportModal');
        if (exportModal) {
            exportModal.querySelectorAll('.export-close-modal').forEach(btn => {
                btn.onclick = () => this.closeExportModal();
            });
            const doExportBtn = document.getElementById('doExportBtn');
            if (doExportBtn) doExportBtn.onclick = () => this.performExport();


            // Toggle JPEG Quality visibility based on format
            document.getElementById('exportFormat')?.addEventListener('change', (e) => {
                const qualityGroup = document.getElementById('jpegQualityGroup');
                if (qualityGroup) {
                    if (e.target.value === 'jpeg') {
                        qualityGroup.style.display = 'flex'; // Show for JPEG
                    } else {
                        qualityGroup.style.display = 'none'; // Hide for others
                    }
                }
            });
            // Initial state for JPEG quality (hidden by default)
            // Use setTimeout to ensure the element is rendered before attempting to set style
            setTimeout(() => {
                const jpegQualityGroup = document.getElementById('jpegQualityGroup');
                if (jpegQualityGroup) {
                    jpegQualityGroup.style.setProperty('display', 'none', 'important');
                }
            }, 0);
        }


        // --- Custom Right-Click Context Menu Listeners ---
        // Ensure canvas is initialized before adding contextmenu listener
        if (this.canvas?.wrapperEl) {
            this.canvas.wrapperEl.addEventListener('contextmenu', this.handleContextMenu.bind(this));
        } else {
            console.warn("Canvas wrapper element not found for context menu setup. Ensure Fabric.js is fully initialized.");
        }
        document.addEventListener('click', this.hideContextMenu.bind(this));
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        console.log('BubbleDesigner: All event listeners set up.');
    }

    /**
     * Displays a temporary message to the user.
     * @param {string} message The message to display.
     * @param {string} type 'success' or 'error' for different styling.
     */
    _showMessage(message, type = 'success') {
        const msgBox = document.getElementById('messageBox');
        if (!msgBox) {
            // Create message box if it doesn't exist
            const designerDiv = document.querySelector('.bubble-designer');
            if (designerDiv) {
                const tempMessageBox = document.createElement('div');
                tempMessageBox.id = 'messageBox';
                tempMessageBox.style.cssText = `
                    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                    background-color: rgba(74, 108, 247, 0.85); color: white; padding: 10px 20px;
                    border-radius: 8px; font-size: 0.9em; z-index: 10003; opacity: 0;
                    transition: opacity 0.3s ease-in-out, background-color 0.3s, border-left-color 0.3s;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2); border-left: 5px solid #4A6CF7;
                `;
                designerDiv.appendChild(tempMessageBox);
                // Re-select msgBox after creating it
                const newMsgBox = document.getElementById('messageBox');
                if (newMsgBox) {
                    this._showMessage(message, type); // Recursively call to apply styles to the new box
                    return;
                } else {
                    console.error("Failed to create message box element!");
                    return;
                }
            } else {
                console.warn("Message box element not found and could not be created as .bubble-designer container is missing!");
                return;
            }
        }

        clearTimeout(this.messageTimeout); // Clear any existing timeout

        // Ensure color conversion for dynamic background color
        const primaryColorRGB = this._hexToRgba(this.options.primaryColor, 0.85);

        msgBox.textContent = message;
        
        // Use error color for error messages, primary color for all other message types (success, info, etc.)
        msgBox.style.backgroundColor = type === 'error' ? 'rgba(255, 77, 79, 0.85)' : primaryColorRGB;
        msgBox.style.borderLeftColor = type === 'error' ? '#ff4d4f' : this.options.primaryColor;
        msgBox.style.opacity = 1;

        this.messageTimeout = setTimeout(() => {
            msgBox.style.opacity = 0;
        }, 3000); // Message disappears after 3 seconds
    }

    /** Starts a new canvas: clears current content and opens size modal. */
    startNewCanvas() {
        this.canvas.clear();
        // Reset background to default or previously set color
        this.canvas.backgroundColor = this.options.canvasBackgroundColor; // Ensure this is explicitly set
        // Update the wrapper background to ensure consistency
        const canvasWrapper = document.querySelector('.bubble-canvas-wrapper');
        if (canvasWrapper) {
            canvasWrapper.style.backgroundColor = this.options.canvasBackgroundColor;
        }

        this.canvas.renderAll();
        this.clearPropertiesPanel(); // This will also update canvas properties panel
        this.updateLayersPanel();
        this.openNewCanvasModal();
        this.saveCanvasState(); // Save state after clearing
        this._showMessage('New canvas started!', 'success');
    }

    /** Opens the modal for selecting or defining new canvas dimensions. */
    openNewCanvasModal() {
        const canvasSizeModal = document.getElementById('canvasSizeModal');
        if(canvasSizeModal) {
            canvasSizeModal.style.display = 'flex';
            document.querySelectorAll('.canvas-size-option').forEach(opt => opt.classList.remove('active-size'));
            // Set custom inputs to current canvas size, as canvas is already initialized
            document.getElementById('customWidth').value = this.canvas.width;
            document.getElementById('customHeight').value = this.canvas.height;
        } else {
            console.error("Canvas size modal element not found!");
        }
    }

    /** Applies the selected or custom canvas size to the Fabric.js canvas. */
    applyCanvasSize() {
        const width = parseInt(document.getElementById('customWidth').value);
        const height = parseInt(document.getElementById('customHeight').value);

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            this._showMessage('Please enter valid dimensions (positive numbers).', 'error');
            return;
        }

        // Canvas is already initialized, just resize and clear
        this.canvas.clear();
        this.canvas.setDimensions({ width: width, height: height });
        this.canvas.backgroundColor = this.options.canvasBackgroundColor; // Ensure background color is reapplied
        // Update the wrapper background to ensure consistency
        const canvasWrapper = document.querySelector('.bubble-canvas-wrapper');
        if (canvasWrapper) {
            canvasWrapper.style.backgroundColor = this.options.canvasBackgroundColor;
        }
        this.canvas.renderAll();

        this.clearPropertiesPanel();
        this.updateLayersPanel();
        document.getElementById('canvasSizeModal').style.display = 'none';
        this.saveCanvasState(); // Save state after resizing
        this._showMessage(`Canvas resized to ${width}x${height}`, 'success');
    }

    /** Opens the export modal. */
    openExportModal() {
        const exportModal = document.getElementById('exportModal');
        if (exportModal) {
            exportModal.style.display = 'flex';
            // Reset scale to 1 on open for fresh export
            document.getElementById('exportScale').value = 1;
            // Reset format to PNG, hide JPEG quality
            document.getElementById('exportFormat').value = 'png';
            document.getElementById('jpegQualityGroup').style.display = 'none';
        } else {
            console.error("Export modal element not found!");
        }
    }

    /** Closes the export modal. */
    closeExportModal() {
        const exportModal = document.getElementById('exportModal');
        if (exportModal) {
            exportModal.style.display = 'none';
        }
    }

    /** Performs the actual export based on selected options. */
    performExport() {
        const format = document.getElementById('exportFormat')?.value;
        const scale = parseFloat(document.getElementById('exportScale')?.value);
        const quality = parseFloat(document.getElementById('jpegQuality')?.value);
        const fileName = 'my-design'; // You can make this dynamic if you add a title field

        if (!this.canvas) {
            this._showMessage("No canvas to export!", 'error');
            return;
        }

        let dataURL;
        try {
            switch (format) {
                case 'png':
                    dataURL = this.canvas.toDataURL({
                        format: 'png',
                        multiplier: scale,
                        enableRetinaScaling: true,
                    });
                    this._downloadFile(dataURL, fileName + '.png');
                    break;
                case 'jpeg':
                    dataURL = this.canvas.toDataURL({
                        format: 'jpeg',
                        multiplier: scale,
                        quality: quality,
                        backgroundColor: this.canvas.backgroundColor || '#FFFFFF', // Fallback to white for JPEG if transparent
                        enableRetinaScaling: true,
                    });
                    this._downloadFile(dataURL, fileName + '.jpeg');
                    break;
                case 'svg':
                    const svgData = this.canvas.toSVG();
                    this._downloadFile('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData), fileName + '.svg');
                    break;
                default:
                    this._showMessage('Unsupported export format.', 'error');
                    return; // Prevent modal closing if error occurs
            }
        } catch (error) {
            console.error("Export failed:", error);
            this._showMessage("Export failed! Check console for details (e.g., cross-origin images).", 'error');
            return; // Prevent modal closing if error occurs
        }
        this.closeExportModal();
        this._showMessage(`Design exported as ${format.toUpperCase()}`, 'success');
    }

    /** Helper to trigger file download. */
    _downloadFile(dataURL, fileName) {
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /** Adds a new text object to the canvas, centering it. */
    addText() {
        const text = new fabric.IText('Double click to edit', {
            fontFamily: this.options.fontFamily, fontSize: 32, fill: '#000000',
            originX: 'center', originY: 'center', type: 'text', id: 'text-' + Date.now()
        });
        this.canvas.add(text);
        this.centerObject(text); // Center the object
        this.canvas.setActiveObject(text);
        this.canvas.renderAll();
        this._showMessage('Text added', 'success');
    }

    /** Opens the unified media panel. */
    openMediaPanel() {
        const panel = document.querySelector('.media-panel');
        if (!panel) {
            console.error("Media panel not found!");
            return;
        }
        panel.classList.add('open');
        const grid = panel.querySelector('.stock-images-grid');
        if (grid) {
            grid.innerHTML = this.stockImages.map(url =>
                `<div class="slidein-item" data-url="${url}"><img src="${url}" alt="Stock Image" onerror="this.src='https://placehold.co/100x70/FF0000/FFFFFF?text=Error';"><p>Stock Image</p></div>`
            ).join('');
            grid.querySelectorAll('.slidein-item').forEach(item => {
                item.onclick = () => { this.addImage(item.dataset.url); panel.classList.remove('open'); };
            });
        }
    }

    /** Opens a file input dialog for uploading images from the user's computer. */
    openFilePicker() {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.addImage(event.target.result);
                    const mediaPanel = document.querySelector('.media-panel');
                    if (mediaPanel) mediaPanel.classList.remove('open'); // Close panel after selection
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    /** Opens the stickers panel and populates it with emoji stickers. */
    openStickersPanel() {
        const panel = document.querySelector('.stickers-panel');
        if (!panel) {
            console.error("Stickers panel not found!");
            return;
        }
        panel.classList.add('open');
        const grid = panel.querySelector('.stickers-grid');
        if (grid) {
            grid.innerHTML = this.stickers.map(sticker => `<div class="sticker-item">${sticker}</div>`).join('');
            grid.querySelectorAll('.sticker-item').forEach(item => {
                item.onclick = () => { this.addSticker(item.textContent); panel.classList.remove('open'); };
            });
        }
    }

    /** Opens the elements panel and populates it. */
    openElementsPanel() {
        const panel = document.querySelector('.elements-panel');
        if (!panel) {
            console.error("Elements panel not found!");
            return;
        }
        panel.classList.add('open');
        const grid = panel.querySelector('.elements-grid');
        if (grid) {
            grid.innerHTML = this.elements.map(element => `
                <div class="slidein-item" data-element-type="${element.type}" data-element-name="${element.name}" ${element.sides ? `data-element-sides="${element.sides}"` : ''}>
                    <i class="${element.icon}" ${element.iconStyle ? `style="${element.iconStyle}"` : ''}></i> ${element.name}
                </div>
            `).join('');

            grid.querySelectorAll('.slidein-item').forEach(item => {
                item.onclick = () => {
                    const elementType = item.dataset.elementType;
                    const elementName = item.dataset.elementName;
                    const elementSides = parseInt(item.dataset.elementSides); // For polygons
                    const fillColor = this.shapeColors[Math.floor(Math.random() * this.shapeColors.length)];

                    let newObject;
                    switch(elementType) {
                        case 'icon': newObject = this.addIconElement(elementName, fillColor, false); break;
                        case 'circle': newObject = this._addBasicShape('circle', fillColor, false); break;
                        case 'rect': newObject = this._addBasicShape('rect', fillColor, false); break;
                        case 'roundedRect': newObject = this._addBasicShape('roundedRect', fillColor, false); break;
                        case 'triangle': newObject = this._addBasicShape('triangle', fillColor, false); break;
                        case 'line': newObject = this._addBasicShape('line', fillColor, false); break;
                        case 'arrow': newObject = this._addBasicShape('arrow', fillColor, false); break;
                        case 'heart': newObject = this._addBasicShape('heart', fillColor, false); break;
                        case 'diamond': newObject = this._addBasicShape('diamond', fillColor, false); break;
                        case 'polygon': newObject = this._addBasicShape('polygon', fillColor, false, elementSides); break;
                        case 'star': newObject = this._addBasicShape('star', fillColor, false); break;
                        case 'cloud': newObject = this._addPathShape('cloud', fillColor, false); break;
                        case 'sun': newObject = this._addPathShape('sun', fillColor, false); break;
                        case 'moon': newObject = this._addPathShape('moon', fillColor, false); break;
                        default: console.log('Add custom element:', elementType); return;
                    }
                    if (newObject) {
                        this.canvas.add(newObject);
                        this.centerObject(newObject); // Center the object
                        this.canvas.setActiveObject(newObject);
                        this.canvas.renderAll();
                        panel.classList.remove('open');
                        this._showMessage(`${elementName} added`, 'success');
                    }
                };
            });
        }
    }

    /** Helper for basic shapes (rect, circle, triangle, etc.) and simple paths (star). */
    _addBasicShape(type, fillColor, doNotCenter = false, sides = 0) {
        let shape;
        const options = {
            fill: fillColor,
            originX: 'center', originY: 'center',
            type: type, // Store original type
            id: `${type}-${Date.now()}`
        };

        switch(type) {
            case 'rect':
                shape = new fabric.Rect({ ...options, width: 120, height: 80, rx: 0, ry: 0 });
                break;
            case 'roundedRect':
                shape = new fabric.Rect({ ...options, width: 120, height: 80, rx: 18, ry: 18 });
                break;
            case 'circle':
                shape = new fabric.Circle({ ...options, radius: 55 });
                break;
            case 'triangle':
                shape = new fabric.Triangle({ ...options, width: 100, height: 90 });
                break;
            case 'line':
                shape = new fabric.Line([-75, 0, 75, 0], { // Start from 0,0 relative to object center
                    stroke: fillColor, strokeWidth: 5, originX: 'center', originY: 'center', type: 'line', id: 'line-' + Date.now()
                });
                break;
            case 'arrow':
                shape = new fabric.Path('M 0 40 L 60 40 L 60 20 L 100 60 L 60 100 L 60 80 L 0 80 Z', {
                    ...options, width: 100, height: 80, scaleX: 1, scaleY: 1
                });
                break;
            case 'heart':
                shape = new fabric.Path('M 50 30 A 20 20 0 0 1 90 30 Q 90 60 50 90 Q 10 60 10 30 A 20 20 0 0 1 50 30 Z', {
                    ...options, width: 100, height: 90, scaleX: 1, scaleY: 1
                });
                break;
            case 'diamond':
                shape = new fabric.Polygon([
                    {x: 50, y: 0}, {x: 100, y: 50}, {x: 50, y: 100}, {x: 0, y: 50}
                ], {
                    ...options, width: 100, height: 100
                });
                break;
            case 'polygon':
                if (sides < 3) {
                    console.warn("Polygon needs at least 3 sides.");
                    return;
                }
                const polygonPoints = [];
                const radius = 50;
                for (let i = 0; i < sides; i++) {
                    const angle = (Math.PI / 180) * (360 / sides) * i - Math.PI / 2; // -90 deg to start top
                    polygonPoints.push({
                        x: radius * Math.cos(angle) + radius,
                        y: radius * Math.sin(angle) + radius
                    });
                }
                shape = new fabric.Polygon(polygonPoints, {
                    ...options, width: radius * 2, height: radius * 2
                });
                break;
            case 'star':
                shape = new fabric.Path('M 50 0 L 61.8 35.3 L 97.6 35.3 L 68.2 57.7 L 79.1 92.7 L 50 70.3 L 20.9 92.7 L 31.8 57.7 L 2.4 35.3 L 38.2 35.3 Z', {
                    ...options, width: 100, height: 92.7
                });
                break;
            default:
                console.warn(`Unknown basic shape type: ${type}`);
                return;
        }

        if (!doNotCenter) {
            const center = this.canvas.getCenter();
            shape.set({ left: center.left, top: center.top });
        }
        return shape;
    }

    /** Adds an icon element (Font Awesome) as a text object, centering it. */
    addIconElement(iconNameFromElement, color, doNotCenter = false) {
        const elementDefinition = this.elements.find(el => el.name === iconNameFromElement && el.type === 'icon');
        if (!elementDefinition) {
            console.error(`Icon definition not found for name: ${iconNameFromElement}`);
            this._showMessage(`Could not add icon: ${iconNameFromElement}`, 'error');
            return null;
        }

        const iconUnicodeMap = {
            'star': '\uf005', 'bell': '\uf0f3', 'home': '\uf015', 'building': '\uf1ad',
            'car': '\uf1b9', 'plane': '\uf072', 'bicycle': '\uf206', 'tree': '\uf1bb',
            'leaf': '\uf06c', 'camera': '\uf030', 'video': '\uf03d', 'music': '\uf001',
            'book': '\uf02d', 'lightbulb': '\uf0eb', 'search': '\uf002', 'thumbs-up': '\uf164',
            'check': '\uf00c', 'times': '\uf00d', 'plus': '\uf067', 'minus': '\uf068',
            'folder': '\uf07b', 'file-alt': '\uf15c', 'cog': '\uf013', 'puzzle-piece': '\uf12e',
            'bolt': '\uf0e7', 'tint': '\uf043', 'crown': '\uf521', 'shield-alt': '\uf3ed',
            'flag': '\uf024', 'map-pin': '\uf041', 'wifi': '\uf1eb', 'battery-full': '\uf240',
            'cloud': '\uf0c2', 'sun': '\uf185', 'moon': '\uf186'
        };
        const iconClassSuffix = elementDefinition.icon.split(' ').pop().replace('fa-', '');
        const unicodeChar = iconUnicodeMap[iconClassSuffix] || '\uf005';

        const iconText = new fabric.IText(unicodeChar, {
            fontFamily: 'Font Awesome 6 Free',
            fontWeight: '900',
            fontSize: 80,
            fill: color,
            originX: 'center', originY: 'center',
            type: 'icon',
            id: `icon-${iconClassSuffix}-${Date.now()}`
        });

        if (!doNotCenter) {
            const center = this.canvas.getCenter();
            iconText.set({ left: center.left, top: center.top });
        }
        return iconText;
    }

    // Helper for complex SVG path-based shapes (cloud, sun, moon etc.), centering them.
    _addPathShape(type, fillColor, doNotCenter = false) {
        let pathData = '';
        let defaultWidth = 100;
        let defaultHeight = 100;

        switch (type) {
            case 'cloud':
                pathData = 'M 80 20 C 100 20 100 40 80 40 L 20 40 C 0 40 0 20 20 20 C 20 0 40 0 50 10 C 60 0 80 0 80 20 Z';
                defaultWidth = 100; defaultHeight = 40;
                break;
            case 'sun':
                pathData = 'M50 5 C50 5 60 0 70 5L80 15C80 15 90 20 85 30L95 40C95 40 100 50 95 60L85 70C85 70 80 80 70 85L60 95C60 95 50 100 40 95L30 85C30 85 20 80 15 70L5 60C5 60 0 50 5 40L15 30C15 30 20 20 30 15L40 5C40 5 50 0 50 5ZM50 20A30 30 0 1 0 50 80A30 30 0 1 0 50 20Z';
                defaultWidth = 100; defaultHeight = 100;
                break;
            case 'moon':
                pathData = 'M 50 10 A 40 40 0 1 0 50 90 A 30 30 0 1 1 50 10 Z';
                defaultWidth = 100; defaultHeight = 100;
                break;
            default:
                console.warn(`Unknown path shape type: ${type}`);
                return null;
        }

        const path = new fabric.Path(pathData, {
            fill: fillColor,
            scaleX: 1, scaleY: 1,
            originX: 'center', originY: 'center',
            type: type, // Custom type
            id: `${type}-${Date.now()}`
        });

        const bounds = path.getBoundingRect();
        const scale = Math.min(defaultWidth / bounds.width, defaultHeight / bounds.height);
        path.scale(scale);

        if (!doNotCenter) {
            const center = this.canvas.getCenter();
            path.set({ left: center.left, top: center.top });
        }
        return path;
    }


    /** Adds an image, centering it. */
    addImage(dataUrl) {
        fabric.Image.fromURL(dataUrl, (img) => {
            img.set({ originX: 'center', originY: 'center', type: 'image', id: 'image-' + Date.now() });
            const maxWidth = this.canvas.width * 0.4; const maxHeight = this.canvas.height * 0.4; let scale = 1;
            if (img.width > maxWidth || img.height > maxHeight) { scale = Math.min(maxWidth / img.width, maxHeight / img.height); }
            img.scale(scale);
            this.canvas.add(img);
            this.centerObject(img); // Center the object
            this.canvas.setActiveObject(img); img.bringToFront(); this.canvas.renderAll();
            this._showMessage('Image added', 'success');
        }, { crossOrigin: 'anonymous' });
    }

    /** Adds an emoji sticker, centering it. */
    addSticker(emoji) {
        const text = new fabric.Text(emoji, {
            fontSize: 64, fontFamily: 'Segoe UI Emoji, Arial',
            type: 'sticker', originX: 'center', originY: 'center', id: 'sticker-' + Date.now()
        });
        this.canvas.add(text);
        this.centerObject(text); // Center the object
        this.canvas.setActiveObject(text); text.bringToFront(); this.canvas.renderAll();
        this._showMessage(`Sticker ${emoji} added`, 'success');
    }

    /** Centers a Fabric.js object on the canvas with fixed x-coordinate. */
    centerObject(obj) {
        // Skip centering if this object was loaded from localStorage
        // This check prevents overriding saved positions
        if (obj._loadedFromStorage) {
            return;
        }
        
        const center = this.canvas.getCenter();
        
        // Set the object position with fixed x-coordinate of 414 and vertical center
        obj.set({
            left: 414, // Fixed x-coordinate as requested
            top: center.top,
            originX: 'center',
            originY: 'center'
        });
        
        // Update coordinates to ensure proper positioning
        obj.setCoords();
        
        // Render immediately
        this.canvas.renderAll();
        
        // Force additional renders with slight delays to ensure proper centering
        // This helps with complex objects that might need additional time to fully initialize
        setTimeout(() => {
            // Reconfirm position with fixed x-coordinate
            obj.set({
                left: 414, // Maintain fixed x-coordinate
                top: center.top
            });
            obj.setCoords();
            this.canvas.renderAll();
        }, 10);
        
        setTimeout(() => {
            this.canvas.renderAll();
        }, 50);
    }

    /** Switches the active tab in the right sidebar. */
    switchRightSidebarTab(tabName) {
        const allTabButtons = document.querySelectorAll('.sidebar-tab-btn');
        const propertiesPanel = document.getElementById('properties-panel');
        const layersPanel = document.getElementById('layers-panel');

        allTabButtons.forEach(btn => { btn.classList.remove('active'); });
        propertiesPanel.classList.remove('active'); propertiesPanel.style.visibility = 'hidden'; propertiesPanel.style.opacity = '0';
        layersPanel.classList.remove('active'); layersPanel.style.visibility = 'hidden'; layersPanel.style.opacity = '0';

        const targetButton = document.querySelector(`[data-tab="${tabName}"]`); if (targetButton) { targetButton.classList.add('active'); }
        const targetPanel = document.getElementById(`${tabName}-panel`);
        if (targetPanel) { targetPanel.classList.add('active'); targetPanel.style.visibility = 'visible'; targetPanel.style.opacity = 1; }
        if (tabName === 'layers') { this.updateLayersPanel(); }
    }

    /** Updates the properties panel. */
    updatePropertiesPanel() {
        const panel = document.getElementById('properties-panel');
        const activeObject = this.canvas.getActiveObject();
        if (!panel) return;

        if (!activeObject) {
            // If no object is selected, show canvas properties
            const isCanvasGradient = this.canvas.backgroundColor && typeof this.canvas.backgroundColor === 'object';
            panel.innerHTML = `
                <div class="property-group">
                    <h4>Canvas Properties</h4>
                    <div class="canvas-color-type-toggle">
                        <button class="flat-color-toggle ${!isCanvasGradient ? 'active' : ''}" data-canvas-color-type="flat">Flat Color</button>
                        <button class="gradient-color-toggle ${isCanvasGradient ? 'active' : ''}" data-canvas-color-type="gradient">Gradient</button>
                    </div>
                    <div class="canvas-flat-color-options ${!isCanvasGradient ? 'active' : ''}">
                        <div class="property-row">
                            <span class="property-label">Background</span>
                            <input type="color" class="property-input" data-property="canvasBackgroundColor" value="${this.rgbToHex(this.canvas.backgroundColor && typeof this.canvas.backgroundColor === 'string' ? this.canvas.backgroundColor : (this.options.canvasBackgroundColor || '#FFFFFF'))}">
                        </div>
                    </div>
                    <div class="canvas-gradient-options ${isCanvasGradient ? 'active' : ''}">
                        <div class="property-row">
                            <span class="property-label">Type</span>
                            <select class="property-input" data-property="canvasGradientType">
                                <option value="linear" ${this.canvas.backgroundColor?.type === 'linear' ? 'selected' : ''}>Linear</option>
                                <option value="radial" ${this.canvas.backgroundColor?.type === 'radial' ? 'selected' : ''}>Radial</option>
                            </select>
                        </div>
                        <div id="canvas-gradient-stops-container">
                            ${this.getCanvasGradientStopsHtml(this.canvas.backgroundColor)}
                        </div>
                        <button class="canvas-gradient-add-stop-btn">Add Stop</button>
                    </div>
                    <div class="property-row">
                        <span class="property-label">Width</span>
                        <input type="number" class="property-input" data-property="canvasWidth" value="${this.canvas.width}">
                    </div>
                    <div class="property-row">
                        <span class="property-label">Height</span>
                        <input type="number" class="property-input" data-property="canvasHeight" value="${this.canvas.height}">
                    </div>
                </div>
            `;
            // Add listeners for canvas properties
            panel.querySelector('[data-property="canvasBackgroundColor"]')?.addEventListener('change', this.handleCanvasPropertyChange.bind(this));
            panel.querySelector('[data-property="canvasWidth"]')?.addEventListener('change', this.handleCanvasPropertyChange.bind(this));
            panel.querySelector('[data-property="canvasHeight"]')?.addEventListener('change', this.handleCanvasPropertyChange.bind(this));

            // Listeners for canvas color/gradient toggle
            panel.querySelector('.canvas-color-type-toggle .flat-color-toggle')?.addEventListener('click', () => this.toggleCanvasFillType('flat'));
            panel.querySelector('.canvas-color-type-toggle .gradient-color-toggle')?.addEventListener('click', () => this.toggleCanvasFillType('gradient'));
            panel.querySelector('.canvas-gradient-add-stop-btn')?.addEventListener('click', this.addCanvasGradientStop.bind(this));
            this.setupCanvasGradientStopListeners(); // Setup listeners for gradient stops

            return; // Exit if canvas properties are being shown
        }

        let html = `<div class="property-group"><h4>Selected: ${activeObject.type.charAt(0).toUpperCase() + activeObject.type.slice(1)}</h4>
            <div class="property-row"><span class="property-label">X</span><input type="number" class="property-input" data-property="left" value="${Math.round(activeObject.left)}"></div>
            <div class="property-row"><span class="property-label">Y</span><input type="number" class="property-input" data-property="top" value="${Math.round(activeObject.top)}"></div>
            <div class="property-row"><span class="property-label">Width</span><input type="number" class="property-input" data-property="width" value="${Math.round((activeObject.type==='circle'?activeObject.radius*2:(activeObject.width * (activeObject.scaleX || 1))))}"></div>
            <div class="property-row"><span class="property-label">Height</span><input type="number" class="property-input" data-property="height" value="${Math.round((activeObject.type==='circle'?activeObject.radius*2:(activeObject.height * (activeObject.scaleY || 1))))}"></div>
            <div class="property-row"><span class="property-label">Rotation</span><input type="number" class="property-input" data-property="angle" value="${Math.round(activeObject.angle || 0)}"></div>
            <div class="property-row"><span class="property-label">Opacity</span><input type="range" min="0" max="1" step="0.01" class="property-input" data-property="opacity" value="${activeObject.opacity ?? 1}"></div>
            <div class="property-row"><span class="property-label">Lock Position</span><input type="checkbox" class="property-input" data-property="lockMovement" ${activeObject.lockMovementX && activeObject.lockMovementY ? 'checked' : ''}></div>
            <div class="property-row"><span class="property-label">Lock Scale</span><input type="checkbox" class="property-input" data-property="lockScaling" ${activeObject.lockScalingX && activeObject.lockScalingY ? 'checked' : ''}></div></div>`;

        if (activeObject.type === 'text' || activeObject.type === 'i-text' || activeObject.type === 'icon' || ['rect', 'circle', 'triangle', 'polygon', 'path', 'line', 'star', 'arrow', 'heart', 'diamond', 'cloud', 'sun', 'moon', 'roundedRect'].includes(activeObject.type)) {
            // Color/Gradient selection
            const isGradient = activeObject.fill && typeof activeObject.fill === 'object';
            html += `
                <div class="property-group">
                    <h4>Fill Style</h4>
                    <div class="color-type-toggle">
                        <button class="flat-color-toggle ${!isGradient ? 'active' : ''}" data-color-type="flat">Flat Color</button>
                        <button class="gradient-color-toggle ${isGradient ? 'active' : ''}" data-color-type="gradient">Gradient</button>
                    </div>
                    <div class="flat-color-options ${!isGradient ? 'active' : ''}">
                        <div class="property-row">
                            <span class="property-label">Color</span>
                            <input type="color" class="property-input" data-property="fill" value="${this.rgbToHex(activeObject.fill && typeof activeObject.fill === 'string' ? activeObject.fill : (this.options.primaryColor || '#000000'))}">
                        </div>
                    </div>
                    <div class="gradient-options ${isGradient ? 'active' : ''}">
                        <div class="property-row">
                            <span class="property-label">Type</span>
                            <select class="property-input" data-property="gradientType">
                                <option value="linear" ${activeObject.fill?.type === 'linear' ? 'selected' : ''}>Linear</option>
                                <option value="radial" ${activeObject.fill?.type === 'radial' ? 'selected' : ''}>Radial</option>
                            </select>
                        </div>
                        <div id="gradient-stops-container">
                            ${this.getGradientStopsHtml(activeObject.fill)}
                        </div>
                        <button class="gradient-add-stop-btn">Add Stop</button>
                    </div>
                </div>`;
            // Add stroke options for applicable types
            if (['rect', 'circle', 'triangle', 'polygon', 'path', 'line', 'star', 'arrow', 'heart', 'diamond', 'cloud', 'sun', 'moon', 'roundedRect'].includes(activeObject.type)) {
                html += `
                    <div class="property-group">
                        <h4>Stroke Style</h4>
                        <div class="property-row">
                            <span class="property-label">Stroke</span>
                            <input type="color" class="property-input" data-property="stroke" value="${this.rgbToHex(activeObject.stroke || this._darkenHex(this.options.primaryColor, 10))}">
                        </div>
                        <div class="property-row">
                            <span class="property-label">Width</span>
                            <input type="number" class="property-input" data-property="strokeWidth" value="${activeObject.strokeWidth ?? 0}">
                        </div>
                    </div>`;
            }
        }

        if (activeObject.type === 'text' || activeObject.type === 'i-text' || activeObject.type === 'sticker' || activeObject.type === 'icon') {
            // Different handling for stickers vs other text elements
            if (activeObject.type === 'sticker') {
                // For stickers, only show size option, no color or other text options
                html += `<div class="property-group"><h4>Sticker</h4>
                    <div class="property-row"><span class="property-label">Size</span><input type="number" class="property-input" data-property="fontSize" value="${activeObject.fontSize ?? 64}"></div>
                </div>`;
            } else {
                // For regular text and icons
                html += `<div class="property-group"><h4>Text/Icon</h4><div class="property-row"><span class="property-label">Content</span><input type="text" class="property-input" data-property="text" value="${activeObject.text ?? ''}"></div>
                    <div class="property-row"><span class="property-label">Font Size</span><input type="number" class="property-input" data-property="fontSize" value="${activeObject.fontSize ?? 24}"></div>`;
                if (activeObject.type === 'text' || activeObject.type === 'i-text') {
                    html += `<div class="property-row"><span class="property-label">Font Family</span>${this.getFontDropdown('fontFamily', activeObject.fontFamily ?? 'Poppins')}</div>`;
                }
                html += `<div class="property-row"><span class="property-label">Align</span><select class="property-input" data-property="textAlign">
                        <option value="left" ${activeObject.textAlign === 'left' ? 'selected' : ''}>Left</option><option value="center" ${activeObject.textAlign === 'center' ? 'selected' : ''}>Center</option><option value="right" ${activeObject.textAlign === 'center' ? 'selected' : ''}>Right</option>
                    </select></div><div class="property-row"><span class="property-label">Padding</span><input type="number" min="0" class="property-input" data-property="padding" value="${activeObject.padding ?? 0}"></div>
                </div>`;
            }
        }
        if (activeObject.type === 'image') {
            html += `<div class="property-group"><h4>Image</h4><div class="property-row"><span class="property-label">Scale X</span><input type="number" step="0.01" class="property-input" data-property="scaleX" value="${(activeObject.scaleX ?? 1).toFixed(2)}"></div>
                <div class="property-row"><span class="property-label">Scale Y</span><input type="number" step="0.01" class="property-input" data-property="scaleY" value="${(activeObject.scaleY ?? 1).toFixed(2)}"></div></div>`;
        }

        html += `<div style='text-align:right;margin-top:12px;width:100%;box-sizing:border-box;'><button class="property-delete-btn"><i class="fas fa-trash"></i> Delete</button></div>`;
        panel.innerHTML = html;

        panel.querySelectorAll('.property-input').forEach(input => {
            input.addEventListener('change', this.handlePropertyChange.bind(this));
            input.addEventListener('input', this.handlePropertyChange.bind(this));
        });
        const delBtn = panel.querySelector('.property-delete-btn');
        if (delBtn) { delBtn.addEventListener('click', () => { this.deleteActiveObject(); }); }

        // Event listeners for object color/gradient toggle
        panel.querySelector('.flat-color-toggle')?.addEventListener('click', () => this.toggleFillType('flat'));
        panel.querySelector('.gradient-color-toggle')?.addEventListener('click', () => this.toggleFillType('gradient'));
        panel.querySelector('.gradient-add-stop-btn')?.addEventListener('click', this.addGradientStop.bind(this));
        // Initial setup for gradient stop listeners
        this.setupGradientStopListeners();
    }

    /**
     * Handles changes to canvas properties (background color, width, height).
     */
    handleCanvasPropertyChange(e) {
        const property = e.target.dataset.property;
        let value = e.target.value;

        switch (property) {
            case 'canvasBackgroundColor':
                this.canvas.backgroundColor = value;
                // Also update the wrapper's background color for immediate visual feedback
                const canvasWrapper = document.querySelector('.bubble-canvas-wrapper');
                if (canvasWrapper) {
                    canvasWrapper.style.backgroundColor = value;
                }
                break;
            case 'canvasWidth':
                this.canvas.setWidth(parseInt(value));
                break;
            case 'canvasHeight':
                this.canvas.setHeight(parseInt(value));
                break;
        }
        this.canvas.renderAll();
        this.saveCanvasState(); // Save state after canvas property change
        this._showMessage(`Canvas ${property.replace('canvas', '').toLowerCase()} updated!`, 'success');
    }

    /** Toggles between flat color and gradient fill options for objects. */
    toggleFillType(type) {
        const panel = document.getElementById('properties-panel');
        if (!panel) return;
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;

        const flatOptions = panel.querySelector('.flat-color-options');
        const gradientOptions = panel.querySelector('.gradient-options');
        const flatToggle = panel.querySelector('.flat-color-toggle');
        const gradientToggle = panel.querySelector('.gradient-color-toggle');

        flatToggle.classList.remove('active');
        gradientToggle.classList.remove('active');
        flatOptions.classList.remove('active');
        gradientOptions.classList.remove('active');

        if (type === 'flat') {
            flatToggle.classList.add('active');
            flatOptions.classList.add('active');
            // Revert to flat color, use current color if it's already a string, otherwise default
            activeObject.set('fill', this.rgbToHex(activeObject.fill && typeof activeObject.fill === 'string' ? activeObject.fill : (this.options.primaryColor || '#000000')));
        } else {
            gradientToggle.classList.add('active');
            gradientOptions.classList.add('active');
            // Initialize a default linear gradient if not already present
            if (!activeObject.fill || typeof activeObject.fill === 'string') {
                activeObject.set('fill', new fabric.Gradient({
                    type: 'linear',
                    coords: { x1: 0, y1: 0, x2: activeObject.width, y2: 0 },
                    colorStops: [
                        { offset: 0, color: this.rgbToHex(this.options.primaryColor) },
                        { offset: 1, color: this._darkenHex(this.options.primaryColor, 30) }
                    ]
                }));
            }
        }
        this.canvas.requestRenderAll();
        this.updatePropertiesPanel(); // Re-render to show updated controls
        this.saveCanvasState();
    }

    /** Generates HTML for gradient color stops for objects. */
    getGradientStopsHtml(gradient) {
        if (!gradient || !gradient.colorStops) return '';

        let html = '';
        gradient.colorStops.forEach((stop, index) => {
            html += `
                <div class="property-row gradient-color-row">
                    <span class="property-label">Color ${index + 1}</span>
                    <input type="color" class="gradient-color-input" data-stop-index="${index}" value="${this.rgbToHex(stop.color)}">
                    <input type="range" min="0" max="1" step="0.01" class="gradient-offset-input" data-stop-index="${index}" value="${stop.offset}">
                    ${gradient.colorStops.length > 2 ? `<button class="gradient-remove-stop-btn" data-stop-index="${index}">&times;</button>` : ''}
                </div>`;
        });
        return html;
    }

    /** Adds a new gradient stop to an object. */
    addGradientStop() {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject || typeof activeObject.fill === 'string') return;

        const gradient = activeObject.fill;
        const newOffset = Math.min(1, Math.max(0, (gradient.colorStops[gradient.colorStops.length - 1].offset + 0.1))); // Example new offset
        gradient.colorStops.push({ offset: newOffset, color: '#FFFFFF' }); // Default new stop to white
        gradient.colorStops.sort((a, b) => a.offset - b.offset); // Keep stops ordered by offset

        this.updateObjectFill(activeObject, gradient);
        this.updatePropertiesPanel(); // Re-render to show new stops
        this.saveCanvasState();
    }

    /** Sets up event listeners for dynamically created object gradient stops. */
    setupGradientStopListeners() {
        const panel = document.getElementById('properties-panel');
        if (!panel) return;

        panel.querySelectorAll('.gradient-color-input').forEach(input => {
            input.onchange = (e) => this.handleGradientChange(e.target, 'color');
        });
        panel.querySelectorAll('.gradient-offset-input').forEach(input => {
            input.onchange = (e) => this.handleGradientChange(e.target, 'offset');
            input.oninput = (e) => this.handleGradientChange(e.target, 'offset'); // For live update
        });
        panel.querySelectorAll('.gradient-remove-stop-btn').forEach(button => {
            button.onclick = (e) => this.removeGradientStop(parseInt(e.target.dataset.stopIndex));
        });
        panel.querySelector('[data-property="gradientType"]')?.addEventListener('change', (e) => this.handleGradientTypeChange(e.target.value));
    }

    /** Handles changes to object gradient color or offset. */
    handleGradientChange(input, type) {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject || typeof activeObject.fill === 'string') return;

        const gradient = activeObject.fill;
        const index = parseInt(input.dataset.stopIndex);
        if (type === 'color') {
            gradient.colorStops[index].color = input.value;
        } else if (type === 'offset') {
            gradient.colorStops[index].offset = parseFloat(input.value);
            gradient.colorStops.sort((a, b) => a.offset - b.offset); // Re-sort if offset changed
        }
        this.updateObjectFill(activeObject, gradient);
        this.canvas.requestRenderAll();
        this.saveCanvasState();
    }

    /** Handles change in object gradient type (linear/radial). */
    handleGradientTypeChange(newType) {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject || typeof activeObject.fill === 'string') return;

        const currentGradient = activeObject.fill;
        currentGradient.type = newType;

        // Recalculate coordinates based on type and object dimensions
        if (newType === 'linear') {
            currentGradient.coords = { x1: 0, y1: 0, x2: activeObject.width, y2: 0 };
        } else if (newType === 'radial') {
            currentGradient.coords = { x1: activeObject.width / 2, y1: activeObject.height / 2, r1: 0, x2: activeObject.width / 2, y2: activeObject.height / 2, r2: Math.max(activeObject.width, activeObject.height) / 2 };
        }
        this.updateObjectFill(activeObject, currentGradient);
        this.canvas.requestRenderAll();
        this.saveCanvasState();
    }

    /** Removes a gradient stop from an object. */
    removeGradientStop(indexToRemove) {
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject || typeof activeObject.fill === 'string') return;

        const gradient = activeObject.fill;
        if (gradient.colorStops.length <= 2) {
            this._showMessage('A gradient must have at least two color stops.', 'error');
            return;
        }
        gradient.colorStops.splice(indexToRemove, 1);
        this.updateObjectFill(activeObject, gradient);
        this.updatePropertiesPanel(); // Re-render to remove stop from UI
        this.saveCanvasState();
    }

    /** Helper to re-apply gradient to an object. */
    updateObjectFill(obj, gradient) {
        // Fabric.js requires recreating the gradient object to apply changes
        const newGradient = new fabric.Gradient(gradient);
        obj.set('fill', newGradient);
        obj.dirty = true;
    }

    /** Toggles between flat color and gradient fill options for the canvas background. */
    toggleCanvasFillType(type) {
        const panel = document.getElementById('properties-panel');
        if (!panel) return;

        const flatOptions = panel.querySelector('.canvas-flat-color-options');
        const gradientOptions = panel.querySelector('.canvas-gradient-options');
        const flatToggle = panel.querySelector('.canvas-color-type-toggle .flat-color-toggle');
        const gradientToggle = panel.querySelector('.canvas-color-type-toggle .gradient-color-toggle');

        flatToggle.classList.remove('active');
        gradientToggle.classList.remove('active');
        flatOptions.classList.remove('active');
        gradientOptions.classList.remove('active');

        if (type === 'flat') {
            flatToggle.classList.add('active');
            flatOptions.classList.add('active');
            this.canvas.backgroundColor = this.options.canvasBackgroundColor || '#FFFFFF'; // Revert to flat color
        } else {
            gradientToggle.classList.add('active');
            gradientOptions.classList.add('active');
            // Initialize a default linear gradient if not already present
            if (!this.canvas.backgroundColor || typeof this.canvas.backgroundColor === 'string') {
                this.canvas.backgroundColor = new fabric.Gradient({
                    type: 'linear',
                    coords: { x1: 0, y1: 0, x2: this.canvas.width, y2: 0 },
                    colorStops: [
                        { offset: 0, color: this.rgbToHex(this.options.primaryColor) },
                        { offset: 1, color: this._darkenHex(this.options.primaryColor, 30) }
                    ]
                });
            }
        }
        this.canvas.renderAll();
        // Update the wrapper background to ensure consistency
        const canvasWrapper = document.querySelector('.bubble-canvas-wrapper');
        if (canvasWrapper) {
            canvasWrapper.style.backgroundColor = ''; // Remove solid color if gradient
            if (typeof this.canvas.backgroundColor === 'object') {
                // For gradients, the Fabric.js canvas renders it itself, not the wrapper.
                // We keep the wrapper transparent or a fallback if needed.
            } else {
                canvasWrapper.style.backgroundColor = this.canvas.backgroundColor;
            }
        }
        this.updatePropertiesPanel(); // Re-render to show updated controls for canvas
        this.saveCanvasState();
    }

    /** Generates HTML for canvas background gradient color stops. */
    getCanvasGradientStopsHtml(gradient) {
        if (!gradient || !gradient.colorStops) return '';

        let html = '';
        gradient.colorStops.forEach((stop, index) => {
            html += `
                <div class="property-row canvas-gradient-color-row">
                    <span class="property-label">Color ${index + 1}</span>
                    <input type="color" class="canvas-gradient-color-input" data-stop-index="${index}" value="${this.rgbToHex(stop.color)}">
                    <input type="range" min="0" max="1" step="0.01" class="canvas-gradient-offset-input" data-stop-index="${index}" value="${stop.offset}">
                    ${gradient.colorStops.length > 2 ? `<button class="canvas-gradient-remove-stop-btn" data-stop-index="${index}">&times;</button>` : ''}
                </div>`;
        });
        return html;
    }

    /** Adds a new gradient stop to the canvas background. */
    addCanvasGradientStop() {
        if (!this.canvas.backgroundColor || typeof this.canvas.backgroundColor === 'string') {
            this._showMessage('Canvas must have a gradient background to add stops.', 'error');
            return;
        }

        const gradient = this.canvas.backgroundColor;
        const newOffset = Math.min(1, Math.max(0, (gradient.colorStops[gradient.colorStops.length - 1].offset + 0.1))); // Example new offset
        gradient.colorStops.push({ offset: newOffset, color: '#FFFFFF' }); // Default new stop to white
        gradient.colorStops.sort((a, b) => a.offset - b.offset); // Keep stops ordered by offset

        this.updateCanvasFill(gradient);
        this.updatePropertiesPanel(); // Re-render to show new stops
        this.saveCanvasState();
    }

    /** Sets up event listeners for dynamically created canvas gradient stops. */
    setupCanvasGradientStopListeners() {
        const panel = document.getElementById('properties-panel');
        if (!panel) return;

        panel.querySelectorAll('.canvas-gradient-color-input').forEach(input => {
            input.onchange = (e) => this.handleCanvasGradientChange(e.target, 'color');
        });
        panel.querySelectorAll('.canvas-gradient-offset-input').forEach(input => {
            input.onchange = (e) => this.handleCanvasGradientChange(e.target, 'offset');
            input.oninput = (e) => this.handleCanvasGradientChange(e.target, 'offset'); // For live update
        });
        panel.querySelectorAll('.canvas-gradient-remove-stop-btn').forEach(button => {
            button.onclick = (e) => this.removeCanvasGradientStop(parseInt(e.target.dataset.stopIndex));
        });
        panel.querySelector('[data-property="canvasGradientType"]')?.addEventListener('change', (e) => this.handleCanvasGradientTypeChange(e.target.value));
    }

    /** Handles changes to canvas background gradient color or offset. */
    handleCanvasGradientChange(input, type) {
        if (!this.canvas.backgroundColor || typeof this.canvas.backgroundColor === 'string') return;

        const gradient = this.canvas.backgroundColor;
        const index = parseInt(input.dataset.stopIndex);
        if (type === 'color') {
            gradient.colorStops[index].color = input.value;
        } else if (type === 'offset') {
            gradient.colorStops[index].offset = parseFloat(input.value);
            gradient.colorStops.sort((a, b) => a.offset - b.offset); // Re-sort if offset changed
        }
        this.updateCanvasFill(gradient);
        this.canvas.renderAll();
        this.saveCanvasState();
    }

    /** Handles change in canvas background gradient type (linear/radial). */
    handleCanvasGradientTypeChange(newType) {
        if (!this.canvas.backgroundColor || typeof this.canvas.backgroundColor === 'string') return;

        const currentGradient = this.canvas.backgroundColor;
        currentGradient.type = newType;

        // Recalculate coordinates based on type and canvas dimensions
        if (newType === 'linear') {
            currentGradient.coords = { x1: 0, y1: 0, x2: this.canvas.width, y2: 0 };
        } else if (newType === 'radial') {
            currentGradient.coords = { x1: this.canvas.width / 2, y1: this.canvas.height / 2, r1: 0, x2: this.canvas.width / 2, y2: this.canvas.height / 2, r2: Math.max(this.canvas.width, this.canvas.height) / 2 };
        }
        this.updateCanvasFill(currentGradient);
        this.canvas.renderAll();
        this.saveCanvasState();
    }

    /** Removes a gradient stop from the canvas background. */
    removeCanvasGradientStop(indexToRemove) {
        if (!this.canvas.backgroundColor || typeof this.canvas.backgroundColor === 'string') return;

        const gradient = this.canvas.backgroundColor;
        if (gradient.colorStops.length <= 2) {
            this._showMessage('A gradient must have at least two color stops.', 'error');
            return;
        }
        gradient.colorStops.splice(indexToRemove, 1);
        this.updateCanvasFill(gradient);
        this.updatePropertiesPanel(); // Re-render to remove stop from UI
        this.saveCanvasState();
    }

    /** Helper to re-apply gradient to canvas background. */
    updateCanvasFill(gradient) {
        // Fabric.js requires recreating the gradient object to apply changes
        const newGradient = new fabric.Gradient(gradient);
        this.canvas.backgroundColor = newGradient;
    }


    /** Updates the layers panel. */
    updateLayersPanel() {
        const layerList = document.getElementById('layer-list');
        if (!layerList) return;

        // Clear existing list items before re-populating to ensure correct order
        layerList.innerHTML = '';

        // Get all objects on the canvas, reversed to show top-most first (like Photoshop/Canva)
        // Ensure this.canvas is not null before calling getObjects()
        const objects = this.canvas ? this.canvas.getObjects().reverse() : [];
        const activeObject = this.canvas ? this.canvas.getActiveObject() : null;

        if (objects.length === 0) {
            layerList.innerHTML = '<p style="text-align:center; color:#b3b3c6; padding-top:20px;">No layers yet.</p>';
            return;
        }

        // Generate HTML for each layer item
        objects.forEach(obj => {
            obj.id = obj.id || obj.type + Date.now() + '-' + Math.floor(Math.random() * 1000); // Ensures uniqueness
            const isSelected = activeObject && activeObject.id === obj.id; // Compare by ID for robustness
            const isVisible = obj.visible;
            let layerName = obj.type.charAt(0).toUpperCase() + obj.type.slice(1);
            let layerIcon = 'fas fa-cube'; // Default icon

            // Determine layer name and icon based on object type
            switch (obj.type) {
                case 'i-text':
                case 'text':
                    layerName = obj.text ? (obj.text.substring(0, 20) + (obj.text.length > 20 ? '...' : '')) : 'Text';
                    layerIcon = 'fas fa-font';
                    break;
                case 'sticker':
                    layerName = obj.text;
                    layerIcon = 'fas fa-smile';
                    break;
                case 'image':
                    layerName = 'Image';
                    layerIcon = 'fas fa-image';
                    break;
                case 'icon': // For Font Awesome icons added via element panel
                    const foundElement = this.elements.find(el => el.type === 'icon' && obj.fontFamily === 'Font Awesome 6 Free' && (obj.text === (this._getIconUnicode(el.name) || obj.text)));
                    layerName = foundElement ? foundElement.name : 'Icon';
                    layerIcon = foundElement ? foundElement.icon : 'fas fa-star'; 
                    break;
                case 'rect':
                case 'roundedRect':
                    layerName = 'Rectangle';
                    layerIcon = 'fas fa-square';
                    break;
                case 'circle':
                    layerName = 'Circle';
                    layerIcon = 'fas fa-circle';
                    break;
                case 'triangle':
                    layerName = 'Triangle';
                    layerIcon = 'fas fa-play';
                    break;
                case 'line':
                    layerName = 'Line';
                    layerIcon = 'fas fa-slash';
                    break;
                case 'star':
                    layerName = 'Star Shape';
                    layerIcon = 'fas fa-star';
                    break;
                case 'arrow':
                    layerName = 'Arrow';
                    layerIcon = 'fas fa-arrow-right';
                    break;
                case 'heart':
                    layerName = 'Heart Shape';
                    layerIcon = 'fas fa-heart';
                    break;
                case 'diamond':
                    layerName = 'Diamond';
                    layerIcon = 'fas fa-gem';
                    break;
                case 'polygon':
                    layerName = `Polygon (${obj.points ? obj.points.length : 'N/A'} sides)`;
                    layerIcon = 'fas fa-cube';
                    break;
                case 'cloud':
                    layerName = 'Cloud';
                    layerIcon = 'fas fa-cloud';
                    break;
                case 'sun':
                    layerName = 'Sun';
                    layerIcon = 'fas fa-sun';
                    break;
                case 'moon':
                    layerName = 'Moon';
                    layerIcon = 'fas fa-moon';
                    break;
                default:
                    layerName = obj.type.charAt(0).toUpperCase() + obj.type.slice(1);
                    layerIcon = 'fas fa-cube';
                    break;
            }

            const listItemHtml = `
                <div class="layer-list-item ${isSelected ? 'selected' : ''}" data-object-id="${obj.id}">
                    <span class="layer-icon"><i class="${layerIcon}"></i></span>
                    <span class="layer-name" title="${obj.type === 'i-text' || obj.type === 'text' || obj.type === 'sticker' ? obj.text : layerName}">${layerName}</span>
                    <div class="layer-actions">
                        <button class="layer-action-btn visibility-toggle ${isVisible ? '' : 'hidden'}" data-action="toggle-visibility">
                            <i class="fas ${isVisible ? 'fa-eye' : 'fa-eye-slash'}"></i>
                        </button>
                        <button class="layer-action-btn delete-layer" data-action="delete-layer">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            layerList.insertAdjacentHTML('beforeend', listItemHtml);
        });

        // Add event listeners to each newly created layer item
        layerList.querySelectorAll('.layer-list-item').forEach(item => {
            const objectId = item.dataset.objectId;

            item.addEventListener('click', (e) => {
                if (e.target.closest('.layer-action-btn')) return;

                const clickedObj = this.canvas.getObjects().find(obj => obj.id === objectId);
                if (clickedObj) {
                    this.canvas.setActiveObject(clickedObj);
                    this.canvas.renderAll();
                }
            });

            item.querySelector('.visibility-toggle').addEventListener('click', (e) => {
                e.stopPropagation();
                const obj = this.canvas.getObjects().find(o => o.id === objectId);
                if (obj) {
                    obj.visible = !obj.visible;
                    this.canvas.renderAll();
                    this.updateLayersPanel();
                    this.saveCanvasState(); // Save state after visibility change
                    this._showMessage(obj.visible ? `${obj.type} is now visible` : `${obj.type} is now hidden`, 'success');
                }
            });

            item.querySelector('.delete-layer').addEventListener('click', (e) => {
                e.stopPropagation();
                const obj = this.canvas.getObjects().find(o => o.id === objectId);
                if (obj) {
                    this.canvas.remove(obj);
                    this.saveCanvasState(); // Save state after deletion
                    this._showMessage(`${obj.type} deleted`, 'success');
                }
            });
        });
    }

    // Helper to get Font Awesome unicode for layer panel display (approximation)
    _getIconUnicode(iconName) {
        const iconUnicodeMap = {
            'Bell': '\uf0f3', 'Home': '\uf015', 'Building': '\uf1ad',
            'Car': '\uf1b9', 'Plane': '\uf072', 'Bicycle': '\uf206', 'Tree': '\uf1bb',
            'Leaf': '\uf06c', 'Camera': '\uf030', 'Video': '\uf03d', 'Music Note': '\uf001',
            'Book': '\uf02d', 'Lightbulb': '\uf0eb', 'Search': '\uf002', 'Thumbs Up': '\uf164',
            'Check Mark': '\uf00c', 'Cross': '\uf00d', 'Plus': '\uf067', 'Minus': '\uf068',
            'Folder': '\uf07b', 'Document': '\uf15c', 'Gear': '\uf013', 'Puzzle': '\uf12e',
            'Bolt': '\uf0e7', 'Tint': '\uf043', 'Crown': '\uf521', 'Shield': '\uf3ed',
            'Flag': '\uf024', 'Map Pin': '\uf041', 'Wifi': '\uf1eb', 'Battery': '\uf240',
            'Cloud': '\uf0c2', 'Sun': '\uf185', 'Moon': '\uf186', 'Star': '\uf005'
        };
        return iconUnicodeMap[iconName] || null;
    }

    rgbToHex(color) {
        if (!color) { return '#000000'; }
        if (color[0] === '#') { return color; }
        const rgb = color.match(/\d+/g);
        if (!rgb) { return '#000000'; }
        return '#' + rgb.slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('');
    }
    clearPropertiesPanel() {
        const panel = document.getElementById('properties-panel');
        if (panel) {
            const isCanvasGradient = this.canvas.backgroundColor && typeof this.canvas.backgroundColor === 'object';
            panel.innerHTML = `
                <div class="property-group">
                    <h4>Canvas Properties</h4>
                    <div class="canvas-color-type-toggle">
                        <button class="flat-color-toggle ${!isCanvasGradient ? 'active' : ''}" data-canvas-color-type="flat">Flat Color</button>
                        <button class="gradient-color-toggle ${isCanvasGradient ? 'active' : ''}" data-canvas-color-type="gradient">Gradient</button>
                    </div>
                    <div class="canvas-flat-color-options ${!isCanvasGradient ? 'active' : ''}">
                        <div class="property-row">
                            <span class="property-label">Background</span>
                            <input type="color" class="property-input" data-property="canvasBackgroundColor" value="${this.rgbToHex(this.canvas.backgroundColor && typeof this.canvas.backgroundColor === 'string' ? this.canvas.backgroundColor : (this.options.canvasBackgroundColor || '#FFFFFF'))}">
                        </div>
                    </div>
                    <div class="canvas-gradient-options ${isCanvasGradient ? 'active' : ''}">
                        <div class="property-row">
                            <span class="property-label">Type</span>
                            <select class="property-input" data-property="canvasGradientType">
                                <option value="linear" ${this.canvas.backgroundColor?.type === 'linear' ? 'selected' : ''}>Linear</option>
                                <option value="radial" ${this.canvas.backgroundColor?.type === 'radial' ? 'selected' : ''}>Radial</option>
                            </select>
                        </div>
                        <div id="canvas-gradient-stops-container">
                            ${this.getCanvasGradientStopsHtml(this.canvas.backgroundColor)}
                        </div>
                        <button class="canvas-gradient-add-stop-btn">Add Stop</button>
                    </div>
                    <div class="property-row">
                        <span class="property-label">Width</span>
                        <input type="number" class="property-input" data-property="canvasWidth" value="${this.canvas.width}">
                    </div>
                    <div class="property-row">
                        <span class="property-label">Height</span>
                        <input type="number" class="property-input" data-property="canvasHeight" value="${this.canvas.height}">
                    </div>
                </div>
            `;
            // Add listeners for canvas properties
            panel.querySelector('[data-property="canvasBackgroundColor"]')?.addEventListener('change', this.handleCanvasPropertyChange.bind(this));
            panel.querySelector('[data-property="canvasWidth"]')?.addEventListener('change', this.handleCanvasPropertyChange.bind(this));
            panel.querySelector('[data-property="canvasHeight"]')?.addEventListener('change', this.handleCanvasPropertyChange.bind(this));

            // Listeners for canvas color/gradient toggle
            panel.querySelector('.canvas-color-type-toggle .flat-color-toggle')?.addEventListener('click', () => this.toggleCanvasFillType('flat'));
            panel.querySelector('.canvas-color-type-toggle .gradient-color-toggle')?.addEventListener('click', () => this.toggleCanvasFillType('gradient'));
            panel.querySelector('.canvas-gradient-add-stop-btn')?.addEventListener('click', this.addCanvasGradientStop.bind(this));
            this.setupCanvasGradientStopListeners(); // Setup listeners for gradient stops
        }
    }
    getFontDropdown(property, current) {
        // Extended list of web-safe fonts and popular Google Fonts (assuming they are loaded via link in head)
        const fonts = [
            'Poppins', 'Inter', 'Roboto', 'Lato', 'Montserrat', 'Open Sans', 'Raleway', 'Merriweather',
            'Nunito', 'Quicksand', 'Oswald', 'Source Sans Pro',
            'Arial', 'Verdana', 'Tahoma', 'Times New Roman', 'Georgia', 'Courier New', 'Impact',
            'Comic Sans MS', 'Lucida Sans Unicode', 'Palatino Linotype', 'Garamond', 'Book Antiqua',
            'Trebuchet MS', 'Segoe UI'
        ];
        let html = `<select class="property-input" data-property="${property}">`;
        fonts.forEach(font => { html += `<option value="${font}" ${current && font.toLowerCase() === current.toLowerCase() ? 'selected' : ''} style="font-family:'${font}';">${font}</option>`; });
        html += '</select>';
        return html;
    }
    handlePropertyChange(e) {
        const property = e.target.dataset.property;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        const activeObject = this.canvas.getActiveObject();
        if (!activeObject) return;

        // No longer need shouldSaveState flag here, as Fabric.js event listeners handle it.

        if (property === 'width') {
            if (activeObject.type === 'circle') { activeObject.set('radius', parseFloat(value) / 2); }
            else { activeObject.set('scaleX', parseFloat(value) / (activeObject.width / (activeObject.scaleX || 1))); }
        }
        else if (property === 'height') {
             if (activeObject.type === 'circle') { activeObject.set('radius', parseFloat(value) / 2); }
            else { activeObject.set('scaleY', parseFloat(value) / (activeObject.height / (activeObject.scaleY || 1))); }
        }
        else if (property === 'padding') { activeObject.set('padding', parseFloat(value)); }
        else if (property === 'left' || property === 'top' || property === 'angle' || property === 'opacity' || property === 'fontSize' || property === 'strokeWidth') { activeObject.set(property, parseFloat(value)); }
        else if (property === 'scaleX' || property === 'scaleY') { activeObject.set(property, parseFloat(value)); }
        else if (property === 'fill' || property === 'stroke' || property === 'fontFamily' || property === 'text' || property === 'textAlign') {
            // Special handling for fill when it's a flat color from the picker
            if (property === 'fill' && typeof activeObject.fill === 'object' && activeObject.fill !== null && activeObject.fill.type) {
                // If it was a gradient, but now a flat color is being applied from the picker
                activeObject.set('fill', value);
                // After changing to flat color, re-render properties panel to show flat color options
                this.updatePropertiesPanel(); // Re-render to update UI for fill type
            } else {
                activeObject.set(property, value);
            }
        }
        else if (property === 'lockMovement') { activeObject.set({ lockMovementX: value, lockMovementY: value }); }
        else if (property === 'lockScaling') { activeObject.set({ lockScalingX: value, lockScalingY: value }); }

        // Handle specific properties for rounded rectangles if they are custom Fabric.js objects
        if (activeObject.type === 'roundedRect') {
            if (property === 'rx' || property === 'ry') {
                activeObject.set(property, parseFloat(value));
            }
        }


        if (activeObject.type === 'group') {
            const targetSubObject = e.target.dataset.target;
            if (targetSubObject === 'bg') { activeObject._objects[0].set(property, value); }
            else if (targetSubObject === 'text') { activeObject._objects[1].set(property, value); }
            activeObject._restoreObjectsState();
            activeObject.setCoords();
        }
        this.canvas.requestRenderAll();
        // Fabric.js 'object:modified' event will trigger saveCanvasState,
        // so no need to explicitly call it here for every input/change.
    }

    // --- CONTEXT MENU AND KEYBOARD SHORTCUT METHODS ---
    /** Handles the right-click event on the canvas. */
    handleContextMenu(e) {
        console.log("Context menu opened.");
        e.preventDefault();
        this.contextMenu = document.getElementById('custom-context-menu');
        if (!this.contextMenu) { console.error("Context menu element not found!"); return; }

        this.contextMenu.style.left = `${e.pageX}px`;
        this.contextMenu.style.top = `${e.pageY}px`;
        this.contextMenu.style.display = 'block';

        const activeObject = this.canvas.getActiveObject();
        this.updateContextMenuState(activeObject);

        this.contextMenu.querySelectorAll('li').forEach(item => {
            item.onclick = null; // Remove previous listeners to prevent multiple firings
            item.onclick = (event) => {
                event.stopPropagation();
                if (item.classList.contains('disabled') || item.classList.contains('separator')) return;
                const action = item.dataset.action;
                this.performContextAction(action);
                this.hideContextMenu();
            };
        });
    }
    /** Hides the custom context menu. */
    hideContextMenu() {
        if (this.contextMenu) { this.contextMenu.style.display = 'none'; }
    }
    /** Updates the enabled/disabled state of context menu items. */
    updateContextMenuState(activeObject) {
        const menu = this.contextMenu;
        if (!menu) return;
        const deleteItem = menu.querySelector('[data-action="delete"]');
        const copyItem = menu.querySelector('[data-action="copy"]');
        const pasteItem = menu.querySelector('[data-action="paste"]');
        const copyStyleItem = menu.querySelector('[data-action="copy-style"]');
        const pasteStyleItem = menu.querySelector('[data-action="paste-style"]');
        const bringForwardItem = menu.querySelector('[data-action="bring-forward"]');
        const sendBackwardItem = menu.querySelector('[data-action="send-backward"]');
        const hasActiveObject = !!activeObject;
        deleteItem?.classList.toggle('disabled', !hasActiveObject);
        copyItem?.classList.toggle('disabled', !hasActiveObject);
        copyStyleItem?.classList.toggle('disabled', !hasActiveObject);
        bringForwardItem?.classList.toggle('disabled', !hasActiveObject);
        sendBackwardItem?.classList.toggle('disabled', !hasActiveObject);
        pasteItem?.classList.toggle('disabled', !this.copiedObject);
        pasteStyleItem?.classList.toggle('disabled', !this.copiedStyle);
    }
    /** Performs the action associated with a context menu item. */
    performContextAction(action) {
        console.log(`Performing context action: ${action}`);
        switch (action) {
            case 'delete': this.deleteActiveObject(); break;
            case 'copy': this.copyObject(); break;
            case 'paste': this.pasteObject(); break;
            case 'copy-style': this.copyObjectStyle(); break;
            case 'paste-style': this.pasteObjectStyle(); break;
            case 'bring-forward': this.bringObjectForward(); break;
            case 'send-backward': this.sendObjectBackward(); break;
            default: console.warn(`Unknown context action: ${action}`);
        }
        // saveCanvasState is triggered by object:modified/added/removed events
    }
    /** Deletes the currently active object. */
    deleteActiveObject() {
        console.log("Deleting active object...");
        const obj = this.canvas.getActiveObject();
        if (obj) { this.canvas.remove(obj); this.canvas.discardActiveObject(); this.clearPropertiesPanel(); this.canvas.renderAll();
            this._showMessage(`${obj.type} deleted`, 'success');
        }
    }
    /** Copies the currently active object. */
    copyObject() {
        console.log("Copying object...");
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            activeObject.clone((clonedObj) => { this.copiedObject = clonedObj; console.log('Object copied:', this.copiedObject); this.updateContextMenuState(activeObject); }, STYLES_TO_COPY); // Ensure all properties are cloned
            this._showMessage('Object copied', 'success');
        } else {
            console.warn("No active object to copy.");
            this._showMessage('No object selected to copy', 'error');
        }
    }
    /** Pastes the copied object. */
    pasteObject() {
        console.log("Pasting object...");
        if (!this.copiedObject) { console.warn("Nothing to paste."); this._showMessage('Nothing to paste', 'error'); return; }
        this.copiedObject.clone((clonedObj) => {
            this.canvas.discardActiveObject();
            clonedObj.set({ left: clonedObj.left + 10, top: clonedObj.top + 10, evented: true, selectable: true, id: (clonedObj.id || clonedObj.type) + '-cloned-' + Date.now() });
            if (clonedObj.type === 'activeSelection') { clonedObj.canvas = this.canvas; clonedObj.forEachObject((obj) => { this.canvas.add(obj); }); clonedObj.setCoords(); }
            else { this.canvas.add(clonedObj); }
                this.canvas.setActiveObject(clonedObj); this.canvas.requestRenderAll();
            this._showMessage('Object pasted', 'success');
        }, STYLES_TO_COPY); // Ensure all properties are cloned during paste
    }
    /** Copies the style properties of the active object. */
    copyObjectStyle() {
        console.log("Copying style...");
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            const styleToSave = {};
            STYLES_TO_COPY.forEach(prop => {
                if (activeObject[prop] !== undefined) {
                    if (typeof activeObject[prop] === 'object' && activeObject[prop] !== null && typeof activeObject[prop].clone === 'function') {
                        styleToSave[prop] = activeObject[prop].clone();
                    } else if (typeof activeObject[prop] === 'object' && activeObject[prop] !== null) {
                        styleToSave[prop] = JSON.parse(JSON.stringify(activeObject[prop])); // Deep copy for generic objects
                    }
                    else {
                        styleToSave[prop] = activeObject[prop];
                    }
                }
            });

            this.copiedStyle = styleToSave;
            console.log('Style copied:', this.copiedStyle);
            this.updateContextMenuState(activeObject);
            this._showMessage('Style copied', 'success');
        } else {
            console.warn("No active object to copy style from.");
            this._showMessage('No object selected to copy style', 'error');
        }
    }
    /** Pastes the copied style onto the active object. */
    pasteObjectStyle() {
        console.log("Pasting style...");
        const activeObject = this.canvas.getActiveObject();
        if (activeObject && this.copiedStyle) {
            activeObject.setOptions(this.copiedStyle); // Use setOptions for robust application

            // Manually trigger updates for specific properties that might need it
            if (activeObject.type === 'i-text' || activeObject.type === 'text' || activeObject.type === 'sticker') {
                if (this.copiedStyle.text !== undefined) activeObject.set('text', this.copiedStyle.text); // Ensure text content updates if included
                activeObject.dirty = true; // Mark as dirty for filter updates etc.
            } else if (activeObject.type === 'image' && activeObject.filters && activeObject.filters.length > 0) {
                activeObject.applyFilters(); // Apply any copied filters
            }

            activeObject.setCoords(); // Update object controls and bounding box
            this.canvas.requestRenderAll(); // Request a canvas re-render
            this.updatePropertiesPanel(); // Refresh properties panel to show new styles
            this.saveCanvasState(); // Save state after pasting style
            this._showMessage('Style pasted', 'success');
        } else {
            console.warn("No active object or no style copied to paste.");
            this._showMessage('No object selected or no style copied', 'error');
        }
    }
    /** Brings active object one step forward. */
    bringObjectForward() {
        console.log("Attempting to bring object forward...");
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            activeObject.bringForward(); // Moves one step forward in stack
            this.canvas.renderAll();
            this.updateLayersPanel(); // Update layer order in panel
            this.saveCanvasState(); // Save state after reordering
            this._showMessage(`Moved ${activeObject.type} forward`, 'success');
        } else {
            console.warn("No active object to bring forward.");
            this._showMessage('No object selected', 'error');
        }
    }
    /** Sends active object one step backward. */
    sendObjectBackward() {
        console.log("Attempting to send object backward...");
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            activeObject.sendBackwards(); // Moves one step backward in stack
            this.canvas.renderAll();
            this.updateLayersPanel(); // Update layer order in panel
            this.saveCanvasState(); // Save state after reordering
            this._showMessage(`Moved ${activeObject.type} backward`, 'success');
        } else {
            console.warn("No active object to send backward.");
            this._showMessage('No object selected', 'error');
        }
    }

    /** Brings active layer to front (absolute). */
    bringActiveLayerToFront() {
        console.log("Bringing active layer to absolute front...");
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.bringToFront(activeObject);
            console.log("Object brought to front.");
            this.canvas.renderAll();
            this.updateLayersPanel();
            this.saveCanvasState(); // Save state after reordering
            this._showMessage(`Moved ${activeObject.type} to front`, 'success');
        } else {
            console.warn("No active object to bring to front.");
            this._showMessage('No object selected', 'error');
        }
    }

    /** Sends active layer to back (absolute). */
    sendActiveLayerToBack() {
        console.log("Sending active layer to absolute back...");
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.sendToBack(activeObject);
            console.log("Object sent to back.");
            this.canvas.renderAll();
            this.updateLayersPanel();
            this.saveCanvasState(); // Save state after reordering
            this._showMessage(`Moved ${activeObject.type} to back`, 'success');
        } else {
            console.warn("No active object to send to back.");
            this._showMessage('No object selected', 'error');
        }
    }

    /** Handles global keyboard shortcuts. */
    handleKeyboardShortcuts(e) {
        if (!this.canvas || !this.isCanvasInitialized) return;
        const activeObject = this.canvas.getActiveObject();
        const isCtrlCmd = e.ctrlKey || e.metaKey;
        const isInputFocused = document.activeElement && ( document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable );
        if (isInputFocused) { return; }
        if (e.key === 'Delete' || e.key === 'Backspace') { if (activeObject) { this.deleteActiveObject(); e.preventDefault(); } }
        else if (isCtrlCmd && e.key === 'c') { this.copyObject(); e.preventDefault(); }
        else if (isCtrlCmd && e.key === 'v') { this.pasteObject(); e.preventDefault(); }
        else if (isCtrlCmd && e.key === 'd') { this.duplicateObject(); e.preventDefault(); }
        else if (isCtrlCmd && e.altKey && e.key === 'c') { this.copyObjectStyle(); e.preventDefault(); }
        else if (isCtrlCmd && e.altKey && e.key === 'v') { this.pasteObjectStyle(); e.preventDefault(); }
        else if (isCtrlCmd && e.key === 'z') { this.undo(); e.preventDefault(); } // Undo
        else if (isCtrlCmd && e.key === 'y') { this.redo(); e.preventDefault(); } // Redo
    }

    /** Duplicates the active object. */
    duplicateObject() {
        console.log("Duplicating object...");
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            activeObject.clone((clonedObj) => {
                this.canvas.discardActiveObject();
                clonedObj.set({ left: activeObject.left + 20, top: activeObject.top + 20, evented: true, selectable: true, id: (clonedObj.id || clonedObj.type) + '-duplicated-' + Date.now() });
                if (clonedObj.type === 'activeSelection') { clonedObj.canvas = this.canvas; clonedObj.forEachObject((obj) => { this.canvas.add(obj); }); clonedObj.setCoords(); }
                else { this.canvas.add(clonedObj); }
                this.canvas.setActiveObject(clonedObj); this.canvas.requestRenderAll();
                this._showMessage('Object duplicated', 'success');
            }, STYLES_TO_COPY); // Ensure all properties are cloned during duplication
        } else {
            console.warn("No active object to duplicate.");
            this._showMessage('No object selected to duplicate', 'error');
        }
    }

    // --- Undo/Redo Methods ---
    /** Saves the current canvas state to history. */
    saveCanvasState() {
        if (this.isUndoing || this.isRedoing) return; // Don't save state during undo/redo operations

        // Serialize canvas to JSON, including background color (which can be a gradient)
        const json = JSON.stringify(this.canvas.toJSON(STYLES_TO_COPY.concat(['backgroundColor']))); // Ensure backgroundColor is serialized
        
        if (this.historyPointer < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyPointer + 1); // Truncate redo history
        }
        this.history.push(json);
        this.historyPointer = this.history.length - 1;
        this.updateUndoRedoButtons();
        console.log('Canvas state saved. History length:', this.history.length, 'Pointer:', this.historyPointer);
        
        // Auto-save to localStorage
        this.saveToLocalStorage();
    }
    
    /** Saves the current canvas state to localStorage */
    saveToLocalStorage() {
        try {
            // Get the current canvas state with all necessary properties
            const additionalProps = ['id', 'selectable', 'evented', 'text', 'fontSize', 'fontFamily', 
                'fontWeight', 'fontStyle', 'textAlign', 'lineHeight', 'underline', 'overline', 
                'linethrough', 'charSpacing', 'angle', 'opacity', 'scaleX', 'scaleY', 'flipX', 'flipY', 
                'skewX', 'skewY', 'originX', 'originY', 'src', 'crossOrigin', 'filters'];
            
            const canvasState = this.canvas.toJSON(STYLES_TO_COPY.concat(['backgroundColor']).concat(additionalProps));
            
            // Save to localStorage
            localStorage.setItem('bubbleDesignerState', JSON.stringify(canvasState));
            console.log('Canvas state auto-saved to localStorage with enhanced properties');
        } catch (error) {
            console.error('Failed to auto-save canvas state to localStorage:', error);
        }
    }
    
    /** Loads the canvas state from localStorage if available */
    loadFromLocalStorage() {
        try {
            const savedState = localStorage.getItem('bubbleDesignerState');
            if (savedState) {
                const canvasState = JSON.parse(savedState);
                
                // Enhanced loading with proper object restoration
                this.canvas.loadFromJSON(canvasState, () => {
                    // Process each object to ensure proper rendering
                    this.canvas.getObjects().forEach(obj => {
                        // Mark objects as loaded from storage to prevent repositioning
                        obj._loadedFromStorage = true;
                        
                        // Preserve exact position and properties for all objects
                        obj.set({
                            selectable: true,
                            evented: true,
                            // Explicitly preserve left and top positions
                            left: obj.left,
                            top: obj.top,
                            // Preserve scaling
                            scaleX: obj.scaleX,
                            scaleY: obj.scaleY,
                            // Preserve angle/rotation
                            angle: obj.angle,
                            // Preserve origin points
                            originX: obj.originX || 'center',
                            originY: obj.originY || 'center'
                        });
                        
                        // Special handling for text objects
                        if (obj.type === 'i-text' || obj.type === 'text') {
                            // Ensure text properties are preserved
                            obj.set({
                                fontFamily: obj.fontFamily,
                                fontSize: obj.fontSize,
                                fontWeight: obj.fontWeight,
                                fontStyle: obj.fontStyle,
                                textAlign: obj.textAlign,
                                lineHeight: obj.lineHeight,
                                underline: obj.underline,
                                overline: obj.overline,
                                linethrough: obj.linethrough,
                                charSpacing: obj.charSpacing
                            });
                        }
                        
                        // Special handling for stickers (emoji)
                        if (obj.type === 'sticker' || (obj.type === 'text' && obj.text && obj.text.match(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u))) {
                            obj.set({
                                editable: false,
                                // Ensure stickers keep their exact position
                                left: obj.left,
                                top: obj.top
                            });
                        }
                        
                        // Special handling for images
                        if (obj.type === 'image') {
                            // Force crossOrigin setting if needed
                            if (obj.crossOrigin !== 'anonymous') {
                                obj.crossOrigin = 'anonymous';
                            }
                        }
                        
                        // Force update coordinates to ensure proper positioning
                        obj.setCoords();
                    });
                    
                    this.canvas.renderAll();
                    this.updateLayersPanel();
                    this._showMessage('Previous design loaded successfully!', 'success');
                    console.log('Canvas state loaded from localStorage with precise position preservation');
                    
                    // Update the wrapper's background color if canvas background changed
                    const canvasWrapper = document.querySelector('.bubble-canvas-wrapper');
                    if (canvasWrapper) {
                        if (typeof this.canvas.backgroundColor === 'string' || this.canvas.backgroundColor === null) {
                            canvasWrapper.style.backgroundColor = this.canvas.backgroundColor || '';
                        } else {
                            canvasWrapper.style.backgroundColor = ''; // Clear if it's a gradient, as canvas handles it
                        }
                    }
                    
                    // Save initial state to history after loading
                    this.history = [];
                    this.historyPointer = -1;
                    this.saveCanvasState();
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to load canvas state from localStorage:', error);
            return false;
        }
    }

    /** Updates the enabled/disabled state of Undo/Redo buttons. */
    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        if (undoBtn) undoBtn.disabled = this.historyPointer <= 0;
        if (redoBtn) redoBtn.disabled = this.historyPointer >= this.history.length - 1;
    }

    /** Undoes the last action. */
    undo() {
        if (this.historyPointer <= 0) {
            this._showMessage('Nothing to undo!', 'info');
            return;
        }

        this.isUndoing = true;
        this.historyPointer--;
        const state = this.history[this.historyPointer];

        this.canvas.loadFromJSON(state, () => {
            this.canvas.renderAll();
            this.canvas.discardActiveObject(); // Clear selection after undo
            this.updateLayersPanel();
            this.updatePropertiesPanel(); // Re-render to reflect new canvas background or object props
            this.updateUndoRedoButtons();
            this.isUndoing = false;
            
            // Update the wrapper's background color if canvas background changed
            const canvasWrapper = document.querySelector('.bubble-canvas-wrapper');
            if (canvasWrapper) {
                if (typeof this.canvas.backgroundColor === 'string' || this.canvas.backgroundColor === null) {
                    canvasWrapper.style.backgroundColor = this.canvas.backgroundColor || '';
                } else {
                    canvasWrapper.style.backgroundColor = ''; // Clear if it's a gradient, as canvas handles it
                }
            }

            this._showMessage('Undo successful!', 'success');
            console.log('Undo performed. History length:', this.history.length, 'Pointer:', this.historyPointer);
        });
    }

    /** Redoes the last undone action. */
    redo() {
        if (this.historyPointer >= this.history.length - 1) {
            this._showMessage('Nothing to redo!', 'info');
            return;
        }

        this.isRedoing = true;
        this.historyPointer++;
        const state = this.history[this.historyPointer];

        this.canvas.loadFromJSON(state, () => {
            this.canvas.renderAll();
            this.canvas.discardActiveObject(); // Clear selection after redo
            this.updateLayersPanel();
            this.updatePropertiesPanel(); // Re-render to reflect new canvas background or object props
            this.updateUndoRedoButtons();
            this.isRedoing = false;

            // Update the wrapper's background color if canvas background changed
            const canvasWrapper = document.querySelector('.bubble-canvas-wrapper');
            if (canvasWrapper) {
                if (typeof this.canvas.backgroundColor === 'string' || this.canvas.backgroundColor === null) {
                    canvasWrapper.style.backgroundColor = this.canvas.backgroundColor || '';
                } else {
                    canvasWrapper.style.backgroundColor = ''; // Clear if it's a gradient, as canvas handles it
                }
            }
            this._showMessage('Redo successful!', 'success');
            console.log('Redo performed. History length:', this.history.length, 'Pointer:', this.historyPointer);
        });
    }
    // --- End Undo/Redo Methods ---
} // End of BubbleDesigner class

// This is required so that Bubble can use the class from your file.
window.BubbleDesigner = BubbleDesigner;

    }
 });
