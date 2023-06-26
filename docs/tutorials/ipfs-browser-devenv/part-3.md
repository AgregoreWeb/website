## Part 3

Starting out, we'll assume we lost the code from part [1 & 2](./part-1), let's quickly bootstrap. Open an [empty IPFS folder](ipfs://bafyaabakaieac/) in Agregore Browser and open the dev tools (Ctrl+Shift+I) and go to the console tab. Enter the following:

```js
async function updateSite(filename, content){
    let cid = window.location.hostname
    const resp = await fetch(`ipfs://${cid}/${filename}`, {method: 'put', body: content})
    const newLocation = resp.headers.get('location')
    window.location = new URL(newLocation).origin
}

async function openEditor(){
    let editorDiv = document.getElementById("editor")
    if (!editorDiv){
        editorDiv = document.createElement('div')
        editorDiv.id = 'editor'
    }
    editorDiv.innerHTML = `<form id="idForm" style="display: flex; flex-direction: column;">
        <label for="idFilenameInput">Filename</label>
        <input type="text" name="filename" id="idFilenameInput"></input>
        <label for="idContentInput">Content</label>
        <textarea id="idContentInput" rows="20"></textarea>
        <input type="submit" value="Save"></input>
    </form>`
    document.body.appendChild(editorDiv)
    const form = document.getElementById('idForm')
    form.onsubmit = e => {
        e.preventDefault()
        const filename = document.getElementById('idFilenameInput').value
        const content = document.getElementById('idContentInput').value
        updateSite(filename, content)
    }
}

async function loadFile(filename){
    const resp = await fetch(filename)
    const content = await resp.text()
    document.getElementById('idFilenameInput').value = filename
    document.getElementById('idContentInput').value = content
}

async function editFile(filename){
    openEditor()
    loadFile(filename)
}
```

Now open the editor `editFile('lib.js')` and copy-and-past the code above. You might see an error about the file not existing ('lib.js', we'll fix that later), but thins should work. Once you hit save, you should now see a directory listing.

To get the basic HTML document back, load `lib.js` and then edit `index.html`:

```js
let script = document.createElement('script')
script.src = 'lib.js'
document.head.appendChild(script)
setTimeout( () => editFile('index.html'), 1000)
```

Again you will see some error text in the text area. Replace that with the code below and save again.

```html
<html>
  <head><title>Page title</title></head>
  <body>
    <h1>Hello world</h1>
    <script src="lib.js"></script>
  </body>
