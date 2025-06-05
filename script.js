// Enhanced State Object
const state = {
  components: [],
  selectedComponents: [], // Now supports multiple selection
  activeTool: 'select',
  canvasSize: { width: 1024, height: 'auto' },
  isDragging: false,
  isResizing: false,
  dragOffset: { x: 0, y: 0 },
  resizeData: { handle: null, originalSize: null, originalPos: null },
  history: [],
  historyIndex: -1,
  themeColor: '#3b82f6',
  siteTitle: 'My Website',
  showTemplates: false,
  showAssets: false,
  showSeo: false,
  showLayers: false,
  previewMode: false,
  showLeftPanel: true,
  showRightPanel: true,
  snapToGrid: false,
  currentDevice: 'desktop',
  assets: [], // For uploaded assets
  seoData: { // SEO management
    title: '',
    description: '',
    keywords: '',
    favicon: null
  }
};

// New Component Types
const COMPONENT_TYPES = {
  // ... previous types ...
  form: {
    name: 'Form',
    icon: 'mdi-form-textbox',
    defaultContent: '',
    defaultSize: { width: 400, height: 'auto' },
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '16px',
      borderRadius: '8px'
    },
    render: (component) => {
      return `
        <div class="form-container">
          <input type="text" class="form-input" placeholder="Name">
          <input type="email" class="form-input" placeholder="Email">
          <textarea class="form-input" placeholder="Message"></textarea>
          <button class="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </div>
      `;
    }
  },
  carousel: {
    name: 'Carousel',
    icon: 'mdi-view-carousel',
    defaultContent: '',
    defaultSize: { width: '100%', height: 300 },
    defaultStyles: {
      backgroundColor: '#f3f4f6',
      overflow: 'hidden'
    },
    render: (component) => {
      return `
        <div class="carousel-container relative">
          <div class="carousel-slide">Slide 1</div>
          <div class="carousel-slide hidden">Slide 2</div>
          <div class="carousel-slide hidden">Slide 3</div>
          <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            <button class="w-3 h-3 rounded-full bg-gray-400"></button>
            <button class="w-3 h-3 rounded-full bg-gray-300"></button>
            <button class="w-3 h-3 rounded-full bg-gray-300"></button>
          </div>
        </div>
      `;
    }
  }
};

// Initialize with new features
function init() {
  // ... previous init code ...
  
  // Add new event listeners
  setupResizeHandlers();
  setupKeyboardShortcuts();
  setupDevicePreview();
  
  // Initialize new components
  document.querySelectorAll('[data-type]').forEach(btn => {
    btn.addEventListener('click', () => addComponent(btn.dataset.type));
  });
  
  // Initialize grid
  renderCanvasGrid();
}

// New: Component Resizing
function setupResizeHandlers() {
  document.addEventListener('mousedown', (e) => {
    const handle = e.target.closest('.resize-handle');
    if (!handle || !state.selectedComponent) return;
    
    const component = findComponent(state.selectedComponent);
    if (!component) return;
    
    state.isResizing = true;
    state.resizeData = {
      handle: handle.classList[1].split('-')[2], // n, e, s, w, etc.
      originalSize: { ...component.size },
      originalPos: { ...component.position },
      startX: e.clientX,
      startY: e.clientY
    };
    
    e.preventDefault();
    e.stopPropagation();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!state.isResizing || !state.selectedComponent) return;
    
    const component = findComponent(state.selectedComponent);
    if (!component) return;
    
    const { handle, originalSize, originalPos, startX, startY } = state.resizeData;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    // Handle resizing based on which handle was grabbed
    switch (handle) {
      case 'n':
        component.size.height = Math.max(20, originalSize.height - deltaY);
        component.position.y = originalPos.y + deltaY;
        break;
      case 'e':
        component.size.width = Math.max(20, originalSize.width + deltaX);
        break;
      case 's':
        component.size.height = Math.max(20, originalSize.height + deltaY);
        break;
      case 'w':
        component.size.width = Math.max(20, originalSize.width - deltaX);
        component.position.x = originalPos.x + deltaX;
        break;
      case 'ne':
        component.size.height = Math.max(20, originalSize.height - deltaY);
        component.size.width = Math.max(20, originalSize.width + deltaX);
        component.position.y = originalPos.y + deltaY;
        break;
      case 'nw':
        component.size.height = Math.max(20, originalSize.height - deltaY);
        component.size.width = Math.max(20, originalSize.width - deltaX);
        component.position.x = originalPos.x + deltaX;
        component.position.y = originalPos.y + deltaY;
        break;
      case 'se':
        component.size.height = Math.max(20, originalSize.height + deltaY);
        component.size.width = Math.max(20, originalSize.width + deltaX);
        break;
      case 'sw':
        component.size.height = Math.max(20, originalSize.height + deltaY);
        component.size.width = Math.max(20, originalSize.width - deltaX);
        component.position.x = originalPos.x + deltaX;
        break;
    }
    
    renderComponents();
  });
  
  document.addEventListener('mouseup', () => {
    if (state.isResizing) {
      state.isResizing = false;
      saveHistory(state.components);
    }
  });
}

