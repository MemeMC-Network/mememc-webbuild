// DOM Elements
const app = {
  canvas: document.getElementById('canvas'),
  componentsTab: document.getElementById('components-tab'),
  themesTab: document.getElementById('themes-tab'),
  componentsContent: document.getElementById('components-content'),
  themesContent: document.getElementById('themes-content'),
  contentTab: document.getElementById('content-tab'),
  styleTab: document.getElementById('style-tab'),
  contentProperties: document.getElementById('content-properties'),
  styleProperties: document.getElementById('style-properties'),
  noSelection: document.getElementById('no-selection'),
  componentProperties: document.getElementById('component-properties'),
  noSelectionStyle: document.getElementById('no-selection-style'),
  componentStyles: document.getElementById('component-styles'),
  textContent: document.getElementById('text-content'),
  imageContent: document.getElementById('image-content'),
  videoContent: document.getElementById('video-content'),
  textStyles: document.getElementById('text-styles'),
  buttonStyles: document.getElementById('button-styles'),
  sectionStyles: document.getElementById('section-styles'),
  textContentInput: document.getElementById('text-content-input'),
  videoUrl: document.getElementById('video-url'),
  fontSize: document.getElementById('font-size'),
  uploadImage: document.getElementById('upload-image'),
  duplicateBtn: document.getElementById('duplicate-btn'),
  deleteBtn: document.getElementById('delete-btn'),
  templatesBtn: document.getElementById('templates-btn'),
  templatesPanel: document.getElementById('templates-panel'),
  templatesGrid: document.getElementById('templates-grid'),
  siteTitle: document.getElementById('site-title'),
  previewBtn: document.getElementById('preview-btn'),
  undoBtn: document.getElementById('undo-btn'),
  redoBtn: document.getElementById('redo-btn'),
  saveBtn: document.getElementById('save-btn'),
  publishBtn: document.getElementById('publish-btn'),
  toggleLeftPanel: document.getElementById('toggle-left-panel'),
  toggleRightPanel: document.getElementById('toggle-left-panel'),
  leftPanel: document.getElementById('left-panel'),
  rightPanel: document.getElementById('right-panel'),
  colorPalette: document.getElementById('color-palette'),
  canvasBackground: document.getElementById('canvas-background'),
  templatesChevron: document.getElementById('templates-chevron')
};

// State
const state = {
  components: [],
  selectedComponent: null,
  activeTool: 'select',
  canvasSize: { width: 1024, height: 'auto' },
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
  history: [],
  historyIndex: -1,
  themeColor: '#3b82f6',
  siteTitle: 'My Website',
  showTemplates: false,
  previewMode: false,
  showLeftPanel: true,
  showRightPanel: true
};

// Color Palette
const COLOR_PALETTE = [
  '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a',
  '#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db',
  '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d',
  '#10b981', '#059669', '#047857', '#065f46', '#064e3b'
];

