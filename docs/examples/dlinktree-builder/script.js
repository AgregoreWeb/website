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