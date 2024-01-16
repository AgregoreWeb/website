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
    
    // Include the svg icon for copying the URL to clipboard
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

// The fetchFromDWeb function detects which protocol is used and fetches the content
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

// Modified event listener for fetchButton
fetchButton.addEventListener('click', () => {
    const cidOrName = fetchCidInput.value;
    fetchFromDWeb(cidOrName);
});

// Parse the data and display it in the code editor
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