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