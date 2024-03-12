# Building a Dlinktree maker and Uploading it to the DWeb

## Introduction

This tutorial walks you through creating a Dlinktree builder - a simple web application that allows you to assemble links to your social media profiles, websites, or any other URLs, directly within the code editor developed in our previous tutorial. Once built, you'll be able to upload your Dlinktree to the decentralized web using IPFS or Hypercore protocols and share it with your friends.

## Prerequisites

- Basic knowledge of [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML), [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS), and [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript).
- Agregore browser installed on your machine.

## Setting yourself up

1. **Install Agregore Browser:** Download and install the Agregore browser from [Agregore's official website](https://agregore.mauve.moe/).
2. **Navigate to the P2Pad: code editor:** This tutorial will use the [P2Pad](https://agregore.mauve.moe/docs/examples/p2pad/) web app that was built during a previous tutorial.  

## Step 1: HTML Structure

In this step, we'll lay the foundation of the Dlinktree builder. The HTML structure provides the skeleton of your web application, defining how content is organized and displayed.

First, navigate to the [P2Pad](https://agregore.mauve.moe/docs/examples/p2pad/) code editor in your Agregore browser. In the HTML container, add the following content to the HTML quadrant seen in the top left (or top row if on mobile):

```html
<html lang="en">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DLINKTREE BUILDER</title>
<main>
    <div class="grid-container" id="grid">
        <h1 id='title' contenteditable="true">
            Click here to edit your title
        </h1>
        <div id="header-image-uploader">
            Click to upload header image
        </div>
        <div class="links dnone" id="linksContainer">
            <!-- Links will be dynamically added here -->
        </div>
        <button id="addLinkButton">Add New Link</button>
        <!-- Hidden form for adding/editing links -->
        <div id="linkForm" style="display:none;">
            <input type="text" id="linkText" placeholder="Link Text">
            <input type="url" id="linkUrl" placeholder="ipfs://, hyper:// or https://">
            <button type="button" onclick="addLink()">Save Link</button>
        </div>
    </div>
    <div id="upload-container">
        <div>
            <label for="protocol">
                Protocol:
                <select id="protocol">
                    <option value="ipfs" selected>Inter-Planetary File System (IPFS://)</option>
                    <option value="hyper">Hypercore-Protocol (HYPER://)</option>
                </select>
            </label>
            <button id="uploadToDWebButton">Upload to DWeb</button>
        </div>
    </div>
    <ul id="uploadLinks"></ul>
</main>
```

This structure provides a simple yet flexible layout for your Dlinktree. It includes a section for a header image, an editable title, a container for your links, and a form for adding new links. The dweb-container holds the controls for uploading your Dlinktree to the decentralized web.

This are the necessary elements required for the Dlinktree maker. Next, we will add CSS to style it according to our needs.

## Step 2: CSS Styling

In this step, we'll apply CSS styles to make the Dlinktree visually appealing and ensure it aligns with the Agregore browser's theming. This styling will provide a cohesive look and feel that adapts to user theme settings, ensuring accessibility and user comfort.

Navigate to the CSS container in the P2Pad code editor and replace the existing content with the following CSS code:

```css
@import url("agregore://theme/vars.css");

:root {
    --gap: 5px;
    --half-gap: calc(var(--gap) / 2);
}

body, * {
    padding: 0;
    margin: 0;
    font-family: var(--ag-theme-font-family);
    background: var(--ag-theme-background);
    color: var(--ag-theme-text);
    box-sizing: border-box;
}

main {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.grid-container {
    display: grid;
    grid-template-columns: 1fr; /* One column */
    grid-template-rows: repeat(3, 1fr); /* 3 rows on load */
    height: 95vh;
    gap: var(--gap);
}

.grid-container > *,  .grid-container > textarea {
    padding: var(--gap);
    overflow: auto;
    border: 1px solid var(--ag-theme-primary);
    resize: none;
    height: 100%;
    min-height: 1rem;
}

div textarea:focus, #uploadToDWebButton:hover {
    outline: 2px solid var(--ag-theme-secondary); 
    color: var(--ag-theme-text);
}

#dweb-container,
#uploadListBox {
    display: flex;
    padding: 0 var(--half-gap);
    align-items: center;
    justify-content: space-between;
}

#dweb-container > * , #uploadListBox li {
    display: flex;
    align-items: flex-end;
    gap: var(--half-gap);
}


.links {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    padding: var(--gap);
}

span {
    pointer-events: cursor;
    color: var(--ag-theme-secondary);
}

span:hover {
    color: var(--ag-theme-primary);
}

.dnone {
    display: none;
}

@media screen and (max-width: 768px) {
    #dweb-container, #dweb-container > *, .grid-container {
        flex-direction: column;
        align-items: flex-start;
        grid-template-columns: 1fr; /* Adjusts to a single column for mobile */
    }
}
```

### Key Aspects of the CSS Code

1. **Agregore Theming Integration**: The @import url("agregore://theme/vars.css"); line integrates the Dlinktree with the Agregore browser's theme, ensuring that the app's look and feel match the user's theme settings.

2. **Layout and Responsiveness**: The .grid-container uses CSS Grid to organize content into a single column, adaptable to the content's length. The media query ensures the layout remains user-friendly on mobile devices.

3. **Styling Details**: Custom properties (--gap and --half-gap) streamline spacing throughout the design. The focus state for textareas and the hover state for SVG icons enhance the interactive experience.

4. **Flexbox for Alignment**: Flexbox properties in #dweb-container and #uploadListBox ensure that elements within these containers are spaced evenly and aligned correctly, contributing to a clean and organized layout.

This CSS setup not only styles our Dlinktree builder but also ensures it is flexible and responsive, providing a smooth user experience across different devices and screen sizes.

## Step 3: Interactivity with Javascript

In this step, we will add interactivity to our Dlinktree builder using JavaScript. This involves enabling users to add new links, edit the title, upload a header image, and prepare the content for uploading to the decentralized web. Follow along to implement these features.

In the JavaScript container on the P2Pad code editor, add the following code:

```javascript
function addLink() {
    const linkUrl = document.getElementById('linkUrl');
    const linkText = document.getElementById('linkText');
    const linkForm = document.getElementById('linkForm');
    const linksContainer = document.getElementById('linksContainer');
    
    if (!linkText.value || !linkUrl.value) {
        alert("Please fill out both fields.");
        return;
    }

    const newLink = document.createElement('a');
    newLink.href = linkUrl.value;
    newLink.textContent = linkText.value;
    newLink.target = '_blank';
    linksContainer.appendChild(newLink);
    linksContainer.classList.remove("dnone");

    linkForm.style.display = 'none'; // Hide the form
}

async function uploadFile(file) {
    const protocol = document.getElementById('protocol');
    const protocolValue = protocol.value;
    let filename;
    const formData = new FormData();

    // Append the file to the FormData
    const originalName = file.name.trim();
    // Extracting the extension (assuming there is one)
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    // Removing the extension from the original name for manipulation
    const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
    // Replacing spaces, parentheses, and dots within the base name
    const safeBaseName = baseName.replace(/[\s().]+/g, '_');
    // Reconstructing the filename with the original extension
    filename = `${safeBaseName}${extension}`;
    formData.append('file', file, filename);


    // Construct the URL based on the protocol
    let url;
    if (protocolValue === 'hyper') {
        const hyperdriveUrl = await generateHyperdriveKey('drag-and-drop');
        url = `${hyperdriveUrl}`;
    } else {
        url = `ipfs://bafyaabakaieac/`;
    }

    // Perform the upload for each file
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            addError(file, await response.text());
        }
        const urlResponse = protocolValue === 'hyper' ? response.url : response.headers.get('Location');

        return { url: urlResponse, filename };
    } catch (error) {
        console.error(`Error uploading ${file}:`, error);
    }
}

