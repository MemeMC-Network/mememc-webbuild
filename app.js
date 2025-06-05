// Google Sites-like Web Builder

// --- Sidebar Tabs Content ---
const components = [
  {
    type: 'header',
    label: 'Header',
    html: `<h2 contenteditable="true" class="text-2xl font-bold">Header</h2>`
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    html: `<p contenteditable="true" class="text-gray-600">Paragraph text</p>`
  },
  {
    type: 'button',
    label: 'Button',
    html: `<button contenteditable="true" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Button</button>`
  },
  {
    type: 'image',
    label: 'Image',
    html: `<img src="https://via.placeholder.com/320x100" alt="Image" class="rounded w-full h-auto" />`
  },
  {
    type: 'divider',
    label: 'Divider',
    html: `<hr class="my-2 border-gray-300">`
  },
  {
    type: 'embed',
    label: 'Embed',
    html: `<div contenteditable="true" class="bg-gray-100 rounded p-2 text-xs text-gray-500">Paste embed (YouTube, Map, HTML...)</div>`
  }
];

let pages = [
  { name: 'Home', content: '' }
];
let currentPage = 0;

// --- Undo/Redo Stack ---
let undoStack = [], redoStack = [];
function saveState() {
  undoStack.push(document.getElementById('dropzone').innerHTML);
  if (undoStack.length > 50) undoStack.shift();
  redoStack = [];
}
function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    document.getElementById('dropzone').innerHTML = undoStack[undoStack.length - 1];
    rebindAll();
  }
}
function redo() {
  if (redoStack.length) {
    const state = redoStack.pop();
    undoStack.push(state);
    document.getElementById('dropzone').innerHTML = state;
    rebindAll();
  }
}

// --- Toolbar Actions ---
function showToolbar(component) {
  // Remove any existing toolbar
  const old = component.querySelector('.component-toolbar');
  if (old) old.remove();
  const toolbar = document.createElement('div');
  toolbar.className = 'component-toolbar';
  toolbar.innerHTML = `
    <button class="icon-btn" title="Edit"><i class="lucide-edit"></i></button>
    <button class="icon-btn" title="Duplicate"><i class="lucide-copy"></i></button>
    <button class="icon-btn" title="Delete"><i class="lucide-trash"></i></button>
  `;
  toolbar.querySelector('[title="Edit"]').onclick = () => makeEditable(component);
  toolbar.querySelector('[title="Duplicate"]').onclick = () => {
    const clone = component.cloneNode(true);
    component.parentNode.insertBefore(clone, component.nextSibling);
    saveState();
    rebindAll();
  };
  toolbar.querySelector('[title="Delete"]').onclick = () => {
    component.remove();
    saveState();
    rebindAll();
  };
  component.appendChild(toolbar);
}

// --- Inline Editing ---
function makeEditable(component) {
  component.classList.add('editable');
  const el = component.querySelector('[contenteditable]');
  if (el) el.focus();
  el.onblur = () => {
    component.classList.remove('editable');
    saveState();
  };
}