// Templates
const TEMPLATES = [
  {
    name: 'Business',
    thumbnail: 'business',
    components: [
      {
        id: 'header-1',
        type: 'header',
        content: 'Professional Business',
        position: { x: 50, y: 30 },
        size: { width: 900, height: 50 },
        styles: { 
          color: '#1f2937',
          backgroundColor: 'transparent',
          fontSize: '24px',
          fontWeight: '500',
          textAlign: 'center'
        }
      },
      {
        id: 'section-1',
        type: 'section',
        content: '',
        position: { x: 50, y: 100 },
        size: { width: 900, height: 400 },
        styles: { 
          backgroundColor: '#f9fafb',
          padding: '24px',
          borderRadius: '8px'
        },
        children: [
          {
            id: 'grid-1',
            type: 'grid',
            content: '',
            position: { x: 0, y: 0 },
            size: { width: 900, height: 400 },
            styles: { 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            },
            children: [
              {
                id: 'text-1',
                type: 'text',
                content: 'Our Services',
                position: { x: 0, y: 0 },
                size: { width: '100%', height: 'auto' },
                styles: { 
                  color: '#1f2937',
                  backgroundColor: 'transparent',
                  fontSize: '18px',
                  fontWeight: '500'
                }
              },
              {
                id: 'text-2',
                type: 'text',
                content: 'We provide exceptional services tailored to your business needs.',
                position: { x: 0, y: 0 },
                size: { width: '100%', height: 'auto' },
                styles: { 
                  color: '#1f2937',
                  backgroundColor: 'transparent',
                  fontSize: '16px'
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Portfolio',
    thumbnail: 'portfolio',
    components: [
      {
        id: 'header-1',
        type: 'header',
        content: 'My Creative Portfolio',
        position: { x: 50, y: 30 },
        size: { width: 900, height: 50 },
        styles: { 
          color: '#1f2937',
          backgroundColor: 'transparent',
          fontSize: '24px',
          fontWeight: '500',
          textAlign: 'center'
        }
      },
      {
        id: 'grid-1',
        type: 'grid',
        content: '',
        position: { x: 50, y: 100 },
        size: { width: 900, height: 600 },
        styles: { 
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        },
        children: Array(6).fill(0).map((_, i) => ({
          id: `image-${i+1}`,
          type: 'image',
          content: `Project ${i+1}`,
          position: { x: 0, y: 0 },
          size: { width: '100%', height: 200 },
          styles: { 
            borderWidth: '1px',
            borderColor: '#e5e7eb',
            borderRadius: '4px'
          }
        }))
      }
    ]
  }
];

// Initialize the app
function init() {
  // Render color palette
  renderColorPalette();
  
  // Render templates
  renderTemplates();
  
  // Add event listeners
  setupEventListeners();
  
  // Initialize with some default components
  const defaultComponents = [
    {
      id: 'navigation-1',
      type: 'navigation',
      content: 'Home, About, Services, Contact',
      position: { x: 0, y: 0 },
      size: { width: '100%', height: 60 },
      styles: { 
        backgroundColor: '#ffffff',
        padding: '12px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'header-1',
      type: 'header',
      content: 'Welcome to My Website',
      position: { x: 50, y: 80 },
      size: { width: 900, height: 50 },
      styles: { 
        color: '#1f2937',
        backgroundColor: 'transparent',
        fontSize: '36px',
        fontWeight: '500',
        textAlign: 'center'
      }
    },
    {
      id: 'section-1',
      type: 'section',
      content: '',
      position: { x: 50, y: 160 },
      size: { width: 900, height: 400 },
      styles: { 
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '8px'
      },
      children: [
        {
          id: 'grid-1',
          type: 'grid',
          content: '',
          position: { x: 0, y: 0 },
          size: { width: 900, height: 400 },
          styles: { 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          },
          children: [
            {
              id: 'text-1',
              type: 'text',
              content: 'Left Column Content',
              position: { x: 0, y: 0 },
              size: { width: '100%', height: 'auto' },
              styles: { 
                color: '#1f2937',
                backgroundColor: 'transparent',
                fontSize: '16px'
              }
            },
            {
              id: 'image-1',
              type: 'image',
              content: 'Right Column Image',
              position: { x: 0, y: 0 },
              size: { width: '100%', height: 300 },
              styles: { 
                borderWidth: '1px',
                borderColor: '#e5e7eb',
                borderRadius: '4px'
              }
            }
          ]
        }
      ]
    }
  ];
  
  state.components = defaultComponents;
  saveHistory(defaultComponents);
  renderComponents();
}

// Render color palette
function renderColorPalette() {
  app.colorPalette.innerHTML = COLOR_PALETTE.map(color => `
    <button 
      class="w-8 h-8 rounded-full border-2 ${state.themeColor === color ? 'border-blue-500 ring-2 ring-offset-2 ring-blue-500' : 'border-transparent'}"
      style="background-color: ${color}"
      data-color="${color}"
    ></button>
  `).join('');
}

// Render templates
function renderTemplates() {
  app.templatesGrid.innerHTML = TEMPLATES.map(template => `
    <div class="cursor-pointer hover:border-blue-500 border rounded overflow-hidden">
      <div class="bg-gray-100 h-40 flex items-center justify-center">
        <i class="mdi mdi-view-grid-outline text-4xl text-gray-400"></i>
      </div>
      <div class="p-3 font-medium">${template.name}</div>
    </div>
  `).join('');
}

// Render components on canvas
function renderComponents() {
  app.canvas.innerHTML = '';
  
  state.components.forEach(component => {
    const element = createComponentElement(component);
    app.canvas.appendChild(element);
    
    if (component.children) {
      component.children.forEach(child => {
        const childElement = createComponentElement(child, component.id);
        element.appendChild(childElement);
      });
    }
  });
}

// Create a component DOM element
function createComponentElement(component, parentId = null) {
  const element = document.createElement('div');
  element.className = `component ${component.id === state.selectedComponent ? 'selected' : ''}`;
  element.dataset.id = component.id;
  
  // Set position and size
  Object.assign(element.style, {
    position: parentId ? 'relative' : 'absolute',
    left: parentId ? '0' : `${component.position.x}px`,
    top: parentId ? '0' : `${component.position.y}px`,
    width: typeof component.size.width === 'string' ? component.size.width : `${component.size.width}px`,
    height: typeof component.size.height === 'string' ? component.size.height : `${component.size.height}px`,
    ...component.styles
  });
  
  // Set content based on component type
  switch (component.type) {
    case 'text':
    case 'header':
      element.textContent = component.content;
      break;
      
    case 'image':
      element.innerHTML = `
        <div class="image-placeholder w-full h-full flex items-center justify-center">
          <i class="mdi mdi-image-outline text-4xl text-gray-400"></i>
        </div>
      `;
      break;
      
    case 'button':
      element.innerHTML = `
        <div class="w-full h-full flex items-center justify-center">
          ${component.content}
        </div>
      `;
      break;
      
    case 'divider':
      element.style.borderBottom = '1px solid #d1d5db';
      break;
      
    case 'section':
      element.innerHTML = `
        <div class="w-full h-full relative">
          ${component.children ? '' : `
            <button class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200">
              <i class="mdi mdi-plus"></i>
            </button>
          `}
        </div>
      `;
      break;
      
    case 'grid':
      // Grid content is handled by its children
      break;
      
    case 'video':
      element.innerHTML = `
        <div class="video-placeholder w-full h-full flex items-center justify-center">
          <div class="text-center">
            <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <i class="mdi mdi-play text-white text-2xl"></i>
            </div>
            <p>Video Embed</p>
          </div>
        </div>
      `;
      break;
      
    case 'spacer':
      // Spacer is just an empty div
      break;
      
    case 'navigation':
      element.innerHTML = `
        <div class="navigation-bar w-full h-full">
          <div class="font-medium">${state.siteTitle}</div>
          <div class="flex space-x-6">
            ${component.content.split(',').map(item => `
              <div class="hover:text-blue-500 transition-colors">${item.trim()}</div>
            `).join('')}
          </div>
        </div>
      `;
      break;
  }
  
  return element;
}

// Save current state to history
function saveHistory(components) {
  state.history = [...state.history.slice(0, state.historyIndex + 1), JSON.parse(JSON.stringify(components))];
  state.historyIndex = state.history.length - 1;
  updateUndoRedoButtons();
}

// Update undo/redo buttons state
function updateUndoRedoButtons() {
  app.undoBtn.disabled = state.historyIndex <= 0;
  app.redoBtn.disabled = state.historyIndex >= state.history.length - 1;
}

// Setup event listeners
function setupEventListeners() {
  // Component buttons
  document.querySelectorAll('[data-type]').forEach(button => {
    button.addEventListener('click', () => {
      const type = button.dataset.type;
      addComponent(type);
    });
  });
  
  // Canvas interactions
  app.canvas.addEventListener('mousedown', handleCanvasMouseDown);
  app.canvas.addEventListener('mousemove', handleCanvasMouseMove);
  app.canvas.addEventListener('mouseup', handleCanvasMouseUp);
  
  // Tabs
  app.componentsTab.addEventListener('click', () => {
    app.componentsContent.classList.remove('hidden');
    app.themesContent.classList.add('hidden');
    app.componentsTab.classList.add('border-blue-500');
    app.themesTab.classList.remove('border-blue-500');
  });
  
  app.themesTab.addEventListener('click', () => {
    app.componentsContent.classList.add('hidden');
    app.themesContent.classList.remove('hidden');
    app.componentsTab.classList.remove('border-blue-500');
    app.themesTab.classList.add('border-blue-500');
  });
  
  app.contentTab.addEventListener('click', () => {
    app.contentProperties.classList.remove('hidden');
    app.styleProperties.classList.add('hidden');
    app.contentTab.classList.add('border-blue-500');
    app.styleTab.classList.remove('border-blue-500');
  });
  
  app.styleTab.addEventListener('click', () => {
    app.contentProperties.classList.add('hidden');
    app.styleProperties.classList.remove('hidden');
    app.contentTab.classList.remove('border-blue-500');
    app.styleTab.classList.add('border-blue-500');
  });
  
  // Color palette
  app.colorPalette.addEventListener('click', (e) => {
    if (e.target.dataset.color) {
      state.themeColor = e.target.dataset.color;
      renderColorPalette();
    }
  });
  
  // Templates
  app.templatesBtn.addEventListener('click', () => {
    state.showTemplates = !state.showTemplates;
    app.templatesPanel.classList.toggle('hidden');
    app.templatesChevron.className = state.showTemplates ? 
      'mdi mdi-chevron-up ml-1' : 'mdi mdi-chevron-down ml-1';
  });
  
  // Other buttons
  app.undoBtn.addEventListener('click', undo);
  app.redoBtn.addEventListener('click', redo);
  app.saveBtn.addEventListener('click', saveWebsite);
  app.publishBtn.addEventListener('click', exportWebsite);
  app.previewBtn.addEventListener('click', togglePreview);
  app.siteTitle.addEventListener('change', updateSiteTitle);
  app.duplicateBtn.addEventListener('click', duplicateSelectedComponent);
  app.deleteBtn.addEventListener('click', deleteSelectedComponent);
  app.uploadImage.addEventListener('click', uploadImage);
  app.textContentInput.addEventListener('change', updateTextContent);
  app.videoUrl.addEventListener('change', updateVideoUrl);
  app.fontSize.addEventListener('change', updateFontSize);
  app.canvasBackground.addEventListener('change', updateCanvasBackground);
}

// Handle canvas mouse down
function handleCanvasMouseDown(e) {
  if (state.previewMode) return;
  
  const component = e.target.closest('.component');
  if (!component) return;
  
  if (state.activeTool === 'select') {
    state.selectedComponent = component.dataset.id;
    state.isDragging = true;
    
    const rect = component.getBoundingClientRect();
    state.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    renderComponents();
    showComponentProperties(state.selectedComponent);
  }
}

// Handle canvas mouse move
function handleCanvasMouseMove(e) {
  if (!state.isDragging || !state.selectedComponent || state.previewMode) return;
  
  const component = state.components.find(c => c.id === state.selectedComponent);
  if (!component) return;
  
  const canvasRect = app.canvas.getBoundingClientRect();
  component.position = {
    x: e.clientX - canvasRect.left - state.dragOffset.x,
    y: e.clientY - canvasRect.top - state.dragOffset.y
  };
  
  renderComponents();
}

// Handle canvas mouse up
function handleCanvasMouseUp() {
  if (state.isDragging) {
    state.isDragging = false;
    saveHistory(state.components);
  }
}

// Add a new component
function addComponent(type, parentId = null) {
  const newComponent = {
    id: `comp-${Date.now()}`,
    type,
    content: getDefaultContent(type),
    position: { x: 50, y: 50 },
    size: getDefaultSize(type),
    styles: { ...getDefaultStyles(type) }
  };
  
  if (parentId) {
    const parent = findComponent(parentId);
    if (parent) {
      parent.children = [...(parent.children || []), newComponent];
    }
  } else {
    state.components = [...state.components, newComponent];
  }
  
  state.selectedComponent = newComponent.id;
  saveHistory(state.components);
  renderComponents();
  showComponentProperties(newComponent.id);
}

// Find a component by ID
function findComponent(id) {
  for (const component of state.components) {
    if (component.id === id) return component;
    if (component.children) {
      const found = component.children.find(c => c.id === id);
      if (found) return found;
    }
  }
  return null;
}

// Get default content for a component type
function getDefaultContent(type) {
  switch (type) {
    case 'text': return 'Double click to edit text';
    case 'button': return 'Button';
    case 'header': return 'Header Text';
    case 'navigation': return 'Home, About, Contact';
    case 'video': return 'Video Embed';
    default: return '';
  }
}

// Get default size for a component type
function getDefaultSize(type) {
  switch (type) {
    case 'image': return { width: 200, height: 150 };
    case 'button': return { width: 150, height: 50 };
    case 'divider': return { width: '100%', height: 2 };
    case 'header': return { width: 300, height: 50 };
    case 'section': return { width: '90%', height: 300 };
    case 'grid': return { width: '100%', height: 300 };
    case 'video': return { width: 400, height: 225 };
    case 'spacer': return { width: '100%', height: 40 };
    case 'navigation': return { width: '100%', height: 60 };
    default: return { width: 300, height: 'auto' };
  }
}

// Get default styles for a component type
function getDefaultStyles(type) {
  return DEFAULT_STYLES[type] || {};
}

// Show component properties in the right panel
function showComponentProperties(id) {
  const component = findComponent(id);
  if (!component) return;
  
  // Show properties panel
  app.noSelection.classList.add('hidden');
  app.componentProperties.classList.remove('hidden');
  app.noSelectionStyle.classList.add('hidden');
  app.componentStyles.classList.remove('hidden');
  
  // Hide all content and style sections
  app.textContent.classList.add('hidden');
  app.imageContent.classList.add('hidden');
  app.videoContent.classList.add('hidden');
  app.textStyles.classList.add('hidden');
  app.buttonStyles.classList.add('hidden');
  app.sectionStyles.classList.add('hidden');
  
  // Show relevant content section
  switch (component.type) {
    case 'text':
    case 'header':
    case 'button':
    case 'navigation':
      app.textContent.classList.remove('hidden');
      app.textContentInput.value = component.content;
      break;
      
    case 'image':
      app.imageContent.classList.remove('hidden');
      break;
      
    case 'video':
      app.videoContent.classList.remove('hidden');
      app.videoUrl.value = component.metadata?.videoUrl || '';
      break;
  }
  
  // Show relevant style section
  switch (component.type) {
    case 'text':
    case 'header':
      app.textStyles.classList.remove('hidden');
      app.fontSize.value = component.styles.fontSize || '16px';
      break;
      
    case 'button':
      app.buttonStyles.classList.remove('hidden');
      break;
      
    case 'section':
      app.sectionStyles.classList.remove('hidden');
      break;
  }
}

// Update text content
function updateTextContent() {
  const component = findComponent(state.selectedComponent);
  if (!component) return;
  
  component.content = app.textContentInput.value;
  saveHistory(state.components);
  renderComponents();
}

// Update video URL
function updateVideoUrl() {
  const component = findComponent(state.selectedComponent);
  if (!component) return;
  
  component.metadata = component.metadata || {};
  component.metadata.videoUrl = app.videoUrl.value;
  saveHistory(state.components);
  renderComponents();
}

// Update font size
function updateFontSize() {
  const component = findComponent(state.selectedComponent);
  if (!component) return;
  
  component.styles.fontSize = app.fontSize.value;
  saveHistory(state.components);
  renderComponents();
}

// Update canvas background
function updateCanvasBackground() {
  state.canvasSize.height = app.canvasBackground.value === 'auto' ? 'auto' : 600;
  renderComponents();
}

// Upload image (placeholder)
function uploadImage() {
  alert('In a real implementation, this would open a file dialog to upload an image');
}

// Duplicate selected component
function duplicateSelectedComponent() {
  if (!state.selectedComponent) return;
  
  const component = findComponent(state.selectedComponent);
  if (!component) return;
  
  const newComponent = {
    ...component,
    id: `comp-${Date.now()}`,
    position: { ...component.position, y: component.position.y + 20 }
  };
  
  state.components = [...state.components, newComponent];
  state.selectedComponent = newComponent.id;
  saveHistory(state.components);
  renderComponents();
  showComponentProperties(newComponent.id);
}

// Delete selected component
function deleteSelectedComponent() {
  if (!state.selectedComponent) return;
  
  state.components = state.components.filter(c => c.id !== state.selectedComponent);
  state.selectedComponent = null;
  saveHistory(state.components);
  renderComponents();
  
  // Hide properties panel
  app.noSelection.classList.remove('hidden');
  app.componentProperties.classList.add('hidden');
  app.noSelectionStyle.classList.remove('hidden');
  app.componentStyles.classList.add('hidden');
}

// Undo action
function undo() {
  if (state.historyIndex <= 0) return;
  
  state.historyIndex--;
  state.components = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
  renderComponents();
  updateUndoRedoButtons();
}

// Redo action
function redo() {
  if (state.historyIndex >= state.history.length - 1) return;
  
  state.historyIndex++;
  state.components = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
  renderComponents();
  updateUndoRedoButtons();
}

// Toggle preview mode
function togglePreview() {
  state.previewMode = !state.previewMode;
  
  if (state.previewMode) {
    app.previewBtn.innerHTML = '<i class="mdi mdi-eye-off-outline mr-2"></i>Exit Preview';
    app.previewBtn.classList.add('bg-blue-500', 'text-white');
    app.previewBtn.classList.remove('hover:bg-gray-100');
    
    // Hide all component borders
    document.querySelectorAll('.component').forEach(el => {
      el.classList.remove('selected');
    });
  } else {
    app.previewBtn.innerHTML = '<i class="mdi mdi-eye-outline mr-2"></i>Preview';
    app.previewBtn.classList.remove('bg-blue-500', 'text-white');
    app.previewBtn.classList.add('hover:bg-gray-100');
  }
}

// Update site title
function updateSiteTitle() {
  state.siteTitle = app.siteTitle.value;
  
  // Update navigation component if it exists
  const navComponent = state.components.find(c => c.type === 'navigation');
  if (navComponent) {
    renderComponents();
  }
}

// Save website
function saveWebsite() {
  const websiteData = {
    siteTitle: state.siteTitle,
    components: state.components,
    canvasSize: state.canvasSize,
    themeColor: state.themeColor,
    createdAt: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(websiteData, null, 2);
  alert('Website saved! Here is the JSON:\n\n' + dataStr);
}

// Export website
function exportWebsite() {
  const websiteData = {
    siteTitle: state.siteTitle,
    components: state.components,
    canvasSize: state.canvasSize,
    themeColor: state.themeColor,
    createdAt: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(websiteData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'website-export.json';
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

// Apply template
function applyTemplate(templateIndex) {
  const template = TEMPLATES[templateIndex];
  if (!template) return;
  
  state.components = JSON.parse(JSON.stringify(template.components));
  state.selectedComponent = null;
  saveHistory(state.components);
  renderComponents();
  
  // Hide properties panel
  app.noSelection.classList.remove('hidden');
  app.componentProperties.classList.add('hidden');
  app.noSelectionStyle.classList.remove('hidden');
  app.componentStyles.classList.add('hidden');
  
  // Hide templates panel
  state.showTemplates = false;
  app.templatesPanel.classList.add('hidden');
  app.templatesChevron.className = 'mdi mdi-chevron-down ml-1';
}

// Toggle left panel
function toggleLeftPanel() {
  state.showLeftPanel = !state.showLeftPanel;
  app.leftPanel.classList.toggle('hidden');
}

// Toggle right panel
function toggleRightPanel() {
  state.showRightPanel = !state.showRightPanel;
  app.rightPanel.classList.toggle('hidden');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add template click handlers after rendering
function setupTemplateClickHandlers() {
  document.querySelectorAll('#templates-grid > div').forEach((template, index) => {
    template.addEventListener('click', () => applyTemplate(index));
  });
}

// Add text alignment click handlers
function setupTextAlignmentHandlers() {
  document.querySelectorAll('[data-align]').forEach(button => {
    button.addEventListener('click', () => {
      const component = findComponent(state.selectedComponent);
      if (!component) return;
      
      component.styles.textAlign = button.dataset.align;
      saveHistory(state.components);
      renderComponents();
    });
  });
}

// Update the init function to include new setup functions
function init() {
  // Render color palette
  renderColorPalette();
  
  // Render templates
  renderTemplates();
  
  // Add event listeners
  setupEventListeners();
  
  // Setup template click handlers
  setupTemplateClickHandlers();
  
  // Setup text alignment handlers
  setupTextAlignmentHandlers();
  
  // Initialize with some default components
  const defaultComponents = [
    {
      id: 'navigation-1',
      type: 'navigation',
      content: 'Home, About, Services, Contact',
      position: { x: 0, y: 0 },
      size: { width: '100%', height: 60 },
      styles: { 
        backgroundColor: '#ffffff',
        padding: '12px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }
    },
    {
      id: 'header-1',
      type: 'header',
      content: 'Welcome to My Website',
      position: { x: 50, y: 80 },
      size: { width: 900, height: 50 },
      styles: { 
        color: '#1f2937',
        backgroundColor: 'transparent',
        fontSize: '36px',
        fontWeight: '500',
        textAlign: 'center'
      }
    },
    {
      id: 'section-1',
      type: 'section',
      content: '',
      position: { x: 50, y: 160 },
      size: { width: 900, height: 400 },
      styles: { 
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '8px'
      },
      children: [
        {
          id: 'grid-1',
          type: 'grid',
          content: '',
          position: { x: 0, y: 0 },
          size: { width: 900, height: 400 },
          styles: { 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          },
          children: [
            {
              id: 'text-1',
              type: 'text',
              content: 'Left Column Content',
              position: { x: 0, y: 0 },
              size: { width: '100%', height: 'auto' },
              styles: { 
                color: '#1f2937',
                backgroundColor: 'transparent',
                fontSize: '16px'
              }
            },
            {
              id: 'image-1',
              type: 'image',
              content: 'Right Column Image',
              position: { x: 0, y: 0 },
              size: { width: '100%', height: 300 },
              styles: { 
                borderWidth: '1px',
                borderColor: '#e5e7eb',
                borderRadius: '4px'
              }
            }
          ]
        }
      ]
    }
  ];
  
  state.components = defaultComponents;
  saveHistory(defaultComponents);
  renderComponents();
}
