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

            // Customization
            logoText: 'Bubble Designer',
            logoImage: '',
            primaryColor: '#4A6CF7', // Default value
            fontFamily: 'Poppins',

            ...options  // Bubble will override these
        };
        console.log('BubbleDesigner: Final options initialized in constructor:', this.options);

        this.stickers = [
            'ðŸ˜€', 'ðŸ˜‚', 'ðŸ˜', 'ðŸ¥³', 'ðŸ˜Ž', 'ðŸ¤©', 'ðŸ‘', 'â¤ï¸', 'ðŸ”¥', 'âœ¨', // Corrected emoji: 'ï¿½' changed to 'ðŸ¥³'
            'ðŸš€', 'ðŸŒˆ', 'ðŸ’¡', 'ðŸŽ‰', 'ðŸŒŸ', 'ðŸ’«', 'ðŸ’¯', 'âœ…', 'âŒ', 'â¤ï¸â€ðŸ”¥',
            'ðŸ†', 'ðŸ‘‘', 'ðŸ’¸', 'ðŸŽ¤', 'ðŸŽ§', 'ðŸ’»', 'ðŸ“±', 'ðŸ“š', 'ðŸŽµ', 'ðŸŽ¨',
            'ðŸ”', 'ðŸ•', 'â˜•', 'ðŸŽ', 'ðŸŽˆ', 'ðŸŽ‚', 'ðŸŽ„', 'ðŸŽƒ', 'ðŸŽ“', 'ðŸŒ¸'
        ];

        // Corrected stock image URL
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

            /* Canvas Container Styles */
            .bubble-canvas-container {
                flex: 1; display: flex; align-items: center; justify-content: center;
                background: rgba(255, 255, 255, 0.05); border-radius: 24px; margin: 0 20px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1); min-width: 0;
                height: 100%; /* Explicitly set height to 100% of its flex parent */
                overflow: hidden; /* Ensure canvas container also hides overflow if canvas is too big */
            }
            .bubble-canvas-wrapper {
                background: #fff; border-radius: 18px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
                padding: 14px; overflow: hidden; /* Ensures canvas itself doesn't cause overflow */
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
                box-shadow: -4px 0 32px 0 rgba(31, 38, 135, 0.13); padding: 36px 24px 36px 18px;
                margin-left: 20px; display: flex; flex-direction: column; align-items: flex-start;
                z-index: 30;
                height: 100%; /* Make it fill the height of .bubble-main */
                position: relative;
                transition: background 0.2s, box-shadow 0.2s; box-sizing: border-box;
            }

            /* Right Sidebar Tabs */
            .sidebar-tabs {
                display: flex; width: 100%; margin-bottom: 15px; background: rgba(30, 30, 45, 0.94);
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
                padding: 28px 14px 18px 14px; background: rgba(44, 44, 66, 0.98);
                border-radius: 16px; box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.05);
                min-width: 0; color: #fff; font-family: 'Poppins', sans-serif; margin: 0;
                flex-direction: column; gap: 16px; box-sizing: border-box; max-height: 100%;
                overflow-y: auto; scrollbar-width: thin; scrollbar-color: ${primaryColor} #292947; /* Dynamic scrollbar color */
                position: absolute; /* Positioned relative to .bubble-right-sidebar */
                top: 70px; left: 0; right: 0; bottom: 0; /* Cover full area of parent below tabs */
                height: auto; /* Let content dictate height, but respect parent bounds */
            }
            .properties-panel.active, .layers-panel.active {
                visibility: visible; opacity: 1; transition: opacity 0.2s ease-in-out;
                margin-top: 39px;
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
            }
            .property-group:last-child {
                border-bottom: none; margin-bottom: 0;
            }
            .property-row {
                display: flex; align-items: center; margin-bottom: 10px; gap: 10px;
            }
            .property-label {
                min-width: 70px; color: #b3b3c6; font-size: 0.98em;
            }
            .property-input[type="number"], .property-input[type="text"], .property-input[type="color"], .property-input select {
                flex: 1; border: none; outline: none; border-radius: 6px; padding: 6px 8px; background: #292947;
                color: #fff; font-size: 1em; box-sizing: border-box; transition: background 0.2s, box-shadow 0.2s;
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
            .property-delete-btn {
                background: #ff4d4f; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer;
                font-weight: 600; font-size: 0.95em; display: flex; align-items: center; gap: 8px; transition: background 0.2s, transform 0.1s;
            }
            .property-delete-btn:hover { background: #e63946; transform: translateY(-1px); }
            .property-delete-btn:active { transform: translateY(0); }

            /* LAYER PANEL STYLES */
            .layers-panel .layer-list { flex-grow: 1; padding-top: 10px; }
            .layer-list-item {
                display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: #292947;
                border-radius: 6px; margin-bottom: 8px; color: #e0e0e0; font-size: 0.9em; cursor: pointer;
                transition: background 0.15s, border 0.15s; border: 1px solid transparent; user-select: none;
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
            }
            .layer-control-btn {
                font-size: 0.9em; padding: 8px 12px; border-radius: 8px; background: ${primaryColor};
                color: #fff; border: none; cursor: pointer; transition: background 0.2s, transform 0.1s;
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
            .media-panel-options button i {
                font-size: 1.2em;
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
            console.error("âŒ Container not found:", this.options.container, ". This is critical. Ensure it's appended by Bubble's initialize and available.");
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
                    <div class="bubble-canvas-wrapper">
                        <canvas id="design-canvas" width="${this.options.width}" height="${this.options.height}" style="width: 100%; height: 100%;"></canvas>
                    </div>
                </div>

                <div class="bubble-right-sidebar">
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
                // Set background to null for transparency by default
                backgroundColor: null 
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
        this.canvas.on('object:modified', this.updatePropertiesPanel.bind(this));
        // Live updates for position, scale, rotation during drag/resize
        this.canvas.on('object:moving', this.updatePropertiesPanel.bind(this));
        this.canvas.on('object:scaling', this.updatePropertiesPanel.bind(this));
        this.canvas.on('object:rotating', this.updatePropertiesPanel.bind(this));

        // Listen for object added/removed to update layers panel
        this.canvas.on('object:added', this.updateLayersPanel.bind(this));
        this.canvas.on('object:removed', this.updateLayersPanel.bind(this));
        this.canvas.on('object:modified', this.updateLayersPanel.bind(this));

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
        // Set background to null for transparency when starting new canvas
        this.canvas.setBackgroundColor(null, this.canvas.renderAll.bind(this.canvas));
        this.clearPropertiesPanel();
        this.updateLayersPanel();
        this.openNewCanvasModal();
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
        // Ensure background is null (transparent) unless explicitly set otherwise
        this.canvas.setBackgroundColor(null, this.canvas.renderAll.bind(this.canvas));

        this.clearPropertiesPanel();
        this.updateLayersPanel();
        document.getElementById('canvasSizeModal').style.display = 'none';
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
                    // For PNG export, ensure background is transparent unless it's a solid object
                    dataURL = this.canvas.toDataURL({
                        format: 'png',
                        multiplier: scale,
                        enableRetinaScaling: true, // Improve quality on high-DPI screens
                        // If canvas has an explicit backgroundColor set, it will be included.
                        // If null (default from fix), it will be transparent.
                    });
                    this._downloadFile(dataURL, fileName + '.png');
                    break;
                case 'jpeg':
                    dataURL = this.canvas.toDataURL({
                        format: 'jpeg',
                        multiplier: scale,
                        quality: quality,
                        backgroundColor: this.canvas.backgroundColor || '#FFFFFF', // Fallback to white for JPEG if transparent
                        enableRetinaScaling: true, // Improve quality on high-DPI screens
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

    /** Adds a new text object to the canvas. */
    addText() {
        const center = this.canvas.getCenter();
        const text = new fabric.IText('Double click to edit', {
            left: center.left, top: center.top, fontFamily: this.options.fontFamily, fontSize: 32, fill: '#000000', // Default text color to black for contrast
            originX: 'center', originY: 'center', type: 'text', id: 'text-' + Date.now()
        });
        this.canvas.add(text); this.canvas.setActiveObject(text); this.canvas.renderAll();
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
                    const center = this.canvas.getCenter();
                    // Use random color from updated shapeColors
                    const fillColor = this.shapeColors[Math.floor(Math.random() * this.shapeColors.length)];

                    switch(elementType) {
                        case 'icon': this.addIconElement(elementName, fillColor); break; // Pass element name which maps to icon in this.elements
                        case 'circle': this._addBasicShape('circle', center, fillColor); break;
                        case 'rect': this._addBasicShape('rect', center, fillColor); break;
                        case 'roundedRect': this._addBasicShape('roundedRect', center, fillColor); break;
                        case 'triangle': this._addBasicShape('triangle', center, fillColor); break;
                        case 'line': this._addBasicShape('line', center, fillColor); break;
                        case 'arrow': this. _addBasicShape('arrow', center, fillColor); break;
                        case 'heart': this._addBasicShape('heart', center, fillColor); break;
                        case 'diamond': this._addBasicShape('diamond', center, fillColor); break;
                        case 'polygon': this._addBasicShape('polygon', center, fillColor, elementSides); break;
                        case 'star': this._addBasicShape('star', center, fillColor); break; // Star is a path now
                        case 'cloud': this._addPathShape('cloud', center, fillColor); break;
                        case 'sun': this._addPathShape('sun', center, fillColor); break;
                        case 'moon': this._addPathShape('moon', center, fillColor); break;
                        default: console.log('Add custom element:', elementType);
                    }
                    this.canvas.renderAll();
                    panel.classList.remove('open');
                    this._showMessage(`${elementName} added`, 'success');
                };
            });
        }
    }

    /** Helper for basic shapes (rect, circle, triangle, etc.) and simple paths (star). */
    _addBasicShape(type, center, fillColor, sides = 0) {
        let shape;
        const options = {
            left: center.left, top: center.top,
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
                shape = new fabric.Circle({ ...options, radius: 50 });
                break;
            case 'triangle':
                shape = new fabric.Triangle({ ...options, width: 100, height: 90 });
                break;
            case 'line':
                shape = new fabric.Line([center.left - 75, center.top, center.left + 75, center.top], {
                    stroke: fillColor, strokeWidth: 5, originX: 'center', originY: 'center', type: 'line', id: 'line-' + Date.now()
                });
                break;
            case 'arrow':
                // Simple SVG path for an arrow
                shape = new fabric.Path('M 0 40 L 60 40 L 60 20 L 100 60 L 60 100 L 60 80 L 0 80 Z', {
                    ...options, width: 100, height: 80, scaleX: 1, scaleY: 1
                });
                break;
            case 'heart':
                // Simple SVG path for a heart
                shape = new fabric.Path('M 50 30 A 20 20 0 0 1 90 30 Q 90 60 50 90 Q 10 60 10 30 A 20 20 0 0 1 50 30 Z', {
                    ...options, width: 100, height: 90, scaleX: 1, scaleY: 1
                });
                break;
            case 'diamond':
                // Simple SVG path for a diamond
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
                // A simple 5-point star path (you can make this more complex if desired)
                shape = new fabric.Path('M 50 0 L 61.8 35.3 L 97.6 35.3 L 68.2 57.7 L 79.1 92.7 L 50 70.3 L 20.9 92.7 L 31.8 57.7 L 2.4 35.3 L 38.2 35.3 Z', {
                    ...options, width: 100, height: 92.7
                });
                break;
            default:
                console.warn(`Unknown basic shape type: ${type}`);
                return;
        }
        this.canvas.add(shape);
        this.canvas.setActiveObject(shape);
    }

    /** Adds an icon element (Font Awesome) as a text object. */
    addIconElement(iconNameFromElement, color) {
        // Find the actual icon class from the this.elements array based on the name
        const elementDefinition = this.elements.find(el => el.name === iconNameFromElement && el.type === 'icon');
        if (!elementDefinition) {
            console.error(`Icon definition not found for name: ${iconNameFromElement}`);
            this._showMessage(`Could not add icon: ${iconNameFromElement}`, 'error');
            return;
        }

        // A small mapping from the Font Awesome class suffix to its Unicode.
        // In a real app, you'd use a more robust Font Awesome JS library to get unicode.
        const iconUnicodeMap = {
            'star': '\uf005', 'bell': '\uf0f3', 'home': '\uf015', 'building': '\uf1ad',
            'car': '\uf1b9', 'plane': '\uf072', 'bicycle': '\uf206', 'tree': '\uf1bb',
            'leaf': '\uf06c', 'camera': '\uf030', 'video': '\uf03d', 'music': '\uf001',
            'book': '\uf02d', 'lightbulb': '\uf0eb', 'search': '\uf002', 'thumbs-up': '\uf164',
            'check': '\uf00c', 'times': '\uf00d', 'plus': '\uf067', 'minus': '\uf068',
            'folder': '\uf07b', 'file-alt': '\uf15c', 'cog': '\uf013', 'puzzle-piece': '\uf12e',
            'bolt': '\uf0e7', 'tint': '\uf043', 'crown': '\uf521', 'shield-alt': '\uf3ed',
            'flag': '\uf024', 'map-pin': '\uf041', 'wifi': '\uf1eb', 'battery-full': '\uf240',
            // Note: cloud, sun, moon are now _addPathShape, but kept here for completeness if needed as font icons
            'cloud': '\uf0c2', 'sun': '\uf185', 'moon': '\uf186'
        };
        const iconClassSuffix = elementDefinition.icon.split(' ').pop().replace('fa-', ''); // e.g., 'star' from 'fas fa-star'
        const unicodeChar = iconUnicodeMap[iconClassSuffix] || '\uf005'; // Default to a star if not found

        const center = this.canvas.getCenter();
        const iconText = new fabric.IText(unicodeChar, {
            left: center.left, top: center.top,
            fontFamily: 'Font Awesome 6 Free', // Use the correct Font Awesome font family
            fontWeight: '900', // Solid icons typically need fontWeight 900
            fontSize: 80,
            fill: color,
            originX: 'center', originY: 'center',
            type: 'icon', // Custom type to distinguish from regular text
            id: `icon-${iconClassSuffix}-${Date.now()}`
        });
        this.canvas.add(iconText);
        this.canvas.setActiveObject(iconText);
        this.canvas.renderAll();
    }

    // Helper for complex SVG path-based shapes (cloud, sun, moon etc.)
    _addPathShape(type, center, fillColor) {
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
                return;
        }

        const path = new fabric.Path(pathData, {
            left: center.left, top: center.top,
            fill: fillColor,
            scaleX: 1, scaleY: 1,
            originX: 'center', originY: 'center',
            type: type, // Custom type
            id: `${type}-${Date.now()}`
        });

        // Scale path to a reasonable default size if it's too large/small initially
        const bounds = path.getBoundingRect();
        const scale = Math.min(defaultWidth / bounds.width, defaultHeight / bounds.height);
        path.scale(scale);
        this.canvas.add(path);
        this.canvas.setActiveObject(path);
    }


    /** Adds an image. */
    addImage(dataUrl) {
        fabric.Image.fromURL(dataUrl, (img) => {
            const center = this.canvas.getCenter(); img.set({ left: center.left, top: center.top, originX: 'center', originY: 'center', type: 'image', id: 'image-' + Date.now() });
            const maxWidth = this.canvas.width * 0.4; const maxHeight = this.canvas.height * 0.4; let scale = 1;
            if (img.width > maxWidth || img.height > maxHeight) { scale = Math.min(maxWidth / img.width, maxHeight / img.height); }
            img.scale(scale); this.canvas.add(img); this.canvas.setActiveObject(img); img.bringToFront(); this.canvas.renderAll();
            this._showMessage('Image added', 'success');
        }, { crossOrigin: 'anonymous' });
    }

    /** Adds an emoji sticker. */
    addSticker(emoji) {
        const center = this.canvas.getCenter();
        const text = new fabric.Text(emoji, {
            left: center.left, top: center.top, fontSize: 64, fontFamily: 'Segoe UI Emoji, Arial', // Use Segoe UI Emoji for better cross-platform support
            type: 'sticker', originX: 'center', originY: 'center', id: 'sticker-' + Date.now()
        });
        this.canvas.add(text); this.canvas.setActiveObject(text); text.bringToFront(); this.canvas.renderAll();
        this._showMessage(`Sticker ${emoji} added`, 'success');
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
            panel.innerHTML = '<p style="text-align:center; color:#b3b3c6; padding-top:20px;">Select an element to edit its properties</p>';
            return;
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

        if (activeObject.type === 'text' || activeObject.type === 'i-text' || activeObject.type === 'sticker' || activeObject.type === 'icon') {
            html += `<div class="property-group"><h4>Text/Icon</h4><div class="property-row"><span class="property-label">Content</span><input type="text" class="property-input" data-property="text" value="${activeObject.text ?? ''}"></div>
                <div class="property-row"><span class="property-label">Font Size</span><input type="number" class="property-input" data-property="fontSize" value="${activeObject.fontSize ?? 24}"></div>`;
            // Only show font family for actual text objects, not just generic icons/stickers which might be font-awesome or emoji
            if (activeObject.type === 'text' || activeObject.type === 'i-text') {
                html += `<div class="property-row"><span class="property-label">Font Family</span>${this.getFontDropdown('fontFamily', activeObject.fontFamily ?? 'Poppins')}</div>`;
            }
            html += `<div class="property-row"><span class="property-label">Color</span><input type="color" class="property-input" data-property="fill" value="${this.rgbToHex(activeObject.fill || '#000000')}"></div>
                <div class="property-row"><span class="property-label">Align</span><select class="property-input" data-property="textAlign">
                    <option value="left" ${activeObject.textAlign === 'left' ? 'selected' : ''}>Left</option><option value="center" ${activeObject.textAlign === 'center' ? 'selected' : ''}>Center</option><option value="right" ${activeObject.textAlign === 'right' ? 'selected' : ''}>Right</option>
                </select></div><div class="property-row"><span class="property-label">Padding</span><input type="number" min="0" class="property-input" data-property="padding" value="${activeObject.padding ?? 0}"></div>
            </div>`;
        }
        if (['rect', 'circle', 'triangle', 'polygon', 'path', 'line', 'star', 'arrow', 'heart', 'diamond', 'cloud', 'sun', 'moon', 'roundedRect'].includes(activeObject.type)) {
            html += `<div class="property-group"><h4>Style</h4><div class="property-row"><span class="property-label">Fill</span><input type="color" class="property-input" data-property="fill" value="${this.rgbToHex(activeObject.fill || this.options.primaryColor)}"></div>
                <div class="property-row"><span class="property-label">Stroke</span><input type="color" class="property-input" data-property="stroke" value="${this.rgbToHex(activeObject.stroke || this._darkenHex(this.options.primaryColor, 10))}"></div>
                <div class="property-row"><span class="property-label">Stroke Width</span><input type="number" class="property-input" data-property="strokeWidth" value="${activeObject.strokeWidth ?? 0}"></div></div>`;
        }
        if (activeObject.type === 'image') {
            html += `<div class="property-group"><h4>Image</h4><div class="property-row"><span class="property-label">Scale X</span><input type="number" step="0.01" class="property-input" data-property="scaleX" value="${(activeObject.scaleX ?? 1).toFixed(2)}"></div>
                <div class="property-row"><span class="property-label">Scale Y</span><input type="number" step="0.01" class="property-input" data-property="scaleY" value="${(activeObject.scaleY ?? 1).toFixed(2)}"></div></div>`;
        }

        html += `<div style='text-align:right;margin-top:12px;'><button class="property-delete-btn"><i class="fas fa-trash"></i> Delete</button></div>`;
        panel.innerHTML = html;

        panel.querySelectorAll('.property-input').forEach(input => {
            input.addEventListener('change', this.handlePropertyChange.bind(this));
            input.addEventListener('input', this.handlePropertyChange.bind(this));
        });
        const delBtn = panel.querySelector('.property-delete-btn');
        if (delBtn) { delBtn.addEventListener('click', () => { this.deleteActiveObject(); }); }
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
                    // This iconMap needs to be accessible here or passed in some way.
                    // For simplicity, let's just use a generic "Icon" name for now, or ensure iconMap is global/class property.
                    const foundElement = this.elements.find(el => el.type === 'icon' && obj.fontFamily === 'Font Awesome 6 Free' && (obj.text === (this._getIconUnicode(el.name) || obj.text))); // Match by unicode if possible
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
                    this._showMessage(obj.visible ? `${obj.type} is now visible` : `${obj.type} is now hidden`, 'success');
                }
            });

            item.querySelector('.delete-layer').addEventListener('click', (e) => {
                e.stopPropagation();
                const obj = this.canvas.getObjects().find(o => o.id === objectId);
                if (obj) {
                    this.canvas.remove(obj);
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
        if (panel) { panel.innerHTML = '<p style="text-align:center; color:#b3b3c6; padding-top:20px;">Select an element to edit its properties</p>'; }
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

        if (property === 'width') {
            if (activeObject.type === 'circle') { activeObject.set('radius', parseFloat(value) / 2); }
            else { activeObject.set('scaleX', parseFloat(value) / (activeObject.width / activeObject.scaleX)); }
        }
        else if (property === 'height') {
             if (activeObject.type === 'circle') { activeObject.set('radius', parseFloat(value) / 2); }
            else { activeObject.set('scaleY', parseFloat(value) / (activeObject.height / activeObject.scaleY)); }
        }
        else if (property === 'padding') { activeObject.set('padding', parseFloat(value)); }
        else if (property === 'left' || property === 'top' || property === 'angle' || property === 'opacity' || property === 'fontSize' || property === 'strokeWidth') { activeObject.set(property, parseFloat(value)); }
        else if (property === 'scaleX' || property === 'scaleY') { activeObject.set(property, parseFloat(value)); }
        else if (property === 'fill' || property === 'stroke' || property === 'fontFamily' || property === 'text' || property === 'textAlign') { activeObject.set(property, value); }
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
        // No need to update properties panel on every input event, only on change or selection.
        // this.updatePropertiesPanel();
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
            const initialIndex = this.canvas.getObjects().indexOf(activeObject);
            activeObject.bringForward(); // Moves one step forward in stack
            const newIndex = this.canvas.getObjects().indexOf(activeObject);
            console.log(`Object moved forward from index ${initialIndex} to ${newIndex}.`);
            this.canvas.renderAll();
            this.updateLayersPanel(); // Update layer order in panel
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
            const initialIndex = this.canvas.getObjects().indexOf(activeObject);
            activeObject.sendBackwards(); // Moves one step backward in stack
            const newIndex = this.canvas.getObjects().indexOf(activeObject);
            console.log(`Object moved backward from index ${initialIndex} to ${newIndex}.`);
            this.canvas.renderAll();
            this.updateLayersPanel(); // Update layer order in panel
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
} // End of BubbleDesigner class

// This is required so that Bubble can use the class from your file.
window.BubbleDesigner = BubbleDesigner;