</html>
```

We're back at the end of part II!

A typical website consist of more than one file, in our example we have 'index.html' and 'lib.js'. Lets add a sidebar that lists all the files on our site. We can get a list of list of all the files in a directory in IPFS by adding '?noResolve' to the path. Try it by adding '?noResolve' to the current ipfs URL in the address bar, you should see a list that includes '../', './index.html' and './lib.js'. These are all the files for our site!

Let's create a function to fetch the contents of a directory. Normally when we fetch an IPFS directory in the Agregore Browser, it checks to see if there is an index file present and if so, it returns that file. To disable that, we add the querystring `?noResolve` to the end of the directory URL

```js
async function listDir(path){
    const resp = await fetch(path + '?noResolve')
    const files = await resp.json()
    return files
}
```

We can test this function in the console by running, it should return the array `["index.html", "lib.js"]`.

```
await listDir(window.origin)
```

Now add the function './lib.js' using `editFile('lib.js')` in the dev console and adding the function body to the file.

We want to load this data into a sidebar, so we need to restructure the HTML for the editor a bit. We'll have to update the HTML we've assigned to the editor. Change the part

```js
editorDiv.innerHTML = `
    ...
`
```

to the following:

```js
editorDiv.innerHTML = `<div style="display: flex; flex-grow: 1; padding: 1em">
    <div id="idSidebar" style="padding-right: 1em;"><h2>Files</h2>
    </div>
    <form id="idForm" style="flex-grow: 1; display: flex; flex-direction: column;">
        <label for="idFilenameInput">Filename</label>
        <input type="text" name="filename" id="idFilenameInput"></input>
        <label for="idContentInput">Content</label>
        <textarea id="idContentInput" style="flex-grow: 1;" rows="20"></textarea>
        <input type="submit" value="Save"></input>
    </form>
</div>`
```

And add the logic to create a list with all the files and add it to the sidebar at the end of the 'showEditor' function:

```js
const sidebar = document.getElementById('idSidebar')
const files = await listDir(window.origin)
const list = document.createElement('ul')
list.style =  "list-style: none; padding-inline-start: 0;"
files.map( file => {
    let li = document.createElement('li')
    li.innerHTML = `<a href="#">${file}</a>`
    li.querySelector('a').onclick = e => loadFile(file)
    list.appendChild(li)
})
sidebar.appendChild(list)
```

Instead of typing in `editFile('lib.js')` or `editFile('index.html')` we can now simply use `openEditor()` and then select the file we want. This is easier, so it's safe to delete the `editFile()` function now. You can always use `loadFile()` to load a file once the editor is already open.

To add a new file, you can open the editor, write a new filename and it should be created when you save. You can play around a little, maybe update the HTML, add more pages, add another JavaScript file, create a stylesheet, etc. 

I've added a file called 'site.js' that opens the editor once the document is loaded.

```js
window.addEventListener("load", (event) => {
  showEditor()
});
```

And then I added the script to 'index.html'

```html
<script src="site.js"></script>
```

You might be asking what happens if we have nested directories, the short answer is that things will probably not work as expected. The current site doesn't have any directories, we can create one by opening 'lib.js' and changing the filename to 'dir/lib.js' before saving. Now you should see 'dir/' listed in the sidebar. If you open it, you'll see the array of files in `dir` rather than the files themselves.

To load directories, we need to update the part that loads the sidebar. Before we do that, let's move that code into a separate function:

```js
async function loadSidebar(){
    const sidebar = document.getElementById('idSidebar')
    const files = await listDir(window.origin)
    const list = document.createElement('ul')
    list.style =  "list-style: none; padding-inline-start: 0;"
    files.map( file => {
        let li = document.createElement('li')
        li.innerHTML = `<a href="#">${file}</a>`
        li.querySelector('a').onclick = e => loadFile(file)
        list.appendChild(li)
    })
    sidebar.appendChild(list)
}
```

And replace the code you added to the `showEditor()` function with a call to `loadSidebar()` like this

```js
await loadSidebar()
```

To make the sidebar work, we should check if a file is a directory and if it is, create an element for each file or repeat the process for any directories it contains. For now we will create a list that will look something like this:

> index.html
> dir/lib.js
> lib.js

So let's update the element creation logic in `loadSidebar()`. We'll extract the logic for creating an HTML element for each entry in a directory into a separate function. This function will return a list with a single element (a link that will open the file) if the directory entry is a file. If it is a directory, it will read the files in that directory call itself on each of those files/directories.

```js
async function loadSidebar(){
    const sidebar = document.getElementById('idSidebar')
    const files = await listDir(window.origin)
    const list = document.createElement('ul')
    list.style =  "list-style: none; padding-inline-start: 0;"

    async function makeFileListElements(path, file) {
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
}
```

Here is what the final 'lib.js' looks like:

```js
async function updateSite(filename, content){
    let cid = window.location.hostname
    const resp = await fetch(`ipfs://${cid}/${filename}`, {method: 'put', body: content})
    const newLocation = resp.headers.get('location')
    window.location = new URL(newLocation).origin
}

async function loadFile(filename){
    const resp = await fetch(filename)
    const content = await resp.text()
    document.getElementById('idFilenameInput').value = filename
    document.getElementById('idContentInput').value = content
}

async function listDir(path){
    const resp = await fetch(window.origin + '?noResolve')
    const files = await resp.json()
    return files
}

async function showEditor(){
    let editorDiv = document.getElementById("editor")
    if (!editorDiv){
        editorDiv = document.createElement('div')
        editorDiv.id = 'editor'
    }
    editorDiv.style = `display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgb(233 233 233 / 95%);
    `
    editorDiv.innerHTML = `<div style="display: flex; flex-grow: 1; padding: 1em">
        <div id="idSidebar" style="padding-right: 1em; min-width: 20vw;"><h2>Files</h2>
        </div>
        <form id="idForm" style="flex-grow: 1; display: flex; flex-direction: column;">
            <label for="idFilenameInput">Filename</label>
            <input type="text" name="filename" id="idFilenameInput"></input>
            <label for="idContentInput">Content</label>
            <textarea id="idContentInput" style="flex-grow: 1;" rows="20"></textarea>
            <input type="submit" value="Save"></input>
        </form>
    </div>`
    document.body.appendChild(editorDiv)
    const form = document.getElementById('idForm')
    form.onsubmit = e => {
        e.preventDefault()
        const filename = document.getElementById('idFilenameInput').value
        const content = document.getElementById('idContentInput').value
        updateSite(filename, content)
    }
    const sidebar = document.getElementById('idSidebar')
    const files = await listDir(window.origin)
    const list = document.createElement('ul')
    list.style =  "list-style: none; padding-inline-start: 0;"
    files.map( file => {
        let li = document.createElement('li')
        li.innerHTML = `<a href="#">${file}</a>`
        li.querySelector('a').onclick = e => loadFile(file)
        list.appendChild(li)
    })
    sidebar.appendChild(list)
}
```

Next up is [part 4](./part-4)
