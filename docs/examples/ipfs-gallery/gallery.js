function layout(){
    const gallery = document.querySelector('.gallery')
    for (const row of gallery.querySelectorAll('.row')){
        let images = Array.from(row.querySelectorAll('img'))
        if (images.length > 0)
        {
            const ratioHeight = images[0].naturalHeight
            let ratioWidth = images[0].naturalWidth
            images.shift()
            while (images.length > 0){
                let image = images.shift()
                ratioWidth += image.naturalWidth*ratioHeight/image.naturalHeight
            }
            console.log(`aspect-ratio: ${ratioWidth}/${ratioHeight};`)
            row.style = `aspect-ratio: ${ratioWidth}/${ratioHeight};`
        }
    }
}

async function addFileToGallery(file){
    window.newImages = window.newImages || []
    window.newImages.push(file)
    const columns = 3
    
    // Show save form
    document.getElementById("idSaveGalleryForm").classList.remove('hidden')
    
    // Create markup                                                                                  
    const img = document.createElement("img")                                                         
    img.classList.add('new')
    img.dataset.fileName = file.name                                                                  
    img.src = URL.createObjectURL(file);                                                              
    let imgDiv = document.createElement('div')                                                        
    imgDiv.appendChild(img)
    
    // Get dimensions                                                                                 
    const image = await createImageBitmap(file)                                                       
    img.width = image.width
    img.height = image.height                                                                         
    
    // Add event listener for lightbox                                                                
    img.addEventListener('click', e => {                                                              
        document.querySelector('.lightBox img').src = img.src                                         
        document.querySelector('.lightBox').classList.remove('hidden')                                
    })
    
    // Remove stock images
    const gallery = document.querySelector('.gallery')                                                
    if (gallery.querySelectorAll('.row.stock').length > 0){
        for (const stockRow of gallery.querySelectorAll('.row.stock')){
            gallery.removeChild(stockRow)
        }
        const div = document.createElement('div')
        div.classList.add('row')
        gallery.appendChild(div)
    }
    
    // Find the right place to add the image
    if (gallery.querySelectorAll('.row:last-child img').length < columns){                            
        gallery.querySelector('.row:last-child').appendChild(imgDiv)
    } else {
        const div = document.createElement('div')                                                     
        div.classList.add('row')
        div.appendChild(imgDiv)
        gallery.appendChild(div)                                                                      
    }   
    
    // Call layout to recalculate the aspect ratios                                                   
    setTimeout(layout, 500)
}

async function saveGallery(e){
    e.preventDefault()
    // Hide save form and link before saving updated markup
    document.getElementById("idSaveGalleryForm").classList.add('hidden')
    document.getElementById("idGalleryUrl").classList.add('hidden')
    
    let formData = new FormData()

    // Add new images to formData
    for (const image of window.newImages){
        formData.append('file', image)
    }
    
    // Get the original HTML
    const index = await fetch('index.html')
    const txt = await index.text()
    const parser = new DOMParser()
    let newDoc = parser.parseFromString(txt, 'text/html')
    
    // Replace the gallery with the updated markup
    newDoc.querySelector('.gallery').replaceWith(document.querySelector('.gallery').cloneNode(true))
    for (const imgEl of newDoc.querySelectorAll('.gallery img.new')){
        imgEl.src = imgEl.dataset.fileName
        delete imgEl.dataset.fileName
        imgEl.classList.remove('new')
    }

    if (!window.origin.startsWith('ipfs://')){
        newDoc.querySelector('.gallery .helpOverlay').remove()
    }
    formData.append('file', new File([newDoc.documentElement.innerHTML], 'index.html'))

    let postUrl = window.origin
    if (!window.origin.startsWith('ipfs://')){
        postUrl = 'ipfs://bafyaabakaieac/'
    }
    
    // Post the new data to save the images and the gallery 
    const resp = await fetch(postUrl, {method: 'put', body: formData})
    newCid = new URL(resp.headers.get('location')).origin
    console.log(`Uploaded ${newImages.length} files to ${newCid}`)
    
    // Set URL for saved gallery and show link element
    document.querySelector("#idGalleryUrl a").href = newCid
    document.querySelector("#idGalleryUrl").classList.remove('hidden')
}


function dropListener(e){
    e.preventDefault()
    const { dataTransfer } = e
    if(!dataTransfer) return
    const files = Array.from(dataTransfer.files)
    console.log(files)
    for (const file of files){
        if (file.type.match(/image.*/)) {
            addFileToGallery(file).catch(console.log)
        }
    }
}

async function handleHelpClick(e){
    e.stopPropagation()
    const opts = {
        types: [
            {
                description: "Images",
                accept: {
                    "image/*": [".png", ".gif", ".jpeg", ".jpg"],
                },
            },
        ],
        excludeAcceptAllOption: true,
        multiple: true,
        startIn: "pictures",
    }
    let result = await showOpenFilePicker(opts)
    for (const fileHandle of result){
        let file = await fileHandle.getFile()
        await addFileToGallery(file)
    }
    document.querySelector('.helpOverlay').classList.add('small')
}

async function downloadStock(){
    // Initialize the newImages array
    window.newImages = window.newImages || []

    // Get all the stock images
    const imageNodes = document.querySelectorAll('.gallery .row.stock img')
    for (let i = 0; i < imageNodes.length; ++i){
        let img = imageNodes.item(i)
        // Download the image and update the src
        let response = await fetch(img.src)
        window.newImages.push(new File([await response.blob()], `/stock/image-${i}.jpg`))
        img.src = `/stock/image-${i}.jpg`
    }

    // Utilize saveGallery to upload the files and updated markup for us
    await saveGallery({preventDefault: () => true})
    console.log('Navigate to ', document.querySelector("#idGalleryUrl a").href)
}

window.addEventListener('load', e => {
    layout()
    
    for (const img of document.querySelectorAll('.gallery .row img')){
        img.addEventListener('click', e => {
            document.querySelector('.lightBox img').src = img.src
            document.querySelector('.lightBox').classList.remove('hidden')
        })
    }
    
    document.querySelector('.lightBox img').addEventListener('click', e => 
        document.querySelector('.lightBox').classList.add('hidden')
    )
    
    document.querySelector(".gallery").addEventListener("dragover", e => e.preventDefault())
    document.querySelector(".gallery").addEventListener("drop", dropListener)
    
    document.querySelector(".helpOverlay").addEventListener('click', e => {
        document.querySelector('.helpOverlay').classList.add('small')
    })
    document.querySelector(".helpOverlay button").addEventListener("click", handleHelpClick)
    document.getElementById("idSaveGalleryForm").addEventListener("submit", saveGallery)
})
