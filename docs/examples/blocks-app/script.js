const BLOCKS_KEY = 'blocks-app'
const BLOCKS_IPNS_KEY = `ipns://localhost?key=${BLOCKS_KEY}`
const BLOCKS_JSON_FILE = 'blocks.json'
const FILES_TO_COPY = [
  'index.html',
  'style.css',
  'script.js'
]

function navigate (link) {
  window.location.href = link
}

function makeInputElement (value) {
  const input = document.createElement('input')
  input.setAttribute('class', 'add-block-input')
  input.setAttribute('type', 'text')
  input.setAttribute('placeholder', 'Enter URL')
  input.setAttribute('value', value)
  return input
}

class Block {
  constructor (link) {
    this.data = link

    this.func = navigate.bind(this, link)
    this.drawEdit = this.drawEdit.bind(this)
    this.saveEdit = this.saveEdit.bind(this)
    this.deleteBlock = this.deleteBlock.bind(this)
  }

  draw () {
    const blockElement = document.createElement('div')
    blockElement.setAttribute('class', 'block')
    blockElement.append(document.createTextNode(this.data))

    // on click
    blockElement.addEventListener('click', this.func)

    // edit button overlay
    const overlay = document.createElement('div')
    overlay.setAttribute('class', 'overlay')

    const editButton = document.createElement('a')
    editButton.setAttribute('href', '#')
    editButton.setAttribute('class', 'edit-button')
    editButton.append(document.createTextNode('✏️'))

    editButton.addEventListener('click', this.drawEdit)

    const deleteButton = document.createElement('a')
    deleteButton.setAttribute('href', '#')
    deleteButton.setAttribute('class', 'delete-button')
    deleteButton.append(document.createTextNode('❌'))

    deleteButton.addEventListener('click', this.deleteBlock)

    overlay.append(editButton)
    overlay.append(deleteButton)

    blockElement.append(overlay)
    return blockElement
  }

  drawEdit (event) {
    event.stopPropagation()

    const blockElement = event.target.parentElement.parentElement

    const input = makeInputElement(this.data)

    blockElement.replaceChild(input, blockElement.firstChild)

    const confirmButton = document.createElement('a')
    confirmButton.setAttribute('href', '#')
    confirmButton.setAttribute('class', 'confirm-edit-button')
    confirmButton.append(document.createTextNode('Save ✔️'))

    // find overlay in block element
    const overlay = blockElement.getElementsByClassName('overlay')[0]
    overlay.replaceChild(confirmButton, overlay.firstChild)

    blockElement.removeEventListener('click', this.func)

    confirmButton.addEventListener('click', this.saveEdit)
  }

  saveEdit (event) {
    event.stopPropagation()
    // get input
    const blockElement = event.target.parentElement.parentElement
    const input = blockElement.getElementsByTagName('input')[0]
    this.data = input.value
    this.func = navigate.bind(this, this.data)
    while (blockElement.firstChild) {
      blockElement.removeChild(blockElement.firstChild)
    }
    saveBlocks()
    drawBlocks()
  };

  deleteBlock (event) {
    event.stopPropagation()
    blocksToDraw.splice(blocksToDraw.indexOf(this), 1)
    saveBlocks()
    drawBlocks()
  }
}

class AddBlock extends Block {
  constructor () {
    super()
    this.data = 'Add Block +'
    this.func = function () {
      const input = document.getElementsByClassName('add-block-input')[0]
      const link = input.value
      if (!link) {
        return
      }
      makeAndSaveNewBlock(link)
      drawBlocks()

      input.value = ''
    }
  }

  draw () {
    /* this one is a little different */
    const blockElement = document.createElement('div')
    blockElement.setAttribute('class', 'block add-block')

    // prepend text input field
    const input = makeInputElement('')

    blockElement.append(input)
    blockElement.append(document.createElement('br'))

    const addButton = document.createElement('a')
    addButton.setAttribute('class', 'add-block-button')
    addButton.append(document.createTextNode(this.data))
    addButton.addEventListener('click', this.func)

    blockElement.append(addButton)

    return blockElement
  }
}

function makeAndSaveNewBlock (link, position = -1) {
  // make the block object out of a link
  blocksToDraw.push(new Block(link))
  saveBlocks()
}

function makeNewBlock (link) {
  blocksToDraw.push(new Block(link))
}

function drawBlocks () {
  const shelf = document.getElementById('shelf')
  while (shelf.firstChild) {
    shelf.removeChild(shelf.firstChild)
  }
  shelf.append(new AddBlock().draw())
  for (const block of blocksToDraw) {
    // draw the block
    shelf.append(block.draw())
  }
}

async function getOwnIPNS () {
  try {
    const response = await fetch(BLOCKS_IPNS_KEY)
    if (!response.ok) throw new Error(await response.text())
    return response.url
  } catch {
    // Couldn't get the URL!
    console.log('Creating site')
    await initOwnSite()
    return getOwnIPNS()
  }
}

async function initOwnSite () {
  const response = await fetch(BLOCKS_IPNS_KEY, { method: 'post' })
  const siteURL = response.headers.get('Location')
  const form = new FormData()
  for (const file of FILES_TO_COPY) {
    const sourceURL = new URL(`./${file}`, window.location.href).href
    const fileResponse = await fetch(sourceURL)
    form.append('file', await fileResponse.blob(), file)
  }

  console.log('Uploading initial site contents')
  const uploadResponse = await fetch(siteURL, {
    method: 'put',
    body: form
  })

  if (!uploadResponse.ok) {
    throw new Error(`Cannot create site: ${response.status}\n${await uploadResponse.text()}`)
  }
}

async function saveBlocks () {
  copyButton = document.getElementsByClassName('copy-button')[0]
  console.log(copyButton)
  copyButton.textContent = 'Saving... ⏳'
  

  const data = []
  for (const block of blocksToDraw) {
    data.push(block.data)
  }
  const siteURL = await getOwnIPNS()
  console.log('About to save blocks list to', siteURL)
  const blockFileURL = new URL(BLOCKS_JSON_FILE, siteURL).href
  await fetch(blockFileURL, {
    method: 'put',
    body: JSON.stringify(data)
  })
  copyButton.textContent = 'Saved! ✅'

  if (!window.location.href.includes(siteURL)) {
    window.location.href = siteURL
  }
}

async function loadBlocks () {
  const blockFileURL = new URL(BLOCKS_JSON_FILE, window.location.href).href
  try {
  const dataResponse = await fetch(blockFileURL)

  if (dataResponse.ok) {
    const data = await dataResponse.json()
    for (const link of data) {
      blocksToDraw.push(new Block(link))
    }
    drawBlocks()
  } else {
    throw new Error(dataResponse)
    }
  } catch(dataResponse) {
    console.error(`Could not load blocks: ${dataResponse.status} - ${await dataResponse.text}`)
    makeNewBlock('https://ipfs-search.com/')
    drawBlocks()
  }
}

const blocksToDraw = []

function initializeRoot () {
  const rootDiv = document.getElementById('root')
  rootDiv.textContent = 'My Collection'

  const createCopy = document.createElement('button')
    createCopy.setAttribute('href', '#')
    createCopy.setAttribute('class', 'copy-button')
    createCopy.append(document.createTextNode('Save Blocks 📝'))
    createCopy.addEventListener('click', async () => {
      saveBlocks()
    })

  rootDiv.append(createCopy)


  const shelf = document.createElement('div')
  shelf.setAttribute('id', 'shelf')
  rootDiv.append(shelf)
}

window.onload = function run () {
  initializeRoot()
  loadBlocks()
  drawBlocks()
}
