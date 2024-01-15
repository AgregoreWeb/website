# Code Editor
## Building a Real-Time Browser-Based Code Editor with Agregore


## Introduction

This tutorial will guide you through creating a real-time code editor in your browser using Agregore. This editor will allow you to write HTML, CSS, and JavaScript code and see live results. By the end of this tutorial, this real-time code editor will be capable of interacting with the decentralized web, giving you practical experience in both front-end web development and decentralized web protocols. Additionally, the code written can be easily shared as the interface includes buttons that allow you to upload and fetch code from the decentralized web, using IPFS and Hypercore protocols.

## Prerequisites

- Basic knowledge of [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML), [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS), and [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript).
- Agregore browser installed on your machine.

## Setting Up Your Environment
1. **Install Agregore Browser:** Download and install the Agregore browser from [Agregore's official website](https://agregore.mauve.moe/).
2. **Create a Project Folder:** Create a new folder on your computer where you will store the following files:

- `index.html`: The main HTML file.  
- `codeEditor.js`: JavaScript file to handle the editor's functionality.  
- `dweb.js`: JavaScript file to handle interactions with the DWeb.  
- `common.js`: JavaScript file for common functions and selectors.  
- `styles.css`: CSS file for styling the application.  

## Building the Application
### Step 1: HTML Structure

Add the following content to `index.html`:

```html
<meta lang="en">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Real-Time Editor</title>
<link rel="stylesheet" type="text/css" href="styles.css">

<main>
    <div id="backdrop"></div>
    <div id="loadingSpinner" style="display: none;">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g>
              <path d="M50 20A30 30 0 1 0 80 50.00000000000001" fill="none" stroke="#2de56e" stroke-width="14"></path>
              <path d="M49 8L49 32L61 20L49 8" fill="#2de56e"></path>
              <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="2.380952380952381s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
            </g>
        </svg>
    </div>
    <div class="grid-container">
        
        <!-- Text area for Html Code -->
        <textarea id="htmlCode" placeholder="Type HTML code here" spellcheck="false"></textarea>

        <!-- Text area for Javascript Code -->
        <textarea id="javascriptCode" spellcheck="false" placeholder="Type JavaScript code here"></textarea>

        <!-- Text area for Css Code -->
        <textarea id="cssCode" placeholder="Type CSS code here" spellcheck="false"></textarea>

        <!-- Iframe for Code Output -->
        <iframe id="viewer"></iframe>
    
    </div>
    <div id="dweb-container">
        <div>
            <label for="protocolSelect">
                Protocol:
                <select id="protocolSelect">
                    <option value="ipfs" selected>Inter-Planetary File System (IPFS://)</option>
                    <option value="hyper">Hypercore-Protocol (HYPER://)</option>
                </select>
            </label>
            <button id="uploadButton">Upload to DWeb</button>
            
        </div>
        <div id="fetchContainer">
            <input id="fetchCidInput" type="text" placeholder="Enter IPFS CID or Hyperdrive URL ">
            <button id="fetchButton">Fetch from DWeb</button>
        </div>
        
    </div>
    <ul id="uploadListBox"></ul>
</main>
<script type="module" src="common.js"></script>
<script type="module" src="dweb.js"></script>
<script type="module" src="codeEditor.js"></script>
```

Let's do a quick overview of what each of these sections do:

#### HTML Meta and Title
```html
<meta lang="en">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Real-Time Editor</title>
```
- `lang="en"`: Sets the language of the document to English.  
- `charset="UTF-8"`: Specifies the character encoding for the HTML document (UTF-8 is standard for Unicode).  
- `viewport` tag: Ensures the page is responsive and renders well on all devices, particularly mobile devices.  
- `title`: Sets the title of the webpage, which appears in the browser tab.

#### CSS Link

```html
<link rel="stylesheet" type="text/css" href="styles.css">
```
- Links the external CSS file `styles.css` to the HTML document. This file will style the elements of your page.

#### Main Container
```html
<main>
    <!-- Content inside main goes here -->
</main>
```
- The `<main>` element acts as the primary container for the main content of the page.

#### Loading Spinner
```html
<div id="backdrop"></div>
<div id="loadingSpinner" style="display: none;">
    <!-- SVG for Spinner -->
</div>
```
- `backdrop`: A div element used as a backdrop for the loading indicator.
- `loadingSpinner`: Contains an SVG spinner which is displayed while content is loading. Initially set to `display: none;` so it's hidden.

#### Grid Container
```html
<div class="grid-container">
    <!-- Textareas and Iframe -->
</div>
```
- This is a grid layout container that holds the text areas for HTML, CSS, JavaScript code input, and an iframe for rendering the output.

#### Code Input Areas
```html
<textarea id="htmlCode" placeholder="Type HTML code here" spellcheck="false"></textarea>
<textarea id="javascriptCode" spellcheck="false" placeholder="Type JavaScript code here"></textarea>
<textarea id="cssCode" placeholder="Type CSS code here" spellcheck="false"></textarea>
```
- Three `<textarea>` elements for users to input HTML, JavaScript, and CSS code. `spellcheck="false"` disables the browser's spell check feature.

#### Iframe for Output
```html
<iframe id="viewer"></iframe>
```
- An `<iframe>` where the combined output of the HTML, CSS, and JavaScript code is rendered and displayed.

#### DWeb Interaction Container
```html
<div id="dweb-container">
    <!-- Protocol selection and buttons -->
</div>
```
- Contains elements for interacting with the decentralized web, including a dropdown to select the protocol (IPFS or Hypercore), an input to fetch content from a given CID or URL, and buttons to upload to or fetch from the DWeb.

#### Script Tags
```html
<script type="module" src="common.js"></script>
<script type="module" src="dweb.js"></script>
<script type="module" src="codeEditor.js"></script>
```
- These `<script>` tags at the bottom import the JavaScript modules `common.js`, `dweb.js`, and `codeEditor.js`. Placing them at the end ensures that the HTML elements are loaded before the scripts run.

### Step 2: Styling

In `styles.css`, include the necessary styles:

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
    padding: var(--gap);
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--ag-theme-background);
    color: var(--ag-theme-text);
}

