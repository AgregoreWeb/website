# Tutorial - Text Editor

This tutorial goes over how to create a basic text editor.

You can follow along and create this app using the [DWeb Scratchpad](/apps/scratchpad.html).

## Features

Before making the tool, we need to figure out why it exists and what it will be used for.
In this case we want a tool to edit text files. Specifically there's two "users" for this tool.
The first is people using Agregore and want to write / save a text file from scratch.
The other "user" is other applications like the [file viewer](/apps/fileviewer.html) which want to focus on their purpose (in this case browsing site data) and leave other features to other tools.

With these use cases in mind the first step is to figure out which features we want to add to the editor.
Agregore has some nice features built in out of the box thanks to the font based syntax highlighting and a user customized color scheme.
For this tutorial we'll focus on the bare essentials: Loading text into a `<textarea>` element, and savng text from the textarea.
For loading we'll either have a value in the URL, or prompt the user to either supply a URL or create a file in a new p2p site.

## Basic structure

We'll start by sketching out the HTML structure for the app.
Add the following to the second box in the scratchpad.

```html
<header>
  <h1>Text Editor</h1>
</header>
<textarea id="editorBox"></textarea>
<dialog id="loadDialog">
  <h2>Load file</h2>
</dialog>
<dialog id="createDialog">
  <h2>Create file</h2>
</dialog>
```

Since the text box is the most important part of the page, we'll add some CSS to the third box to make it fill the screen using [FlexBox](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Flexbox).

```css
/* Make the top level elements fill the screen*/
html, body {
 margin: 0px;
 padding: 0px;
 width: 100%;
 height: 100%;
}

/* Enable flexbox on the main page content*/
body {
    display: flex;
    flex-direction: column;
    padding: 0px 0.5em;
}

/* Reset heading style */
h1 {
  font-size: 1rem;
  display: inline;
}

/* Have the editor fill the page */
#editorBox {
    flex: 1;
}
```

## Loading URLs

Now that we have the general look, lets add some functionality.
We'll add some JavaScript to the fourth box in the scratchpad to get the `url` parameter from the URL of the page and load the data into the textarea.

URLs in web browsers follow a structure like this: `protocol://hostname/pathname?search`.
The `protocol` lets the browser know what method to use to load data (for example `http://` or `ipfs://`).
The `hostname` lets the protocol handler know where some data lives or what the main identifier for a dataset is (for example DNS domains like `agregore.mauve.moe` or a public keys like `816idd9ddxq8asy68sya1y3du3nyipiszcr6tfyq66x47ha3jxuy`).
The `pathname` points to a specific resource in the hostname, like a file path in a folder (for example `/example.html` or `/some/deeply/nested/folder/`).
The `search` parameter is used to add some extra options for a given resource, sometimes it gets used for filtering, and sometimes it gets used to pass options to the page being loaded.
It consists of a series of key-value pairs separated by the `&` symbol, for example `?query=hello&page=6`.

In our case we want an easy way for other web apps to use the editor, so lets use the `url` search parameter to the page URL for the editor to know which page it should load.
We can use the `window.location` variable to get the page URL, and the [URL searchPArams](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams) API for parsing it out.

```JavaScript
function getURLFromSearch() {
    const {searchParams} = new URL(window.location)
    const url = searchParams.get('url')
    return url
}
```

Next, we need a function to load text from a URL. We can use the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for this.

```JavaScript
async function loadTextFromURL(url) {
    const response = await fetch(url)
    const text = await response.text()
    if(!response.ok) {
        throw new Error(`Couldn't load URL ${response.status}: ${text}`)
    }
    return text
}
```

Finally, we can combine this into some code to try to load the URL. Add this at the top of your JavaScript section.

```JavaScript
const url = getURLFromSearch()

if(url) {
    const text = await loadTextFromURL(url)
    editorBox.value = text 
}
```

With this in place, save your current progress in the scratchpad. Give it a title like `Text Editor`, and a file name like `texteditor.html`.

Once it's saved and you see the editor in a new window, append this text to the URL to make it try to load its own contents.

```
?url=./texteditor.html
```

## Saving

Now that we have a way to load from a URL, we should add a way to save back onto it.

First, let us define a function to save text to a URL. We'll make use of the `fetch` API again.

```JavaScript
async function saveTo(url, text) {
  const response = await fetch(url, {
    method: 'put',
    body: text
  })

  if(!response.ok) {
    throw new Error(`Couldn't save text ${response.status}: ${text}`)
  }
  // Pull the response text out
  await response.text()
}
```

Next lets add a `save` button to the header which will save the current text

```html
<header>
    <h1>Text Editor</h1>
    <button id="saveButton" title="Save File">💾</button>
