# 🌐 Hypercore Fetch API 🌐

A powerful implementation of the Fetch API utilizing the Hyper SDK for peer-to-peer (p2p) content loading in Agregore browser.

## Introduction 👋

### What is the Hypercore Fetch API?

The Hypercore Fetch API is a JavaScript interface that extends the familiar Fetch API for use with the Hypercore Protocol. It allows seamless interaction with p2p content, leveraging the capabilities of the Hyper SDK.

### Why Use Hypercore Fetch API? 🤔

This API simplifies the process of loading and managing p2p content, making it an essential tool for developers working with decentralized data structures.



## Using Fetch with Hypercore 🌐

The Hypercore Fetch API allows you to interact with hyperdrives and hypercores using familiar HTTP-like methods. Here are some of the key operations you can perform:

### Loading Data 📨

Here's how you can request a file from a Hyperdrive using its unique key:

```javascript
await fetch('hyper://KEY/example.txt')
```

This will return the content of `example.txt` from the specified hyperdrive.

## Generating Keys and Uploading Files

### Generating a Hyperdrive Key

Before uploading files to a Hyperdrive, a unique key is required. Here's how to generate one:

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

### Uploading a File to Hyperdrive

Once you have a Hyperdrive key, you can upload files using fetch. Here's an example function to upload a file:

```javascript
async function uploadFile(file) {
    const name = file.name;
    const buffer = await file.arrayBuffer();
    const protocol = protocolSelect.value; // Assume this is defined elsewhere

    // Create a Blob from the ArrayBuffer
    let mimeType = file.type || 'application/octet-stream'; // Use MIME type from File, default to octet-stream
    const blob = new Blob([buffer], { type: mimeType });

    // Headers
    const headers = { 'Content-Type': mimeType };

    // Construct URL with hypercore key (see section above for key generating function)
    let url;
    if (protocol === 'hyper') {
        const hyperdriveUrl = await generateHyperdriveKey(name);
        url = `${hyperdriveUrl}${name}`;
    }

    console.log('Uploading', { name, protocol, headers });

    // Perform the PUT request
    const response = await fetch(url, {
        method: 'PUT',
        body: blob,
        headers 
    });

    if (!response.ok) throw new Error(`Upload failed: ${await response.text()}`);
    const uploadedUrl = response.url; // URL of the uploaded file
    console.log('File uploaded:', uploadedUrl);
}
```

### Example Usage

To use these functions in your Agregore browser application, you can call `uploadFile` with a file object:

```javascript
// Example file upload
const fileInput = document.querySelector('#fileInput'); // Assume file input is in your HTML
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        uploadFile(file).then(() => {
            console.log('File uploaded successfully.');
        }).catch(error => {
            console.error('Error uploading file:', error);
        });
    }
});
```

## Resources and Further Reading 📖

- [Hypercore Fetch GitHub Repository](https://github.com/RangerMauve/hypercore-fetch/blob/master/README.md)
- [Hypercore Protocol Documentation](https://docs.holepunch.to/)
- [Hyper SDK GitHub Repository](https://github.com/RangerMauve/hyper-sdk)
- [Making stuff with Dat-SDK](https://www.youtube.com/watch?v=HyHk4aImd_I&list=PL7sG5SCUNyeYx8wnfMOUpsh7rM_g0w_cu&index=21)

---

[Back](/)