// --- Drag and Drop (with interact.js) ---
function makeDraggable(component) {
  interact(component)
    .draggable({
      inertia: true,
      autoScroll: true,
      onmove: dragMoveListener,
      onend: function (event) {
        component.style.transform = '';
        component.setAttribute('data-x', 0);
        component.setAttribute('data-y', 0);
      }
    });
}
function dragMoveListener(event) {
  const target = event.target;
  let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  target.style.transform = `translate(${x}px, ${y}px)`;
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// --- Section/Column Layouts ---
function addSection(cols = 2) {
  const section = document.createElement('div');
  section.className = 'section';
  for (let i = 0; i < cols; i++) {
    const column = document.createElement('div');
    column.className = 'column';
    column.setAttribute('data-droppable', 'true');
    column.ondragover = e => e.preventDefault();
    column.ondrop = e => {
      const type = e.dataTransfer.getData('component-type');
      if (!type) return;
      const template = components.find(c => c.type === type);
      if (!template) return;
      const compDiv = document.createElement('div');
      compDiv.className = 'component';
      compDiv.innerHTML = template.html;
      compDiv.setAttribute('data-type', type);
      makeDraggable(compDiv);
      bindComponentEvents(compDiv);
      column.appendChild(compDiv);
      saveState();
    };
    section.appendChild(column);
  }
  document.getElementById('dropzone').appendChild(section);
  saveState();
}

function rebindAll() {
  // For all components in all columns, re-apply events and drag
  document.querySelectorAll('.component').forEach(bindComponentEvents);
}

// --- Component Binding ---
function bindComponentEvents(component) {
  component.onclick = e => {
    document.querySelectorAll('.component').forEach(c => c.classList.remove('selected'));
    component.classList.add('selected');
    showToolbar(component);
    e.stopPropagation();
  };
  makeDraggable(component);
}

// --- Sidebar Tabs ---
function renderInsertTab() {
  const container = document.createElement('div');
  components.forEach(comp => {
    const block = document.createElement('div');
    block.className = 'component mb-2 cursor-pointer';
    block.innerHTML = `<span class="font-medium">${comp.label}</span>`;
    block.draggable = true;
    block.ondragstart = e => e.dataTransfer.setData('component-type', comp.type);
    block.onclick = () => {
      // Add to first column of last section or create new section if none
      let lastSection = document.querySelector('.section:last-child');
      let column = lastSection ? lastSection.querySelector('.column') : null;
      if (!column) {
        addSection();
        lastSection = document.querySelector('.section:last-child');
        column = lastSection.querySelector('.column');
      }
      const compDiv = document.createElement('div');
      compDiv.className = 'component';
      compDiv.innerHTML = comp.html;
      compDiv.setAttribute('data-type', comp.type);
      makeDraggable(compDiv);
      bindComponentEvents(compDiv);
      column.appendChild(compDiv);
      saveState();
    };
    container.appendChild(block);
  });
  document.getElementById('sidebar-content').innerHTML = '';
  document.getElementById('sidebar-content').appendChild(container);
}
function renderPagesTab() {
  const container = document.createElement('div');
  const list = document.createElement('ul');
  pages.forEach((p, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="primary-btn mb-2 w-full${currentPage === idx ? ' bg-blue-500' : ''}">${p.name}</button>
    `;
    li.onclick = () => switchPage(idx);
    list.appendChild(li);
  });
  container.appendChild(list);
  const addBtn = document.createElement('button');
  addBtn.className = 'primary-btn mt-4 w-full';
  addBtn.innerText = 'Add Page';
  addBtn.onclick = () => {
    const name = prompt('Page name?','New Page');
    if (name) {
      pages.push({ name, content: '' });
      renderPagesTab();
    }
  };
  container.appendChild(addBtn);
  document.getElementById('sidebar-content').innerHTML = '';
  document.getElementById('sidebar-content').appendChild(container);
}
function renderThemesTab() {
  const container = document.createElement('div');
  container.innerHTML = `
    <div>
      <label class="block mb-2 font-medium">Theme Color:</label>
      <select id="theme-color" class="w-full border rounded p-2">
        <option value="default">Default (Blue)</option>
        <option value="emerald">Emerald</option>
        <option value="rose">Rose</option>
        <option value="slate">Slate</option>
      </select>
    </div>
  `;
  document.getElementById('sidebar-content').innerHTML = '';
  document.getElementById('sidebar-content').appendChild(container);
  document.getElementById('theme-color').onchange = e => {
    document.body.className = `bg-${e.target.value === 'default' ? 'slate-50' : e.target.value + '-50'}`;
  };
}

// --- Sidebar Tab Switch ---
document.querySelectorAll('.sidebar-tab').forEach(tab => {
  tab.onclick = function () {
    document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    if (this.dataset.tab === 'insert') renderInsertTab();
    if (this.dataset.tab === 'pages') renderPagesTab();
    if (this.dataset.tab === 'themes') renderThemesTab();
  };
});

// --- Section Add ---
document.getElementById('add-section').onclick = () => addSection();

// --- Undo/Redo ---
document.getElementById('undo-btn').onclick = () => undo();
document.getElementById('redo-btn').onclick = () => redo();

// --- Preview Mode ---
let previewMode = false;
document.getElementById('preview-btn').onclick = () => {
  previewMode = !previewMode;
  document.getElementById('dropzone').classList.toggle('pointer-events-none', previewMode);
  document.getElementById('preview-btn').innerText = previewMode ? 'Edit' : 'Preview';
};

// --- Publish Modal ---
const publishModal = document.getElementById('publish-modal');
document.getElementById('publish-btn').onclick = () => publishModal.classList.add('active');
document.getElementById('publish-cancel').onclick = () => publishModal.classList.remove('active');
document.getElementById('publish-confirm').onclick = () => {
  const name = document.getElementById('website-name').value.trim() || "website.html";
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.getElementById('site-name').innerText || 'My Site'}</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  </head>
  <body>
    ${document.getElementById('dropzone').innerHTML}
  </body>
  </html>
  `;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  publishModal.classList.remove('active');
};

// --- Page Switching ---
function switchPage(idx) {
  pages[currentPage].content = document.getElementById('dropzone').innerHTML;
  currentPage = idx;
  document.getElementById('dropzone').innerHTML = pages[currentPage].content || '';
  rebindAll(); saveState();
  renderPagesTab();
}

// --- Global Click to Deselect ---
document.body.onclick = e => {
  document.querySelectorAll('.component').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.component-toolbar').forEach(tb => tb.remove());
};

// --- Initial Render ---
window.onload = () => {
  renderInsertTab();
  addSection();
  saveState();
  rebindAll();
};
