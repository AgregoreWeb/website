function $(query) {
    return document.querySelector(query)
}

const uploadButton = $('#uploadButton');
const protocolSelect = $('#protocolSelect');
const loadingSpinner = $('#loadingSpinner');
const backdrop = $('#backdrop');
const iframe = $('#viewer');
const fetchButton = $('#fetchButton');
const fetchCidInput = $('#fetchCidInput');

function handleKeyDown(event) {
    if (event.keyCode === 9) {  // Tab key
        event.preventDefault();
        var v = this.value;
        var s = this.selectionStart;
        var e = this.selectionEnd;
        this.value = v.substring(0, s) + '\t' + v.substring(e);
        this.selectionStart = this.selectionEnd = s + 1;
        return false;
    }
    if (event.keyCode === 8) {  // Backspace key
        update(1);
    }
}

let basicCSS = `
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

uploadButton.addEventListener('click', assembleCode);


var j=0;

//Function for live Rendering
function update(i) {
    if(i==0){
    let htmlCode = $('#htmlCode').value;
    let cssCode = $('#cssCode').value;
    let javascriptCode = $('#javascriptCode').value;
    // Always include the basic CSS for the body
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

    else if(i==1){

        let htmlCode=document.getElementById("htmlCode").value;
        let html=htmlCode.slice(0,htmlCode.length);
        document.getElementById("htmlCode").value=html;
        j=1;

    }
}

function showSpinner(show) {
    backdrop.style.display = show ? 'block' : 'none';
    loadingSpinner.style.display = show ? 'block' : 'none';
}

async function assembleCode() {
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
    uploadListBox.innerHTML += `<li><a href="${url}">${url}</a></li>`
}

function addError(name, text) {
    uploadListBox.innerHTML += `<li class="log">Error in ${name}: ${text}</li>`
}

fetchButton.addEventListener('click', async () => {
    const cidOrName = fetchCidInput.value;
    if (!cidOrName) {
        alert("Please enter a CID or Name.");
        return;
    }

    let url;
    const protocol = protocolSelect.value;

    if (protocol === 'ipfs') {
        url = `ipfs://${cidOrName}`;
    } else if (protocol === 'hyper') {
        url = `hyper://${cidOrName}`;
    } else {
        alert("Invalid protocol selected.");
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.text();

        // Parse and display the data in your editor
        parseAndDisplayData(data);
    } catch (error) {
        console.error("Error fetching from IPFS:", error);
        alert("Failed to fetch from IPFS.");
    }
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

document.addEventListener('DOMContentLoaded', (event) => {
    update(0);
});