.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns */
    grid-template-rows: 1fr 1fr; /* Two rows */
    height: 95vh;
    padding: var(--half-gap);
    row-gap: var(--gap);
    column-gap: var(--gap);
}

.grid-container > * {
    padding: var(--gap);
    width: 100%;
    height: 100%;
    overflow: auto; /* To handle content overflow */
    border: 1px solid var(--ag-theme-primary);
}

.grid-container > textarea {
    resize: none;
    font-size: 1.2rem;
}

#viewer {
    color: var(--ag-theme-text);
}

div textarea:focus {
    outline: 2px solid var(--ag-theme-secondary);
    color: var(--ag-theme-text);
}

#dweb-container,
#uploadListBox {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--half-gap);
}

#dweb-container > * {
    width: 100%;
    display:flex;
    flex-direction:row;
    align-items: flex-end;
    margin-bottom: 0.5rem;
    padding: var(--half-gap);
}

#uploadListBox {
    flex-direction: column;
    align-items: flex-start;
}

li {
    display: flex;
    align-items: flex-end;
}

#loadingSpinner, #backdrop {
    display: none;  
}

#loadingSpinner {
    position: absolute; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%); 
    z-index: 1000; 
    border-radius: 50%;
}

#backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); 
    z-index: 999; 
}

#uploadButton {
    white-space: nowrap;
}

#fetchContainer {
    justify-content: flex-end;
    align-items: flex-end;
}

svg:hover {
    fill: var(--ag-theme-primary);
}

