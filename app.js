document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('dropzone')
  const togglePreviewButton = document.getElementById('toggle-preview')
  const saveLayoutButton = document.getElementById('save-layout')
  const loadLayoutButton = document.getElementById('load-layout')
  const publishButton = document.getElementById('publish-button')
  const publishModal = document.getElementById('publish-modal')
  const publishConfirmButton = document.getElementById('publish-confirm')
  const publishCancelButton = document.getElementById('publish-cancel')
  const websiteNameInput = document.getElementById('website-name')
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

  publishButton.addEventListener('click', () => {
    publishModal.style.display = 'flex'
  })

  publishCancelButton.addEventListener('click', () => {
    publishModal.style.display = 'none'
  })

  publishConfirmButton.addEventListener('click', () => {
    const websiteName = websiteNameInput.value.trim()
    if (websiteName) {
      const components = Array.from(dropzone.children).map((component) => ({
        type: component.getAttribute('data-type'),
        content: component.getAttribute('data-content'),
        style: component.getAttribute('style'),
      }))

      let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${websiteName}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <link href="https://cdn.jsdelivr.net/npm/@lucideicons/lucide@0.252.0/css/lucide.min.css" rel="stylesheet">
        </head>
        <body class="bg-white">
          <div class="min-h-screen flex flex-col">
            <header class="bg-white shadow-lg">
              <div class="container mx-auto px-4 py-6 flex justify-between items-center">
                <h1 class="text-2xl font-bold">${websiteName}</h1>
              </div>
            </header>
            <main class="flex-grow container mx-auto px-4 py-8">
              <div class="p-4 space-y-2">
      `

      components.forEach((component) => {
        switch (component.type) {
          case 'header':
            htmlContent += `<h2 class="text-2xl font-bold">${component.content}</h2>`
            break
          case 'paragraph':
            htmlContent += `<p class="text-gray-600">${component.content}</p>`
            break
          case 'button':
            htmlContent += `<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">${component.content}</button>`
            break
          case 'avatar':
            htmlContent += `
              <div class="flex items-center space-x-2">
                <div class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16"></div>
                <span>Avatar</span>
              </div>
            `
            break
          case 'input':
            htmlContent += `
              <div class="flex flex-col space-y-1.5">
                <label for="input-1" class="text-sm font-medium text-gray-700">Label</label>
                <input id="input-1" type="text" class="border border-gray-300 rounded px-3 py-2" placeholder="Input" />
              </div>
            `
            break
          case 'textarea':
            htmlContent += `
              <div class="flex flex-col space-y-1.5">
                <label for="textarea-1" class="text-sm font-medium text-gray-700">Label</label>
                <textarea id="textarea-1" class="border border-gray-300 rounded px-3 py-2" placeholder="Textarea"></textarea>
              </div>
            `
            break
          case 'radio-group':
            htmlContent += `
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
            htmlContent += `
              <select class="border border-gray-300 rounded px-3 py-2">
                <option value="option-one">Option One</option>
                <option value="option-two">Option Two</option>
              </select>
            `
            break
        }
      })

      htmlContent += `
              </div>
            </main>
            <footer class="bg-gray-100 mt-8">
              <div class="container mx-auto px-4 py-6 text-center">
                <p>&copy; 2023 ${websiteName}. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </body>
        </html>
      `

      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = websiteName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      publishModal.style.display = 'none'
    }
  })

  // Styling Options
  dropzone.addEventListener('click', (event) => {
    const component = event.target.closest('.component')
    if (component) {
      const stylingOptions = `
        <div class="styling-options">
          <label for="bg-color">Background Color:</label>
          <input type="text" id="bg-color" placeholder="e.g., #ffffff" />
          <label for="text-color">Text Color:</label>
          <input type="text" id="text-color" placeholder="e.g., #000000" />
          <label for="font-size">Font Size:</label>
          <input type="text" id="font-size" placeholder="e.g., 16px" />
          <label for="font-family">Font Family:</label>
          <select id="font-family">
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
          <button id="apply-styles">Apply Styles</button>
        </div>
      `

      const existingOptions = component.querySelector('.styling-options')
      if (existingOptions) {
        existingOptions.remove()
      } else {
        component.insertAdjacentHTML('beforeend', stylingOptions)
      }

      const applyStylesButton = component.querySelector('#apply-styles')
      applyStylesButton.addEventListener('click', () => {
        const bgColor = component.querySelector('#bg-color').value
        const textColor = component.querySelector('#text-color').value
        const fontSize = component.querySelector('#font-size').value
        const fontFamily = component.querySelector('#font-family').value

        if (bgColor) component.style.backgroundColor = bgColor
        if (textColor) component.style.color = textColor
        if (fontSize) component.style.fontSize = fontSize
        if (fontFamily) component.style.fontFamily = fontFamily

        component.querySelector('.styling-options').remove()
      })
    }
  })
})