// assemble code before uploading
async function assembleCode() {
    var headerImage = document.getElementById("header-image-uploader");
    var backgroundImageComputed = window.getComputedStyle(headerImage).backgroundImage.replace(/['"]+/g, '');
    console.log('Computed background image:', backgroundImageComputed);
    const links = document.createElement('ul');

    Array.from(linksContainer.children).forEach(a => {
        const li = document.createElement('li');
        li.appendChild(a.cloneNode(true)); 
        links.appendChild(li);
    });

    let pageTitle = document.getElementById("title").textContent;

    // Fetch styles.css content to import as our basic CSS
    let basicCSS = '';
    try {
        const response = await fetch('./styles.css'); 
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        basicCSS = await response.text();
    } catch (error) {
        console.error("Failed to fetch styles.css:", error);
    }

    // Combine your code into a single HTML file
    let combinedCode = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${pageTitle}</title>
        <style>${basicCSS}</style>
        <style>
        body {
            overflow: hidden;
        }
        .header-image {
            position: relative;
            width: 100%;
            height: 100vh; 
            background-size: cover;
            background-position: center;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            position: absolute;
            width: 100%;
            height: 100vh;
            text-align: center;
            background-color: transparent;
            color: var(--ag-theme-text);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            top: 0;
        }
        .content {
            width: fit-content;
            background-color: var(--ag-theme-background);
            border-radius: 1rem;
            padding: 1rem;
        }
        li {
            list-style: none;
        }
        </style>
        
    </head>
    <body>
    <div class='header-image' style="background-image: ${backgroundImageComputed}"></div>
    <div class='container'>
        <div class='content'>
            <h1>${pageTitle}</h1>
            <div>${links.outerHTML}</div>
        </div>
    </div>
    </body>
    </html>`;

    // Convert the combined code into a Blob
    const blob = new Blob([combinedCode], { type: 'text/html' });
    const file = new File([blob], "index.html", { type: 'text/html' });

    // Upload the file
    const response = await uploadFile(file);
    addURL(response.url);
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
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = url;
    link.textContent = url;
    link.target = '_blank'; // Ensures the link opens in a new tab
    
    const copyIcon = '⊕'

    const copyContainer = document.createElement('span');
    copyContainer.innerHTML = copyIcon;
    copyContainer.style.cursor = 'pointer';
    copyContainer.onclick = function() {
        navigator.clipboard.writeText(url).then(() => {
            alert('URL copied to clipboard!');
        }).catch(err => {
            console.error('Error in copying text: ', err);
        });
    };

    listItem.appendChild(link);
    listItem.appendChild(copyContainer);
    const uploadListBox = document.getElementById('uploadLinks');
   uploadListBox.appendChild(listItem);
}

function setImageAsBackground(fullUrl) {
    const bgImg = document.getElementById('header-image-uploader');
    console.log('Setting background image:', fullUrl);
    bgImg.style.backgroundImage = `url('${fullUrl}')`;
    bgImg.textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const uploadToDWebButton = document.getElementById("uploadToDWebButton");
    const addLinkButton = document.getElementById("addLinkButton");
    const linkForm = document.getElementById("linkForm");
    uploadToDWebButton.addEventListener('click', assembleCode);
    addLinkButton.addEventListener('click', function() {
        linkForm.style.display = 'block';
    });

    // Invisible file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Click on div to trigger file input
    var headerImage = document.getElementById("header-image-uploader");
    headerImage.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change event to handle the files
    fileInput.addEventListener('change', (event) => {
        const files = event.target.files;
        console.log(`File input changed, number of files selected: ${files.length}`);
        if (files.length) {
            console.log(`Attempting to upload file: ${files[0].name}`);
             uploadFile(files[0]).then(({ url, filename }) => {
             const fullUrl = `${url}${filename}`;
            setImageAsBackground(fullUrl); 
        }).catch(error => {
            console.error("Failed to upload file and set background image:", error);
        });
        }
    });
    
    // Drag and drop
    headerImage.addEventListener('dragover', (event) => {
        event.preventDefault();
        console.log('File is being dragged over the header image div.');
    });
    
    headerImage.addEventListener('drop', (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        console.log(`File dropped, number of files: ${files.length}`);
        if (files.length) {
            uploadFile(files[0]).then(({ url, filename }) => {
                const fullUrl = `${url}${filename}`;
                setImageAsBackground(fullUrl); 
            }).catch(error => {
                console.error("Failed to upload file and set background image:", error);
            });
        }
    });
});
```

### Explaining the code

This was a big block of javascript so let's go through it and explain each aspect of it.

#### Adding Links to our DLinktree

This is a function to add new links dynamically to the Dlinktree. This function will validate the input fields and append the new link to the display. Once it has been added, the form disappears.

```javascript
function addLink() {
    const linkUrl = document.getElementById('linkUrl');
    const linkText = document.getElementById('linkText');
    const linkForm = document.getElementById('linkForm');
    const linksContainer = document.getElementById('linksContainer');
    
    if (!linkText.value || !linkUrl.value) {
        alert("Please fill out both fields.");
        return;
    }

    const newLink = document.createElement('a');
    newLink.href = linkUrl.value;
    newLink.textContent = linkText.value;
    newLink.target = '_blank';
    linksContainer.appendChild(newLink);
    linksContainer.classList.remove("dnone");

    linkForm.style.display = 'none'; // Hide the form
}
```

#### Uploading Files to the Decentralized Web

Implementation of the uploadFile function to handle file uploads to either the Hyperdrive protocol or IPFS, based on the selected protocol by the user. The function returns the CID or URL with the filename. The filename allows us to add the uploaded file to our HTML as background image.

```javascript
async function uploadFile(file) {
    console.log('Uploading file:', file);
    // Process file and formData setup omitted for brevity
    // Upload logic based on the selected protocol
    // Returns the URL and filename for further processing
    // Refer to the full javascript code for all details
}
```

#### Setting the Uploaded Image as Background Image

Once we have uploaded an image to IPFS, we can retreive this image CID and set it as background-image.

```javascript
function setImageAsBackground(fullUrl) {
    const bgImg = document.getElementById('header-image-uploader');
    console.log('Setting background image:', fullUrl);
    bgImg.style.backgroundImage = `url('${fullUrl}')`;
    bgImg.textContent = '';
}
```

#### Assemble and Upload the Dlinktree Building 

Before uploading, the DLinktree builder is compiled into a single HTML file, incorporating the links and the header image. This step involves gathering all dynamic elements and styles, then creating an HTML blob for upload.

```javascript
async function assembleCode() {
    // Process to assemble the HTML content
    // Upload the assembled HTML to the decentralized web
    // Refer to the full javascript code for reference
}
```


Notice that the `assembleCode` function allows us to style the final output. The `header-image` is set to fill in the page. The `container` will hold our `content` in the center of the page.  These are the elements you would edit if you want a different layout for you DLinktree.
An easy edit would be to change the CSS for these different elements.

#### Display and Share Dlinktree URL

Implement functions to handle file uploads to the dWeb and to show its URL/CID. The addURL function accomplishes this by adding the DWeb URL to the list of uploaded Dlinktrees within the application interface:

```javascript
function addURL(url) {
    // Create a list item with the Dlinktree URL and a copy button
}
```


#### Utility functions for DWeb Interactions

Implement the function to generate a Hyperdrive Key when dealing with Hyper protocol file uploads.

```javascript
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
```

## Step 4: Uploading to the dWeb

Once you're satisfied with your Dlinktree Builder, use the "Upload to DWeb" button in the code editor's interface to upload your project. Choose your preferred protocol (IPFS or Hypercore) before uploading.

### Testing Your Dlinktree

After uploading, you'll receive a URL that points to your Dlinktree on the decentralized web. Open this URL in the Agregore browser to view and share your Dlinktree builder. This app can now be used to build your DLinktree page.

## Conclusion

Congratulations! You've successfully created a Dlinktree builder and uploaded it to the decentralized web directly from the browser-based code editor. This tutorial not only reinforced your web development skills but also demonstrated the power and ease of publishing content on the decentralized web.

Feel free to experiment with the design and functionality of your Dlinktree builder, adding features such as themes or animations to make it uniquely yours.