/* Media query for mobile devices */
@media screen and (max-width: 768px) {
    #dweb-container,
    #dweb-container > *  {
       flex-direction: column;
       align-items: flex-start;
    }
    .grid-container {
        grid-template-columns: 1fr; /* One column */
        grid-template-rows: repeat(4, 1fr); /* Four rows */
    }
}
```

Now, let's look at the purpose of each of these styles.
Here's a breakdown of key elements in the stylesheet:
#### Importing Agregore Theme Variables
```css
@import url("agregore://theme/vars.css");
```
- This line imports CSS variables from the Agregore browser theme. These variables provide consistent theming and include settings for colors, fonts, and more.

#### Root Variables
```css
:root {
    --gap: 5px;
    --half-gap: calc(var(--gap) / 2);
}
```
- Custom CSS variables are defined: `--gap` for standard spacing and `--half-gap` for half that spacing. These are used throughout the stylesheet for consistent spacing

#### Global Styles
```css
body, * {
    /* Padding, margin, font, background, color, and box-sizing styles */
}
```
- Sets default padding, margin, font, background color, text color, and box-sizing for all elements. These styles ensure a consistent base for the layout.

#### Main Container
```css
main {
    /* Styling for the main container */
}
```
- Styles for the <main> element, including padding, height, display, flex direction, and color. This sets up the main layout structure.

#### Grid Container
```css
.grid-container {
    /* Grid layout for text areas and iframe */
}
```
- Establishes a grid layout for the editor's text areas and the output iframe. It defines the grid's columns, rows, and spacing.

#### Textareas and Iframe
```css
.grid-container > * {
    /* Common styles for all children of the grid container */
}
.grid-container > textarea {
    /* Additional styles specifically for textareas */
}
#viewer {
    /* Styles for the output iframe */
}
```
- Applies styles to all elements inside the grid container, with additional specific styles for textareas and the output iframe (`#viewer`).

#### Focus State for Textareas
```css
div textarea:focus {
    /* Styles when a textarea is focused */
}
```
- Defines styles for textareas when they are in focus, enhancing user experience and accessibility.

#### DWeb and Upload List Container
```css
#dweb-container,
#uploadListBox {
    /* Flex layout for DWeb interaction elements */
}
```
- Styles the DWeb interaction container and the upload list box, both utilizing flexbox for layout.

#### Responsive Design
```css
@media screen and (max-width: 768px) {
    /* Responsive styles for mobile devices */
}
```
- A media query provides responsive styles for smaller screens, ensuring the editor is usable on mobile devices.

These styles collectively create a user-friendly, visually consistent, agregore-themed responsive interface for the real-time code editor, leveraging the power of modern CSS.

### Step 3: Code Editor Functionality

In codeEditor.js, we define the functionality of that allows for writing code and seeing it rendered in the iFrame. Let's break down the key components:

```javascript
import { $, loadingSpinner, backdrop, iframe } from './common.js'; // Import common functions

// Get the code editor elements
document.addEventListener('DOMContentLoaded', () => {
    const htmlCode = document.getElementById('htmlCode');
    const javascriptCode = document.getElementById('javascriptCode');
    const cssCode = document.getElementById('cssCode');

    // Attach event listeners
    [htmlCode, javascriptCode, cssCode].forEach(element => {
        element.addEventListener('input', () => update(0));
    });
});

// Import CSS from Agregore theme to use in the iFrame
export let basicCSS = `
@import url("agregore://theme/vars.css");
            body, * {
                font-size: 1.2rem;
                margin: 0;
                padding: 0;
                font-family: var(--ag-theme-font-family);
                background: var(--ag-theme-background);
                color: var(--ag-theme-text);
            }
`;

//Function for live Rendering
export function update() {
    let htmlCode = $('#htmlCode').value;
    let cssCode = $('#cssCode').value;
    let javascriptCode = $('#javascriptCode').value;

    // Assemble all elements and Include the basic CSS from Agregore theme
    let iframeContent = `
        <style>${basicCSS}</style>
        <style>${cssCode}</style>
        <script>${javascriptCode}</script>
        ${htmlCode}
    `;
    let iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(iframeContent);
    iframeDoc.close();
}

// Show or hide the loading spinner
export function showSpinner(show) {
    backdrop.style.display = show ? 'block' : 'none';
    loadingSpinner.style.display = show ? 'block' : 'none';
}
```
#### Importing Common Functions and Elements
```javascript
import { $, loadingSpinner, backdrop, iframe } from './common.js';
```
- The first line imports utility functions and common DOM elements from `common.js`. The `$` function simplifies the process of selecting DOM elements.

