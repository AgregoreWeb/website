async function updateSite(filename, content){
    const resp = await fetch(`${window.origin}/${filename}`, {method: 'put', body: content})
    const newLocation = resp.headers.get('location')
    window.location = new URL(newLocation).origin
}

async function publishSite(){
    let resp = await fetch('ipns://localhost/?key=mysite', {method: 'POST'})
    const key = resp.headers.get('location')
    resp = await fetch(key, {method: 'POST', body: window.origin})
    window.location = new URL(resp.headers.get('location')).origin
}

async function loadFile(filename){
    const resp = await fetch(filename)
    const content = await resp.text()
    document.getElementById('idFilenameInput').value = filename
    window.editor.setValue(content)                                          
    if (filename.match(/\.js/)){                                             
        editor.session.setMode("ace/mode/javascript")                        
    } else if (filename.match(/\.html/)){                                    
        editor.session.setMode("ace/mode/html")                              
    } else if (filename.match(/\.css/)){                                     
        editor.session.setMode("ace/mode/css")                               
    } else {                                                                
        editor.session.setMode("ace/mode/text")                              
    }                                                                        

}

async function listDir(path){
    const resp = await fetch(path + '?noResolve')
    const files = await resp.json()
    return files
}

async function loadSidebar(){
    const sidebar = document.querySelector('.sideBar')
    const files = await listDir(window.origin)
    const list = document.createElement('ul')
    list.style =  "list-style: none; padding-inline-start: 0;"

    async function makeFileListElements(path, file) {
        if (path == '/' && file == 'vendor/') {                              
            let li = document.createElement('li')                            
            li.innerHTML = `<a href="/vendor/">/vendor/</a>`                 
            return [li]                                                      
        }                                                                    
        if (file.endsWith('/')){
            let subfiles = await listDir(window.origin + path + file)
            let elements = await Promise.all(
                subfiles.map(subfile => 
                    makeFileListElements(path + file, subfile)
                )
            )
            return elements.reduce( (arr, el) => [...arr, ...el] )
        }
        let li = document.createElement('li')
        li.innerHTML = `<a href="#">${path}${file}</a>`
        li.querySelector('a').onclick = e => loadFile(path + file)
        return [li]
    }

    await Promise.all(
        files.map(async file => {
            let elements = await makeFileListElements('/', file)
            elements.map(li => list.appendChild(li))
        })
    )

    sidebar.appendChild(list)
    
    if (window.origin.startsWith('ipfs://')){
        const button = document.createElement('button')
        button.innerHTML = 'Publish site'
        button.onclick = e => {
            e.preventDefault()
            publishSite()
        }
        sidebar.appendChild(button)
    }

    let dirUploadForm = document.createElement('directory-upload')

    dirUploadForm.addEventListener('dirUploadStart', e => {
        console.log('onDirUploadStart', e.detail)
        const modal = document.createElement('dialog')
        modal.id = 'uploadStatus'
        modal.innerHTML = `<p>Uploading ${e.detail.fileCount} file(s)</p>`
        document.body.appendChild(modal)
        modal.showModal()
    })

    dirUploadForm.addEventListener('dirUpload', e => {
        console.log('onDirUpload', e)
        let modal = document.getElementById('uploadStatus')
        modal.innerHTML = `<p>Upload complete. You will be redirected shortly</p>`
        setTimeout(te => window.location = e.detail.cid, 5000)
    })

    sidebar.appendChild(dirUploadForm)
}

async function showEditor(){
    
    // Add style
    let styleLink = document.createElement('link')
    styleLink.href = 'style.css'
    styleLink.rel = 'stylesheet'
    document.head.appendChild(styleLink)
    
    let aceCss = document.createElement('link')
    aceCss.href="/vendor/ace-builds/css/ace.css"
    aceCss.rel="stylesheet"
    document.head.appendChild(aceCss)
    
    // Add JavaScript
    await import('./upload.js')
    await import('/vendor/ace-builds/src-min-noconflict/ace.js')
    ace.config.set('basePath', '/vendor/ace-builds/src-min-noconflict/')
    
    let editorDiv = document.getElementById("editor")
    if (!editorDiv){
        editorDiv = document.createElement('div')
        editorDiv.id = 'editor'
        editorDiv.classList.add('siteEditor')
    }

    editorDiv.innerHTML = `<div>
        <div class="sideBar">
            <h2>Files</h2>
        </div>
        <form id="idForm" spellcheck="false">
            <label for="idFilenameInput">Filename</label>
            <input type="text" name="filename" id="idFilenameInput" />
            <label for="idContentInput">Content</label>
            <textarea id="idContentInput" style="flex-grow: 1;" rows="20"></textarea>
            <input type="submit" value="Save" />
        </form>
    </div>`
    document.body.appendChild(editorDiv)

    window.editor = ace.edit("idContentInput")                               

    const form = document.getElementById('idForm')
    form.onsubmit = e => {
        e.preventDefault()
        const filename = document.getElementById('idFilenameInput').value
        const content = window.editor.getValue()
        updateSite(filename, content)
    }

    await loadSidebar()
}

window.addEventListener('load', e => {
    window.showEditor = showEditor
    document.addEventListener('keydown', e => {
        if( e.ctrlKey && e.key == 'i' ){
            showEditor().catch(console.error)
        }
    })
})

