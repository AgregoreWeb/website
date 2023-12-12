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

### Uploading a File to Hyperdrive 📤

Once you have a Hyperdrive key, you can upload files using fetch. 

The latest hypercore-fetch API supports various data types for the request body, including `String`, `Blob`, `FormData`, or `ReadableStream`. In this guide, we focus on using FormData for uploading files, which is particularly useful for handling multiple files.

### Uploading Using FormData

When uploading files, FormData is an efficient way to bundle and send multiple files in a single request. Here's an updated example illustrating how to upload files using FormData:

```javascript
async function uploadFile(files) {
    
    const formData = new FormData();

    // Append each file to the FormData
    for (const file of files) {
        formData.append('file', file, file.name);
    }

    // Construct URL with hypercore key (see section above for key generating function)
    let url;
    const hyperdriveUrl = await generateHyperdriveKey(name);
    url = `${hyperdriveUrl}${name}`;


    // Perform the upload for each file
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            addError(files, await response.text());
        }

        addURL(response.url);
    } catch (error) {
        console.error(`Error uploading ${files}:`, error);
    }
}
```

This function demonstrates how to upload files using FormData, which simplifies the process of sending multiple files in a single HTTP request.

## Deleting Data 🗑️

The `hypercore-fetch` API allows for deleting files or entire directories within a hyperdrive. Note that these operations require the hyperdrive to be writable (`writable: true`).

### Deleting a Single File

To delete a specific file:

```javascript
fetch('hyper://KEY/example.txt', {method: 'DELETE'})
```

This sends a DELETE request to remove example.txt from the hyperdrive specified by KEY.

KEY can be a 52 character z32 encoded key or a domain parsed with DNSLink.

### Purging All Data in a Hyperdrive

To delete all contents of a hyperdrive:

```javascript
fetch('hyper://KEY/', {method: 'DELETE'})
```

A DELETE request to the root of the hyperdrive clears all its stored data.
    
If it's a writable drive, data will be fully cleared. Attempting to write again may lead to data corruption.

**Important**: Be cautious when using these delete operations as they cannot be undone and might lead to permanent data loss.


## Resources and Further Reading 📖

- [Hypercore Fetch GitHub Repository](https://github.com/RangerMauve/hypercore-fetch/blob/master/README.md)
- [Hypercore Protocol Documentation](https://docs.holepunch.to/)
- [Hyper SDK GitHub Repository](https://github.com/RangerMauve/hyper-sdk)
- [Making stuff with Dat-SDK](https://www.youtube.com/watch?v=HyHk4aImd_I&list=PL7sG5SCUNyeYx8wnfMOUpsh7rM_g0w_cu&index=21)

---

[Back](/)