#### Initializing the Editor
```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Code to initialize the editor
});
```
- Waits for the DOM content to be fully loaded before initializing the editor. This ensures that all HTML elements are available for manipulation.

#### Event Listeners for Textareas
```javascript
[htmlCode, javascriptCode, cssCode].forEach(element => {
    element.addEventListener('input', () => update());
});
```
- Attaches event listeners to the `htmlCode`, `javascriptCode`, and `cssCode` textareas. `input` event triggers the update function for live rendering.


#### Agregore Theme CSS Import
```javascript
export let basicCSS = `
@import url("agregore://theme/vars.css");
            body, * {
                // Basic CSS styles
            }
`;
```
- A string literal containing the basic CSS styles, including importing the Agregore browser theme variables. This CSS is used within the iframe to style the rendered HTML content.

#### Live Rendering Function
```javascript
export function update(i) {
    // Code to update the iframe content live as the user types
}
```
- This function is responsible for the live rendering of HTML, CSS, and JavaScript entered by the user. It updates the content inside the iframe, allowing real-time preview of the code.

#### Loading Spinner Visibility Control
```javascript
export function showSpinner(show) {
    backdrop.style.display = show ? 'block' : 'none';
    loadingSpinner.style.display = show ? 'block' : 'none';
}
```
- Controls the visibility of the loading spinner and backdrop, providing visual feedback during operations that require waiting, like fetching data from the DWeb.

This script is the core of the code editor's functionality, handling user inputs, live preview rendering, and integrating with the Agregore browser's theming system. It provides a seamless and interactive coding experience within the browser.

### Step 4: DWeb Integration with `dweb.js`

In `dweb.js`, we extend the functionality of our code editor to integrate with the decentralized web (DWeb), specifically IPFS and Hypercore. This script shares some functionalities with the previous tutorial on Drag and Drop to IPFS and Hypercore, which can be revisited for a more in-depth understanding. [Link to the previous tutorial]

Here is the content of `dweb.js`:
```javascript
import { update, showSpinner, basicCSS } from './codeEditor.js';
import { $, uploadButton, protocolSelect, fetchButton, fetchCidInput } from './common.js';

// assemble code before uploading
export async function assembleCode() {
    // Display loading spinner
    showSpinner(true);

    // Combine your code into a single HTML file
    let combinedCode = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${basicCSS}</style>
        <style>${document.getElementById("cssCode").value}</style>
    </head>
    <body>
        ${document.getElementById("htmlCode").value}
        <script>${document.getElementById("javascriptCode").value}</script>
    </body>
    </html>`;

    // Convert the combined code into a Blob
    const blob = new Blob([combinedCode], { type: 'text/html' });
    const file = new File([blob], "index.html", { type: 'text/html' });

    // Upload the file
    await uploadFile(file);
    showSpinner(false);
}

uploadButton.addEventListener('click', assembleCode);

