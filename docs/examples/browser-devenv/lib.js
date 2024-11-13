const EMPTY_IPFS_URL = 'ipfs://bafyaabakaieac/'

async function addFiles(files){
    const formData = new FormData()
    files.forEach( (file, index) => {
       formData.append('file', file) 
    })
    const resp = await fetch(EMPTY_IPFS_URL, {method: 'put', body: formData})
    const newLocation = resp.headers.get('location')
    window.location = new URL(newLocation).origin
}

async function bootstrapSite(){
  let resp = await fetch('lib.js.template')
  const libjs = await resp.text()
  resp = await fetch('index.html.template')
  const indexhtml = await resp.text()

  addFiles([
    new File([indexhtml], 'index.html', {type: 'text/html'}),
    new File([libjs], 'lib.js', {type: 'text/javascript'}),
  ])
}
