# Drag and Drop
# Drag and Drop to IPFS and Hypercore

## Introduction
This tutorial guides you through building a simple yet powerful web application that allows users to drag and drop files, publishing them directly to IPFS and Hypercore. Imagine Alice, an artist who wants to share her digital art easily. With this app, she can drag her artwork into the browser, and it's instantly available on the decentralized web.

## Prerequisites
- Basic knowledge of HTML, CSS, and JavaScript.
- Agregore browser installed on your machine.

## Setting Up Your Environment
1. **Install Agregore Browser:** Download and install the Agregore browser from [Agregore's official website](https://agregore.mauve.moe/).
2. **Create a Project Folder:** Create a new folder on your computer where you will store your project files.

## Building the Application
### Step 1: HTML Structure
Create an `index.html` file in your project folder and add the following HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Drag and Drop to IPFS and Hypercore</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <main>
        <label for="protocolSelect">Protocol:</label>
        <select id="protocolSelect">
            <option value="ipfs" selected>IPFS</option>
            <option value="hyper">Hypercore</option>
        </select>
        <section id="uploadBox">Drop a file here</section>
        <ul id="uploadListBox"></ul>
    </main>
    <script src="script.js"></script>
</body>
</html>
```

Notice the simplicity of our HTML file.
- A dropdown element to select the protocol
- A section to drop the file
- A list element to contain our uploaded files
- Both the CSS and Javascript are loaded from external files for simplicity and maintainability

### Step 2: Adding styles
Create a styles.css file for styling the application:

```css
@import url("agregore://theme/vars.css");
html {
    background: var(--ag-theme-background);
    color: var(--ag-theme-text);
    font-family: var(--ag-theme-font-family);
}
#uploadBox {
    padding: 1em;
    border: 0.25em solid var(--ag-theme-primary);
    border-radius: 0.5em;
    display: flex;
    justify-content: center;
    align-items: center;
}

a {
    color: var(--ag-theme-secondary);
    padding:0.15em 0.5em;
    border-radius: 0.5em;
}
a:hover {
    color: var(--ag-theme-background);
    background-color: var(--ag-theme-secondary);
    text-decoration: none;
}		

main {
    margin: 1em;
}

select, select * {
    background: var(--ag-theme-background);
    font-size: inherit;
    margin-bottom: 1em;
    color: var(--ag-theme-text);
    border: 0.05em solid var(--ag-theme-secondary);
    padding:0.25em;
    border-radius: 0.25em;
}

*::selection, option:hover {
    background: var(--ag-theme-primary);
    color: var(--ag-theme-text);
}
```

### Step 3: JavaScript for Drag-and-Drop
In your `script.js` file, add the JavaScript code:  

```javascript
function $(query) {
    return document.querySelector(query)
}

const uploadBox = $('#uploadBox')
uploadBox.ondragover = () => false
uploadBox.ondrop = async (e) => {
    e.preventDefault()
    const { dataTransfer } = e
    if(!dataTransfer) return

    for(const file of dataTransfer.files) {
        await uploadFile(file)
    }
}

const uploadListBox = $('#uploadListBox')

const protocolSelect = $('#protocolSelect')

async function uploadFile(file) {
    const name = file.name;
    const buffer = await file.arrayBuffer();
    const protocol = protocolSelect.value;

    // Create a Blob from the ArrayBuffer
    let mimeType = 'application/octet-stream'; // Default MIME type

    // Use the MIME type from the File object if available
    if (file instanceof File) {
        mimeType = file.type || mimeType;
    }

    const blob = new Blob([buffer], { type: mimeType }); // Create a blob from the array buffer

    // Headers
    const headers = {
        'Content-Type': mimeType,
    };

    // Construct the URL with the actual hypercore key
    let url;
    let hyperdriveUrl;
    let body = file instanceof File ? blob : buffer;

    if (protocol === 'hyper') {
        hyperdriveUrl = await generateHyperdriveKey(name);
        url = `${hyperdriveUrl}${name}`;
    } else {
        url = `ipfs://bafyaabakaieac/${name}`;
    }

    console.log('Uploading', { name, body, protocol, headers });

    const response = await fetch(url, {
        method: 'PUT',
        body,
        headers 
    });

    if (!response.ok) return addError(name, await response.text());
    const urlResponse = protocol === 'hyper' ? response.url : response.headers.get('Location');
    addURL(urlResponse);
}

