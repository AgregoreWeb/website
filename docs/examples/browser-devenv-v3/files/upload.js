async function batchUpload(fileList, pathPrefix){
    let currentCid = window.origin
    let files = Array.from(fileList)
    while (files.length > 0){
        let batch = [files.pop()]
        let batchPath = batch[0].webkitRelativePath.split('/').slice(0,-1).join('/')
        console.log('Looking for files with matching path', batchPath)
        for (var i=files.length-1; i>=0; i--){
            if(batchPath == files[i].webkitRelativePath.split('/').slice(0,-1).join('/')){
                batch.push(files[i])
                files[i] = files[files.length-1] // copy last element over matched file
                files.pop() // remove last element
            }
        }

        console.log(batch)
        let formData = new FormData()
        for (const file of batch){
           formData.append('file', file) 
        }
        let putUrl = [currentCid, pathPrefix].join('/')
        const resp = await fetch(putUrl, {method: 'put', body: formData})
        currentCid = new URL(resp.headers.get('location')).origin
        console.log(currentCid + (pathPrefix && '/') + pathPrefix)
        console.log(`Uploaded ${fileList.length-files.length}/${fileList.length} files`)
    }
    return currentCid
}

class DirectoryUpload extends HTMLElement {
    constructor () {
        super()
    }

    connectedCallback () {
        this.innerHTML = `<form id="dirForm">
            <h2>Choose files to upload</h2>
            <label for="idPathPrefixInput">Path prefix</label>
            <input id="idPathPrefixInput" type="text" name="pathPrefix" />
            <label for="idFileInput">Files</label>
            <div class="fileInputWrapper">
              <input id="idFileInput" type="file" name="dir" webkitdirectory />
            </div>
            <button type="submit">Upload files</button>
        </form>
        <style>
            #dirForm {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            input[type=file]::file-selector-button {
                border: none;
                padding: .2em .4em;
            }
            .fileInputWrapper {
                border: 1px solid black;
                border-radius: 3px;
            }
        </style>`
        const form = this.querySelector('#dirForm')
        form.addEventListener('submit', this.onSubmit.bind(this))
    }

    async onSubmit(e) {
        console.log('📥 📥 📥')
        e.preventDefault()

        let currentCid = window.origin

        // get the prefix and clean it up a bit
        let pathPrefix = document.querySelector('#idPathPrefixInput').value
        while (pathPrefix.startsWith('/')){
            pathPrefix = pathPrefix.slice(1)
        }
        while (pathPrefix.endsWith('/')){
            pathPrefix = pathPrefix.slice(0, -1)
        }
    
        const fileInput = document.querySelector('#dirForm input[type="file"]')
        this.dispatchEvent(new CustomEvent('dirUploadStart', { detail: { fileCount: fileInput.files.length } }))
        const newCid = await batchUpload(fileInput.files, pathPrefix)
        this.dispatchEvent(new CustomEvent('dirUpload', { detail: { cid: newCid } }))
    }
}

customElements.define('directory-upload', DirectoryUpload);