// New: Keyboard Shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Don't trigger if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Ctrl+Z - Undo
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      undo();
    }
    
    // Ctrl+Y - Redo
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      redo();
    }
    
    // Ctrl+L - Layers panel
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      toggleLayersPanel();
    }
    
    // Delete key - Delete component
    if (e.key === 'Delete' && state.selectedComponent) {
      e.preventDefault();
      deleteSelectedComponent();
    }
    
    // Arrow keys - Move component
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && state.selectedComponent) {
      e.preventDefault();
      const component = findComponent(state.selectedComponent);
      if (!component) return;
      
      const step = e.shiftKey ? 10 : 1;
      
      switch (e.key) {
        case 'ArrowUp': component.position.y -= step; break;
        case 'ArrowDown': component.position.y += step; break;
        case 'ArrowLeft': component.position.x -= step; break;
        case 'ArrowRight': component.position.x += step; break;
      }
      
      renderComponents();
      saveHistory(state.components);
    }
  });
}

// New: Device Preview
function setupDevicePreview() {
  document.querySelectorAll('[data-device]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentDevice = btn.dataset.device;
      updateCanvasForDevice();
    });
  });
}

function updateCanvasForDevice() {
  app.canvas.classList.remove('canvas-mobile', 'canvas-tablet', 'canvas-desktop');
  
  switch (state.currentDevice) {
    case 'mobile':
      app.canvas.classList.add('canvas-mobile');
      break;
    case 'tablet':
      app.canvas.classList.add('canvas-tablet');
      break;
    case 'desktop':
      app.canvas.classList.add('canvas-desktop');
      break;
  }
}

// New: Layer Management
function toggleLayersPanel() {
  state.showLayers = !state.showLayers;
  
  if (state.showLayers) {
    renderLayersPanel();
    app.utilityPanels.innerHTML = `
      <div class="p-4">
        <h2 class="text-lg font-medium mb-4">Layers</h2>
        <div id="layers-list" class="space-y-1"></div>
      </div>
    `;
    renderLayersList();
  } else {
    app.utilityPanels.innerHTML = '';
  }
  
  app.utilityPanels.classList.toggle('hidden');
}

