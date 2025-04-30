function $(query) {
    return document.querySelector(query)
}

const uploadBox = $('#uploadBox')
uploadBox.ondragover = () => false
uploadBox.ondrop = async (e) => {
    e.preventDefault()
    const { dataTransfer } = e
    if(!dataTransfer) return

    await uploadFiles(dataTransfer.files);
}

const uploadListBox = $('#uploadListBox')

const protocolSelect = $('#protocolSelect')

async function uploadFiles(files) {
    const protocol = protocolSelect.value;

    if (protocol === 'hyper') {
        const hyperdriveUrl = await generateHyperdriveKey('drag-and-drop');
        console.log(`Hyper base URL: ${hyperdriveUrl}`);

        for (const file of files) {
            const url = `${hyperdriveUrl}${encodeURIComponent(file.name)}`;
            console.log(`Uploading ${file.name} to ${url}`);

            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    body: file, // Send raw file bytes
                    headers: {
                        'Content-Type': file.type || 'application/octet-stream'
                    }
                });

                console.log(`Response for ${file.name}: ${response.status}, ok: ${response.ok}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error uploading ${file.name}: ${errorText}`);
                    addError(file.name, errorText);
                    continue;
                }

                addURL(url);
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                addError(file.name, error.message);
            }
        }
    } else {
        // Keep IPFS as FormData
        const formData = new FormData();
        for (const file of files) {
            console.log(`Appending file for IPFS: ${file.name}`);
            formData.append('file', file, file.name);
        }
        const url = `ipfs://bafyaabakaieac/`;
        console.log(`Sending to IPFS: ${url}`);

        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: formData,
            });
            console.log(`IPFS Response: ${response.status}`);
            if (!response.ok) {
                addError(files[0].name, await response.text());
                return;
            }
            const locationHeader = response.headers.get('Location');
            addURL(locationHeader);
        } catch (error) {
            console.error(`Error uploading to IPFS:`, error);
            addError(files[0].name, error.message);
        }
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