</header>
```

Then, lets add some JavaScript to handle clicks.
It will get the URL, save the text, and notify the user.
Add this to the top of the JavaScript section.

```JavaScript
saveButton.onclick = async () => {
  try {
    const url = getURLFromSearch()
    const text = editorBox.value
    await saveTo(url, text)
  } catch (e) {
    alert(e.message)
    return
  }
  alert('Saved!')
}
```

With this in place we can now load and save files from the URL querystring.

Try updating the search param to `example.txt` and saving a file to it.

```
?url=./example.txt
```

## URL Loading UI

What should we do if the user naviates to the editor without a file already supplied in the url?
For this we should have a way to let the user either specify the URL they want to edit manually, or choose what protocol / site name / file name they want to save to.

First, lets modify the dialog with a new form for loading from a URL.
By default when a form is submitted, it will encode all `input` tags as search parameters using their `name` and `value` attributes.
This means we can make a form to set the URL paramater without needing to add any extra JavaScript! Note the `required` field which prevents this form from being submitted until a value has been entered for the URL.

```html
<dialog id="loadDialog">
  <h2>Load file from URL</h2>
  <form>
    <label>URL to load from</label>
    <input name="url" id="loadURLInput" required>
    <button>Load</button>
  </form>
</dialog>
```

Next, we should open this dialog if no URL has been supplied. As a nice ease of use feature, we should pre-fill the url to load with the `url` search parameter from earlier so users can decide to use the same site but a different file name if they want to copy the file somewhere.

```JavaScript
const url = getURLFromSearch()

if(url) {
  loadURLInput.value = url
  const text = await loadTextFromURL(url)
  editorBox.value = text 
} else {
  loadDialog.showModal()
}
```

We should also add a button that opens this modal:

```html
<header>
    <h1>Text Editor</h1>
    <button id="saveButton" title="Save File">💾</button>
    <button id="loadButton" title="Load File">📂</button>
</header>
```

And some code to wire it up:

```JavaScript
loadButton.onclick = () => loadDialog.showModal()
```

## New File Creation

Finally, we want to make it easy to create new files, too.

We can swipe the from from the [scratchpad](/apps/scratchpad.html).

```html
<dialog id="createDialog">
  <h2>Create file</h2>
  <form id="saveForm">
    <fieldset>
      <label>
        Save Type
      </label>
      <select name="saveType">
        <option value="hyper">hyper://</option>
        <option value="ipfs">ipfs://</option>
        <option value="ipns">ipns://</option>
      </select>
      <label>
        Site Name
      </label>
      <input name="siteName" value="dweb_scratchpad">
      <label>
        File Name
      </label>
      <input name="fileName" value="example.txt">
    <button>Create</button>
  </form>
</dialog>
```

This form collects everything we need to build a URL from scratch: The protocol, a site name (used to derive the public key), and the path for where the file will be saved. The `<fieldset>` element adds some styles to render the fields as a grid using the default browser styles.

Here are some functions for creating different URLs based on the protocol type, site name, and file name.

```JavaScript
const IPFS_EMPTY_FOLDER = 'ipfs://bafyaabakaieac/'

async function getIPNSURL(siteName) {
  const response = await fetch(`ipns://localhost/?key=${siteName}`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to generate IPNS key: ${await response.text()}`);
  }
  await response.text()
  return response.headers.get('Location')
}

async function getHyperURL(siteName) {
  const response = await fetch(`hyper://localhost/?key=${siteName}`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to generate Hyperdrive key: ${await response.text()}`);
  }
  return await response.text()
}

async function makeFileURL(protocol, siteName, fileName) {
  if(protocol === 'ipfs') {
    // IPFS has no site name since it's immutable sites
    return new URL(fileName, IPFS_EMPTY_FOLDER)
  } else if(protocol === 'ipns') {
    const base = await getIPNSURL(siteName)
    return new URL(fileName, base)
  } else if(protocol === 'hyper') {
    const base = await getHyperURL(siteName)
    return new URL(fileName, base)
  }

  throw new Error(`Invalid Protocol: ${protocol}`)
}
```

Here's some code for turning that form data into a URL to save to and setting the URL, add it next to the button onclick handlers.

```JavaScript
saveForm.onsubmit = async (e) => {
  e.preventDefault()
  const formData = new FormData(saveForm)
  const fileName = formData.get('fileName')
  const protocol = formData.get('saveType')
  const siteName = formData.get('siteName')

  const newFileURL = await makeFileURL(protocol, siteName, fileName)

  const pageURL = new URL(window.location)
  pageURL.searchParams.set('url', newFileURL)

  window.open(pageURL)
  createDialog.close()
}
```

Next we should add a new button for creating a new file:

```html
<header>
    <h1>Text Editor</h1>
    <button id="saveButton" title="Save File">💾</button>
    <button id="loadButton" title="Load File">📂</button>
    <button id="createButton" title="Create New File">➕</button>
