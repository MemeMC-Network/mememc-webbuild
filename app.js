const components = [
  { type: "heading", label: "Heading", html: '<h2 contenteditable="true" class="text-2xl font-bold">Heading</h2>' },
  { type: "text", label: "Text", html: '<p contenteditable="true">Start typing...</p>' },
  { type: "button", label: "Button", html: '<button contenteditable="true" class="bg-blue-600 text-white px-4 py-2 rounded">Click Me</button>' },
  { type: "image", label: "Image", html: '<img src="https://placehold.co/480x120/png" class="rounded" style="max-width:100%"/>' },
  { type: "divider", label: "Divider", html: '<hr class="my-6 border-gray-300">' },
  { type: "embed", label: "Embed", html: '<div contenteditable="true" class="bg-gray-100 p-2 rounded text-xs text-gray-500">Paste embed here…</div>' },
];

function renderInsertPanel() {
  const panel = document.createElement("div");
  panel.className = "insert-panel";
  components.forEach(comp => {
    const btn = document.createElement("button");
    btn.className = "primary-btn w-full mb-2 flex items-center gap-2";
    btn.innerHTML = `<span>${comp.label}</span>`;
    btn.onclick = () => addComponentToSelected(comp);
    panel.appendChild(btn);
  });
  document.getElementById("sidebar-panel").innerHTML = "";
  document.getElementById("sidebar-panel").appendChild(panel);
}

function renderCanvas() {
  // Render sections, columns, blocks, toolbars, quick-adds, etc
}

function addComponentToSelected(comp) {
  // Find selected column or section, insert as child, update state, rerender
}

function renderLayersPanel() {
  // Tree view of all sections/columns/components for easy navigation/selection
}

function renderPagesPanel() {
  // Page management logic
}

function renderThemePanel() {
  // Show theme/style options (colors, fonts, etc.)
}

function renderAssetsPanel() {
  // Show uploaded images, allow upload
}

// Device preview (responsive)
document.querySelectorAll(".device-tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".device-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("canvas-frame").className = "canvas-frame " + btn.dataset.device;
  }
});

// Sidebar tab switch
document.querySelectorAll(".sidebar-tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".sidebar-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const tabName = tab.dataset.tab;
    if (tabName === "insert") renderInsertPanel();
    if (tabName === "layers") renderLayersPanel();
    if (tabName === "pages") renderPagesPanel();
    if (tabName === "theme") renderThemePanel();
    if (tabName === "assets") renderAssetsPanel();
  }
});

// Initial render
window.onload = () => {
  renderInsertPanel();
  // renderCanvas, etc.
};