// Upload code to Dweb
async function uploadFile(file) {
    const protocol = protocolSelect.value;

    const formData = new FormData();

    // Append file to the FormData
    formData.append('file', file, file.name);


    // Construct the URL based on the protocol
    let url;
    if (protocol === 'hyper') {
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
        const urlResponse = protocol === 'hyper' ? response.url : response.headers.get('Location');
        addURL(urlResponse);
    } catch (error) {
        console.error(`Error uploading ${file}:`, error);
    } finally {
        showSpinner(false);
    }
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

    const svgHTML = `<svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="var(--ag-theme-secondary)">
        <path d="M5.5028,4.627 L5.5,6.75 L5.5,17.2542 C5.5,19.0491 6.95507,20.5042 8.75,20.5042 L17.3663,20.5045 C17.0573,21.3782 16.224,22.0042 15.2444,22.0042 L8.75,22.0042 C6.12665,22.0042 4,19.8776 4,17.2542 L4,6.75 C4,5.76929 4.62745,4.93512 5.5028,4.627 Z M17.75,2 C18.9926,2 20,3.00736 20,4.25 L20,17.25 C20,18.4926 18.9926,19.5 17.75,19.5 L8.75,19.5 C7.50736,19.5 6.5,18.4926 6.5,17.25 L6.5,4.25 C6.5,3.00736 7.50736,2 8.75,2 L17.75,2 Z M17.75,3.5 L8.75,3.5 C8.33579,3.5 8,3.83579 8,4.25 L8,17.25 C8,17.6642 8.33579,18 8.75,18 L17.75,18 C18.1642,18 18.5,17.6642 18.5,17.25 L18.5,4.25 C18.5,3.83579 18.1642,3.5 17.75,3.5 Z">
        </path>
        </svg>`;

    const copyContainer = document.createElement('span');
    copyContainer.innerHTML = svgHTML;
    copyContainer.style.cursor = 'pointer';
    copyContainer.style.color = 'var(--ag-theme-secondary)';
    copyContainer.onclick = function() {
        navigator.clipboard.writeText(url).then(() => {
            copyContainer.textContent = ' Copied!';
            setTimeout(() => {
                copyContainer.innerHTML = svgHTML;
            }, 3000);
        }).catch(err => {
            console.error('Error in copying text: ', err);
        });
    };

    listItem.appendChild(link);
    listItem.appendChild(copyContainer);
    uploadListBox.appendChild(listItem);
}

function addError(name, text) {
    uploadListBox.innerHTML += `<li class="log">Error in ${name}: ${text}</li>`
}

// The fetchFromDWeb function
async function fetchFromDWeb(cidOrName) {
    if (!cidOrName) {
        alert("Please enter a CID or Name.");
        return;
    }

    let url;
    if (cidOrName.startsWith('ipfs://')) {
        url = cidOrName;
    } else if (cidOrName.startsWith('hyper://')) {
        url = cidOrName;
    } else {
        alert("Invalid protocol. URL must start with ipfs:// or hyper://");
        return;
    }

    try {
        const response = await fetch(url);
        
        const data = await response.text();
        parseAndDisplayData(data);
    } catch (error) {
        console.error("Error fetching from DWeb:", error);
        alert("Failed to fetch from DWeb.");
    }
}

// Event listener for fetchButton
fetchButton.addEventListener('click', () => {
    const cidOrName = fetchCidInput.value;
    fetchFromDWeb(cidOrName);
});