function renderLayersList() {
  const layersList = document.getElementById('layers-list');
  if (!layersList) return;
  
  layersList.innerHTML = state.components.map(component => `
    <div class="layer-item ${state.selectedComponent === component.id ? 'selected' : ''}" data-id="${component.id}">
      <div class="flex items-center">
        <i class="mdi ${COMPONENT_TYPES[component.type].icon} mr-2"></i>
        <span>${COMPONENT_TYPES[component.type].name}</span>
      </div>
    </div>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.layer-item').forEach(item => {
    item.addEventListener('click', () => {
      state.selectedComponent = item.dataset.id;
      renderComponents();
      renderLayersList();
      showComponentProperties(state.selectedComponent);
    });
  });
}

// New: Snap to Grid
function toggleSnapToGrid() {
  state.snapToGrid = !state.snapToGrid;
  document.getElementById('canvas-grid').style.display = state.snapToGrid ? 'grid' : 'none';
}

function renderCanvasGrid() {
  const grid = document.getElementById('canvas-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  grid.style.width = `${state.canvasSize.width}px`;
  grid.style.height = state.canvasSize.height === 'auto' ? 'auto' : `${state.canvasSize.height}px`;
}

// New: Asset Management
function handleAssetUpload(e) {
  const files = e.target.files;
  if (!files.length) return;
  
  Array.from(files).forEach(file => {
    if (!file.type.match('image.*')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      state.assets.push({
        id: `asset-${Date.now()}`,
        name: file.name,
        url: e.target.result,
        type: 'image'
      });
      
      if (state.showAssets) {
        renderAssetsPanel();
      }
    };
    reader.readAsDataURL(file);
  });
}

function renderAssetsPanel() {
  app.utilityPanels.innerHTML = `
    <div class="p-4">
      <h2 class="text-lg font-medium mb-4">Assets</h2>
      <div class="mb-4">
        <label class="block bg-blue-50 text-blue-700 rounded p-2 text-center cursor-pointer hover:bg-blue-100">
          <input type="file" id="asset-upload" class="hidden" multiple accept="image/*">
          <i class="mdi mdi-upload mr-2"></i> Upload Images
        </label>
      </div>
      <div id="assets-grid" class="grid grid-cols-3 gap-2"></div>
    </div>
  `;
  
  document.getElementById('asset-upload').addEventListener('change', handleAssetUpload);
  
  const assetsGrid = document.getElementById('assets-grid');
  assetsGrid.innerHTML = state.assets.map(asset => `
    <div class="relative group">
      <img src="${asset.url}" class="w-full h-20 object-cover rounded border">
      <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
        <button class="p-1 bg-white rounded-full" data-id="${asset.id}" title="Insert">
          <i class="mdi mdi-plus"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  // Add insert handlers
  document.querySelectorAll('#assets-grid button').forEach(btn => {
    btn.addEventListener('click', () => {
      const asset = state.assets.find(a => a.id === btn.dataset.id);
      if (!asset) return;
      
      addComponent('image', null, asset.url);
      state.showAssets = false;
      app.utilityPanels.classList.add('hidden');
    });
  });
}

// New: SEO Tools
function renderSeoPanel() {
  app.utilityPanels.innerHTML = `
    <div class="p-4">
      <h2 class="text-lg font-medium mb-4">SEO Settings</h2>
      
      <div class="mb-6">
        <h3 class="text-sm font-medium mb-2">Search Preview</h3>
        <div class="seo-preview">
          <div class="seo-preview-title">${state.seoData.title || 'Page Title'}</div>
          <div class="seo-preview-url">example.com</div>
          <div class="seo-preview-description">${state.seoData.description || 'Page description'}</div>
        </div>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Page Title</label>
          <input type="text" id="seo-title" class="w-full border rounded p-2" value="${state.seoData.title}">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Meta Description</label>
          <textarea id="seo-description" class="w-full border rounded p-2" rows="3">${state.seoData.description || ''}</textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Keywords</label>
          <input type="text" id="seo-keywords" class="w-full border rounded p-2" value="${state.seoData.keywords || ''}">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Favicon</label>
          <input type="file" id="seo-favicon" class="w-full border rounded p-2" accept="image/x-icon,.ico">
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.getElementById('seo-title').addEventListener('change', (e) => {
    state.seoData.title = e.target.value;
    document.querySelector('.seo-preview-title').textContent = e.target.value || 'Page Title';
  });
  
  document.getElementById('seo-description').addEventListener('change', (e) => {
    state.seoData.description = e.target.value;
    document.querySelector('.seo-preview-description').textContent = e.target.value || 'Page description';
  });
  
  document.getElementById('seo-keywords').addEventListener('change', (e) => {
    state.seoData.keywords = e.target.value;
  });
  
  document.getElementById('seo-favicon').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      state.seoData.favicon = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