</header>
```

And finally we can add an `onclick` listener to open the dialog.

```JavaScript
createButton.onclick = () => createDialog.showModal()
```

Try pushing the new button and creating a text file to edit, or changing the site name and protocol. Once you have something saved, try looking at your list of sites at `agregore://sites`

## Ideas for improvement

This editor is fairly barebones and lacks features like text formatting, keyboard shortcuts for autocomplete, buttons for undo/redo, maybe some suggestions for text to write using the LLM API. See if you can find some feature you'd like to have and add it for yourself.

## Final Code

You can find the latest version of the text editor [here](/apps/texteditor.html), and you can try editing it by opening it in the [scratchpad](/apps/scratchpad.html?url=/apps/texteditor.html).

Your final code from this tutorial should look something like this:

```html
<header>
    <h1>Text Editor</h1>
    <button id="saveButton" title="Save File">💾</button>
    <button id="loadButton" title="Load File">📂</button>
    <button id="createButton" title="Create New File">➕</button>
</header>
<textarea id="editorBox"></textarea>
<dialog id="loadDialog">
  <h2>Load file from URL</h2>
  <form>
    <label>URL to load from</label>
    <input name="url" id="loadURLInput" required="">
    <button>Load</button>
  </form>
</dialog>
<dialog id="createDialog">
  <h2>Create file</h2>
  <form id="saveForm">
    <label>
      Save Type
    </label>
    <select name="saveType">
      <option value="hyper">hyper://</option>
      <option value="ipfs">ipfs://</option>
      <option value="ipns">ipns://</option>
    </select>
    <label>
      Site Name
    </label>
    <input name="siteName" value="notes">
    <label>
      File Name
    </label>
    <input name="fileName" value="example.txt">
    <button>Create</button>
  </form>
</dialog>
```

```css
/* Make the top level elements fill the screen*/
html, body {
 margin: 0px;
 padding: 0px;
 width: 100%;
 height: 100%;
}

/* Enable flexbox on the main page content*/
body {
    display: flex;
    flex-direction: column;
    padding: 0px 0.5em;
}

/* Reset heading style */
h1 {
  font-size: 1rem;
  display: inline;
}

/* Have the editor fill the page */
#editorBox {
    flex: 1;
}
```

```JavaScript
saveForm.onsubmit = async (e) => {
  e.preventDefault()
  const formData = new FormData(saveForm)
  const fileName = formData.get('fileName')
  const protocol = formData.get('saveType')
  const siteName = formData.get('siteName')

  const newFileURL = await makeFileURL(protocol, siteName, fileName)

  const pageURL = new URL(window.location)
  pageURL.searchParams.set('url', newFileURL)

  window.open(pageURL)
  createDialog.close()
}

saveButton.onclick = async () => {
  try {
    const url = getURLFromSearch()
    const text = editorBox.value
    await saveTo(url, text)
  } catch (e) {
    alert(e.message)
    return
  }
  alert('Saved!')
}

loadButton.onclick = () => loadDialog.showModal()

createButton.onclick = () => createDialog.showModal()

const url = getURLFromSearch()

if(url) {
  loadURLInput.value = url
  const text = await loadTextFromURL(url)
  editorBox.value = text 
} else {
  loadDialog.showModal()
}

const IPFS_EMPTY_FOLDER = 'ipfs://bafyaabakaieac/'

async function getIPNSURL(siteName) {
  const response = await fetch(`ipns://localhost/?key=${siteName}`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to generate IPNS key: ${await response.text()}`);
  }
  await response.text()
  return response.headers.get('Location')
}

async function getHyperURL(siteName) {
  const response = await fetch(`hyper://localhost/?key=${siteName}`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to generate Hyperdrive key: ${await response.text()}`);
  }
  return await response.text()
}

async function makeFileURL(protocol, siteName, fileName) {
  if(protocol === 'ipfs') {
    // IPFS has no site name since it's immutable sites
    return new URL(fileName, IPFS_EMPTY_FOLDER)
  } else if(protocol === 'ipns') {
    const base = await getIPNSURL(siteName)
    return new URL(fileName, base)
  } else if(protocol === 'hyper') {
    const base = await getHyperURL(siteName)
    return new URL(fileName, base)
  }

  throw new Error(`Invalid Protocol: ${protocol}`)
}


async function saveTo(url, text) {
  const response = await fetch(url, {
    method: 'put',
    body: text
  })

  if(!response.ok) {
    throw new Error(`Couldn't save text ${response.status}: ${text}`)
  }
  // Pull the response text out
  await response.text()
}

function getURLFromSearch() {
    const {searchParams} = new URL(window.location)
    const url = searchParams.get('url')
    return url
}

async function loadTextFromURL(url) {
    const response = await fetch(url)
    const text = await response.text()
    if(!response.ok) {
        throw new Error(`Couldn't load URL ${response.status}: ${text}`)
    }
    return text
}
```