async function generateHyperdriveKey(name) {
    try {
        const response = await fetch(`hyper://localhost/?key=${name}`, { method: 'POST' });
        if (!response.ok) {
            throw new Error(`Failed to generate Hyperdrive key: ${response.statusText}`);
        }
        return await response.text();  // This returns the hyper:// URL
    } catch (error) {
        console.error('Error generating Hyperdrive key:', error);
        throw error;
    }
}

function addURL(url) {
    uploadListBox.innerHTML += `<li><a href="${url}">${url}</a></li>`
}

function addError(name, text) {
    uploadListBox.innerHTML += `<li class="log">Error in ${name}: ${text}</li>`
}
```

### Explaining the code 

First, we define a function to simplify document.querySelector
```javascript
function $(query) {
    return document.querySelector(query);
}
```
- This function $ is a shorthand for document.querySelector, allowing us to easily select elements in the DOM using CSS selectors.

Then, we select the upload box and setup drag and drop events
```javascript
const uploadBox = $('#uploadBox');
uploadBox.ondragover = () => false;
uploadBox.ondrop = async (e) => {
    e.preventDefault();
    const { dataTransfer } = e;
    if (!dataTransfer) return;

    for (const file of dataTransfer.files) {
        await uploadFile(file);
    }
};
```
- We select the upload box element. We prevent the default behavior for ondragover to allow dropping files. The ondrop event is handled by reading the dropped files and processing them through uploadFile.

We define the selectors for the uploaded files list and the protocol dropdown selector
```javascript
const uploadListBox = $('#uploadListBox');
const protocolSelect = $('#protocolSelect');
```
- These selectors are for the upload list box where the uploaded file URLs will be displayed, and the protocol dropdown for selecting between IPFS and Hypercore.

We create a function to upload the files.
```javascript
async function uploadFile(file) {
    // ... [code above]
}
```
- This function handles the file uploading. It creates a Blob from the file's buffer and sets up the correct headers. Depending on the selected protocol, it generates a Hyperdrive key for Hypercore or constructs an IPFS URL, then performs the fetch request to upload the file.

For Hypercore uploads, we generate a Hyperdrive key.
```javascript
async function generateHyperdriveKey(name) {
    // ... [code above]
}
```
- The function above generates a Hyperdrive key by making a POST request to hyper://localhost. The generated URL is returned for use in the uploadFile function.

Finally, we add two utility functions.
```javascript
function addURL(url) {
    uploadListBox.innerHTML += `<li><a href="${url}">${url}</a></li>`;
}

function addError(name, text) {
    uploadListBox.innerHTML += `<li class="log">Error in ${name}: ${text}</li>`;
}
```
- addURL adds the uploaded file's URL to the list on the webpage, allowing users to click and access the uploaded file.  
- addError is used to display any errors encountered during the file upload process.

### Testing the Application
- Run the App: Open the Agregore browser and navigate to the folder containing your project.
- Drag and Drop a File: Test the app by dragging and dropping a file onto the webpage. Check if the file's URL appears in the list and if the file is accessible through the provided link.

### Conclusion
Congratulations! You've just built a decentralized file-sharing app. This tutorial not only introduced you to basic web development concepts but also to the exciting world of decentralized web technologies like IPFS and Hypercore.

Feel free to experiment further with the app, perhaps by adding new features or refining the user interface. The decentralized web is an open canvas for your creativity!

