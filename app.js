document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('dropzone')
  const togglePreviewButton = document.getElementById('toggle-preview')
  const saveLayoutButton = document.getElementById('save-layout')
  const loadLayoutButton = document.getElementById('load-layout')
  const previewHeader = document.getElementById('preview-header')
  let isPreview = false

  // Initialize interact.js for drag-and-drop
  interact('.draggable')
    .draggable({
      onmove: dragMoveListener,
    })
    .on('dragend', (event) => {
      const component = event.target.cloneNode(true)
      component.classList.remove('draggable')
      component.classList.add('component')
      dropzone.appendChild(component)
      makeComponentDraggable(component)
    })

  function dragMoveListener(event) {
    const target = event.target
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    target.style.transform = `translate(${x}px, ${y}px)`
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }

  function makeComponentDraggable(component) {
    interact(component)
      .draggable({
        onmove: dragMoveListener,
      })
  }

  togglePreviewButton.addEventListener('click', () => {
    isPreview = !isPreview
    togglePreviewButton.textContent = isPreview ? 'Edit' : 'Preview'
    dropzone.classList.toggle('preview-mode')
    previewHeader.style.display = isPreview ? 'block' : 'none'
  })

  saveLayoutButton.addEventListener('click', () => {
    const components = Array.from(dropzone.children).map((component) => ({
      type: component.getAttribute('data-type'),
      content: component.getAttribute('data-content'),
      style: component.getAttribute('style'),
    }))
    localStorage.setItem('websiteLayout', JSON.stringify(components))
  })

  loadLayoutButton.addEventListener('click', () => {
    const layout = localStorage.getItem('websiteLayout')
    if (layout) {
      const components = JSON.parse(layout)
      dropzone.innerHTML = ''
      components.forEach((component) => {
        const newComponent = document.createElement('div')
        newComponent.className = 'component'
        newComponent.setAttribute('data-type', component.type)
        newComponent.setAttribute('data-content', component.content)
        newComponent.style = component.style
        switch (component.type) {
          case 'header':
            newComponent.innerHTML = `<h2 class="text-2xl font-bold">${component.content}</h2>`
            break
          case 'paragraph':
            newComponent.innerHTML = `<p class="text-gray-600">${component.content}</p>`
            break
          case 'button':
            newComponent.innerHTML = `<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">${component.content}</button>`
            break
          case 'avatar':
            newComponent.innerHTML = `
              <div class="flex items-center space-x-2">
                <div class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16"></div>
                <span>Avatar</span>
              </div>
            `
            break
          case 'input':
            newComponent.innerHTML = `
              <div class="flex flex-col space-y-1.5">
                <label for="input-1" class="text-sm font-medium text-gray-700">Label</label>
                <input id="input-1" type="text" class="border border-gray-300 rounded px-3 py-2" placeholder="Input" />
              </div>
            `
            break
          case 'textarea':
            newComponent.innerHTML = `
              <div class="flex flex-col space-y-1.5">
                <label for="textarea-1" class="text-sm font-medium text-gray-700">Label</label>
                <textarea id="textarea-1" class="border border-gray-300 rounded px-3 py-2" placeholder="Textarea"></textarea>
              </div>
            `
            break
          case 'radio-group':
            newComponent.innerHTML = `
              <div class="flex items-center space-x-2">
                <input id="option-one-1" type="radio" name="radio-group-1" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <label for="option-one-1" class="ml-2 block text-sm font-medium text-gray-700">Option One</label>
              </div>
              <div class="flex items-center space-x-2">
                <input id="option-two-1" type="radio" name="radio-group-1" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                <label for="option-two-1" class="ml-2 block text-sm font-medium text-gray-700">Option Two</label>
              </div>
            `
            break
          case 'select':
            newComponent.innerHTML = `
              <select class="border border-gray-300 rounded px-3 py-2">
                <option value="option-one">Option One</option>
                <option value="option-two">Option Two</option>
              </select>
            `
            break
        }
        dropzone.appendChild(newComponent)
        makeComponentDraggable(newComponent)
      })
    }
  })
})
