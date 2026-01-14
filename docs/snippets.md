# Useful Code Snippets

Here are some useful code snippets for building P2P Web Apps with Agregore. These are bitse of HTML, CSS, and JavaScript you can copy into your project using something like the [DWeb Scratchpad](/apps/scratchpad.html)

## HTML

```html
<form id="saveForm">
    <label>
        Save Type
        <select name="saveType">
            <option value="hyper">hyper://</option>
            <option value="ipfs">ipfs://</option>
            <option value="ipns">ipns://</option>
        </select>
    </label>
    <label>
        Site Name
        <input name="siteName" value="default">
    </label>
    <label>
        File Path
        <input name="fileName" value="example.html">
    </label>
    <button>Create</button>
</form>
```

Combine this with this JS snippet to get the values out:

```JavaScript
saveForm.onsubmit = (e) => {
  e.preventDefault()
  const formData = new FormData(saveForm)
  const filename = formData.get('fileName')
  const saveType = formData.get('saveType')
  const siteName = formData.get('siteName')
}
```

## JavaScript

### Get Hyper URL from site name

```JavaScript
async function getHyperURL(siteName) {
  const response = await fetch(`hyper://localhost/?key=${siteName}`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to generate Hyperdrive key: ${await response.text()}`);
  }
  return await response.text()
}
```

### Get IPNS URL from site name

```JavaScript
async function getIPNSURL(siteName) {
  const response = await fetch(`ipns://localhost/?key=${siteName}`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to generate IPNS key: ${await response.text()}`);
  }
  await response.text()
  return response.headers.get('Location')
}
```

### IPFS empty folder URL

```JavaScript
const IPFS_EMPTY_FOLDER = 'ipfs://bafyaabakaieac/'
```

## CSS

### Import browser style

This lets you import the user controlled styles into your app.

```css
@import url("browser://theme/style.css")
```

### Import browser CSS

This lets you import just the CSS variables from the [theme](./theming).

```css
@import url("browser://theme/style.css")
```