function parseAndDisplayData(data) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    // Extracting CSS
    const styleElements = Array.from(doc.querySelectorAll('style'));

    // Remove the first element (agregore theme CSS)
    styleElements.shift();

    // Now combine the CSS from the remaining <style> elements
    let cssContent = styleElements.map(style => style.innerHTML).join('');

    // Extracting JavaScript
    const jsContent = doc.querySelector('script') ? doc.querySelector('script').innerHTML : '';

    // Remove script and style tags from the HTML content
    doc.querySelectorAll('script, style').forEach(el => el.remove());
    const htmlContent = doc.body.innerHTML; // Get the content inside the body tag without script/style tags

    // Displaying the content in respective textareas
    $('#htmlCode').value = htmlContent;
    $('#cssCode').value = cssContent;
    $('#javascriptCode').value = jsContent;
    update(0);
}
```

#### New Functionalities in `dweb.js`
The script includes functions for assembling code, uploading to the DWeb, and fetching from the DWeb. Here's an overview of the new functionalities:

#### Assembling Code for Uploading
```javascript
export async function assembleCode() {
    // Implementation to assemble and upload the code
}
```
- `assembleCode`: Prepares the HTML, CSS, and JavaScript code written in the editor into a single HTML file format. This combined code is then converted into a Blob for uploading.
- The function shows a loading spinner while the process is ongoing, improving user experience.

#### Fetching code from the DWeb
This function is responsible for fetching data from the decentralized web (DWeb) using either IPFS or Hypercore protocols. Here's how it works:
```javascript
async function fetchFromDWeb(cidOrName) {
    // Validation check for input
    // Determine the protocol based on the input format
    // Attempt to fetch data from the specified URL
}
```
- **Input Validation**: Checks if the `cidOrName` input is provided. If not, it alerts the user.  
- **URL Determination**: Determines whether the input string is an IPFS or Hypercore URL.  
- **Fetching Data**: Uses the `fetch` API to retrieve content from the specified DWeb URL.  
- **Error Handling**: Catches any errors during the fetch process and logs them to the console.

#### Parse and Display Data
You might have noticed a `parseAndDisplayData` in the previous function. Let's look at how this function parses and displays the fetched data from the DWeb in the respective text areas of the code editor.

```javascript
function parseAndDisplayData(data) {
    // 1. Parse the fetched HTML content
    // 2. Extract and combine CSS content
    // 3. Extract JavaScript content
    // 4. Clean up the HTML content
    // 5. Update the textareas with the fetched content
    // 6. Update the iframe for live rendering
}
```
- **Parsing HTML Content**: Utilizes DOMParser to parse the string of HTML data into a document object.  
- **Extracting CSS**: Retrieves all `<style>` elements, skips the first one (assuming it's the Agregore theme), and then combines the CSS from the remaining elements.  
- **Extracting JavaScript**: Finds the `<script>` element and extracts its content.  
- **Cleaning HTML**: Removes `<script>` and `<style>` tags from the HTML content to isolate the body content.  
- **Updating Text Areas**: The extracted HTML, CSS, and JavaScript contents are then placed in their respective text areas in the editor.  
- **Live Preview Update**: Calls the update function to render the newly fetched content in the iframe.  

Together, these functions enable the code editor to interact with the DWeb, allowing users to fetch and display content dynamically within the editor environment.


### Step 5: Common Functions

The `common.js` file in our project plays a crucial role in enhancing code maintainability and reducing redundancy. It defines and exports a set of commonly used functionalities and DOM element references, which can be easily imported and used across different scripts in the application. Here’s a breakdown of its contents:

#### `$` Function
```javascript
export function $(query) {
    return document.querySelector(query);
}
```
- **Purpose**: Simplifies the process of selecting DOM elements. It's essentially a shorthand for document.querySelector, allowing you to select elements using CSS selectors more concisely.  
- **Usage**:  Can be used throughout the application to quickly access DOM elements without repeatedly writing `document.querySelector`.

#### DOM Element References
```javascript
export const uploadButton = $('#uploadButton');
export const protocolSelect = $('#protocolSelect');
export const loadingSpinner = $('#loadingSpinner');
export const backdrop = $('#backdrop');
export const iframe = $('#viewer');
export const fetchButton = $('#fetchButton');
export const fetchCidInput = $('#fetchCidInput');
```
- **Purpose**: Pre-selects and exports important elements of the application, such as buttons, input fields, and containers, which are frequently accessed in various scripts.
- **Benefits**: Enhances code readability and efficiency. By defining these selectors in one place, you avoid duplication and make it easier to manage element references. If an element's ID changes, you only need to update it in `common.js`, and the change will propagate throughout the application.

### Overall Impact
- **Code Reusability**: Functions and element references defined in `common.js` can be reused across different modules, promoting DRY (Don't Repeat Yourself) principles.
- **Maintainability**: Centralizing common functionality in one file makes the application easier to maintain and update. For example, if the structure of the HTML changes, updates to element selectors need to be made only in `common.js`.
- **Modularity**: By segregating common utilities and DOM references into a separate module, the codebase becomes more modular and organized. This separation of concerns leads to cleaner and more manageable code.

Including `common.js` in your application is a best practice in web development. It not only streamlines your code but also improves overall project structure, making it more maintainable and scalable in the long run.


### Testing the Application

- Open the Agregore browser and navigate to your project folder.
- Test the real-time editing feature by typing HTML, CSS, and JavaScript.
- Try uploading your code to IPFS or Hypercore and fetching it back.

### Conclusion

Congratulations! You've built a versatile code editor in your browser that interacts with the decentralized web. This project not only enhances your web development skills but also introduces you to the realm of DWeb technologies.

Feel free to expand upon this application by adding more features or refining the UI. Explore the possibilities with Agregore and the decentralized web!