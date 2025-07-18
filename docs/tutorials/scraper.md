# Tutorial - Scraper

This tutorial goes over how to create a simple "web scraper" app which pulls the HTML from a page and saves it as a page in a local hyperdrive.

You can follow along and create this app using the [DWeb Scratchpad](/apps/scratchpad.html).

## Pulling Data

The first thing we'll do is set up an HTML form to take URLs to scrape and an editable section to preview the page within.

```html
<form id="urlForm">
  <input autofocus type="url" name="url" placeholder="url to scrape">
  <input type="submit" value="Scrape">
</form>
<section id="previewBox"></section>
```

Next we'll use the [local AI to generate some code for us](hyper://agregore.mauve.moe/docs/examples/quickcode.html).

I used the following prompt to get some JS to do the trick:

> javascript get form "urlForm", get value of input with name "url"
> fetch the url and get the response as text
> pass it to DOMParser
> Take the body innerHTML and set the innerHTML of the element with id "previewBox"
> Use await instead of .then

Notice how I gave it some tips on specific APIs I wanted it to use and the IDs of the relevant elements.

```javascript
document.getElementById('urlForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = document.getElementById('urlForm').url.value;
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    document.getElementById('previewBox').innerHTML = doc.body.innerHTML;
  } catch (error) {
    console.error('Error fetching the URL:', error);
  }
});
```

Lets also add some CSS to the previewBox to make it more obvious where it starts and ends:

```css
#previewBox {
  border: 1px dashed var(--browser-theme-primary-highlight);
  margin: 1em 0em;
  padding: 0.5em;
}
```

Notice how we make use of the built in Browser Theme CSS vars so that users can customize the look and feel of the app along with the rest of the browser.

Once this is in, test it out with an example page like the [Agregore Home Page](hyper://agregore.mauve.moe/). You should be seeing the contents of the page with a bunch of busted iframes and images due to any relative URLs not working within the preview.

## Sanitization

Generally speaking it's unsafe to shove arbitrary HTMLinto your page and we should add a "sanitization" step to get rid of any stray scripts, as well as make any URLs absolute relative to the original page.

For that I prompted the local AI to make us a function using the following:

> javascript function called sanitizeElementTree which takes a document, an element and a rootURL.
> It should traverse an HTML element's tree and remove any iframes or script tags.
> It should go through all img,audio,video tags and change their src to be `new URL(src, rootURL).href` to make it absolute.
> It should go through all `a` tags and make the `href` absolute relative to the rootURL.
> It will also find any attributes that start with `on` (like onclick) and remove them from elements.

This gave me the following code:

```javascript
function sanitizeElementTree(doc, element, rootURL) {
  function isAbsolute(url) {
    return /^(http|https):\/\//i.test(url);
  }

  function makeAbsolute(url) {
    if (!url || isAbsolute(url)) return url;
    return new URL(url, rootURL).href;
  }

  function traverse(node) {
    if (node instanceof HTMLElement) {
      if (node.tagName === 'IFRAME' || node.tagName === 'SCRIPT') {
        node.remove();
      } else if (['IMG', 'AUDIO', 'VIDEO'].includes(node.tagName)) {
        const srcAttr = node.getAttribute('src');
        if (srcAttr) node.setAttribute('src', makeAbsolute(srcAttr));
      } else if (node.tagName === 'A' && node.hasAttribute('href')) {
        const hrefAttr = node.getAttribute('href');
        if (hrefAttr) node.setAttribute('href', makeAbsolute(hrefAttr));
      }
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        if (attr.name.startsWith('on')) {
          node.removeAttribute(attr.name);
          i--;
        }
      }
    }
    node.childNodes.forEach(traverse);
  }

  traverse(element);
}
```

With this we can take an extra step to sanitize the body of the page before setting the previewBox

```javascript
    const doc = parser.parseFromString(text, 'text/html');
    sanitizeElementTree(doc, doc.body, url)
    document.getElementById('previewBox').innerHTML = doc.body.innerHTML;
```

With this, images and links should work and we can be a bit less nervous about malicious javascript.

## Manual Tweaking

Since web pages can often have unnecessary cruft, we should give users a chance to manually clean stuff up before they commit to saving.

To do this we can add the `contenteditable` attribute on the `previewBox` which enables users to edit anything in the box's content and in particular delete it the way they would in traditional document editors.

```html
<section id="previewBox" contenteditable="true"></section>
```

Try deleting images or any sections that seem out of place.

## Folder structure

Now that we have the page content ready we should havce a way to save it.

Ideally we should have all the scraped sites in a single archive with an easy way to browse them.

In my case I decided to store them as `{root url}/{site hostname}/{path}.html`.

I asked the AI to help make a function that would convert the user's URL to this format.

```
Make a JS function called urlToFile which takes a `url` and a `rootURL` and converts it to the following format:

`{root url}/{hostname}/{path}.html`

Only add `.html` if the path doesn't already have it
```

It gave the following:

```javascript
function urlToFile(url, rootURL) {
  const parsedUrl = new URL(url);
  let path = parsedUrl.pathname;
  if (!path.endsWith('.html')) path += '.html';
  return `${rootURL}/${parsedUrl.hostname}${path}`;
}
```

## Root URL

In order to save this file we need to generate that root URL. Agregore supports different protocols to publish to, and the main ones that support changes over time are `hyper://` and `ipns://`.

We should give the user the option to choose which one they want to use. The scratchpad already does this so we can cannibalize some code from it:

```html
<form id="saveForm">
<label>
    Save Type
    <select name="saveType">
      <option value="hyper">hyper://</option>
      <option value="ipns">ipns://</option>
    </select>
  </label>
  <button title="Save">💾</button>
</form>
```

We can rip out the JS for creating the root drives, too, but change the folder.

```javascript
async function getDriveURL() {
  const name = "scraped_sites"
  const response = await fetch(`hyper://localhost/?key=${name}`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to generate Hyperdrive key: ${response.statusText}`);
  }
  return await response.text()
}

async function getIPNSURL() {
  const name = "scraped_sites"
  const response = await fetch(`ipns://localhost/?key=${name}`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to generate IPNS key: ${response.statusText}`);
  }
  await response.text()
  return response.headers.get('Location')
}
```

We can now write some code to tie this all together:

```javascript
saveForm.onsubmit = async (e) => {
  e.preventDefault()
  const publishURL = await saveScrape()
  window.open(publishURL)
}

async function saveScrape() {
  const body = previewBox.innerHTML
  const url = urlForm.url.value
  const saveType = saveForm.saveType.value

  const rootURL = saveType === 'hyper' ? await getDriveURL() : await getIPNSURL()
  const publishURL = urlToFile(url, rootURL)

  const response = await fetch(publishURL, {
    method: 'put',
    body
  })

  if(!response.ok) throw new Error(`Unable to publish: ${await response.text()}`)

  return publishURL
}
```

This will add a listener to the `saveForm` which publishes the scrape and opens it in a new window.

The function gets the url and scrape content and does a put to either the `hyper://` or `ipns://` archive.

## Page formatting

Having the raw HTML works but it's missing important bits like a title and description from the head, as well as meta tags to make it look nice on mobile phones.

We can take the template that the Scratchpad uses as a starting point:

```javascript
function genPage({
  title,
  description,
  html
}={}) {
return `<!DOCTYPE html>
<meta lang="en">
<meta charset="UTF-8">
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${description.trim()}">
<link rel="stylesheet" href="browser://theme/style.css">
${html}
`
}
```

Next we'll want to take the title and description out of the page when we scrape it.

I used this prompt to get the AI to make a function that can do that:

> Make a js function called `getDocumentMetadata` which takes a document reference and returns the title and description from the document head

Which gave me this:

```javascript
function getDocumentMetadata(doc) {
  const title = doc.querySelector('title').innerText;
  const description = doc.querySelector('meta[name="description"]').getAttribute('content');
  return { title, description };
}
```

We can then edit our initial scrape code to account for this:

```javascript
let scrapedTitle = ''
let scrapedDescription = ''

document.getElementById('urlForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = document.querySelector('input[name="url"]').value;

  try {
    const response = await fetch(url);
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const {title, description} = getDocumentMetadata(doc)
    scrapedTitle = title
    scrapedDescription = description
    sanitizeElementTree(doc, doc.body, url)
    document.getElementById('previewBox').innerHTML = doc.body.innerHTML;
  } catch (error) {
    console.error('Error fetching the URL:', error);
  }
});
```

And we can also adjust our publishing code to bring this all together:

```javascript
async function saveScrape() {
  const html = previewBox.innerHTML
  const body = genPage({
    title: scrapedTitle,
    description: scrapedDescription,
    html
  })
  const url = urlForm.url.value
  const saveType = saveForm.saveType.value

  const rootURL = saveType === 'hyper' ? await getDriveURL() : await getIPNSURL()
  const publishURL = urlToFile(url, rootURL)

  const response = await fetch(publishURL, {
    method: 'put',
    body
  })

  if(!response.ok) throw new Error(`Unable to publish: ${await response.text()}`)

  return publishURL
}
```

With this in place we have our app! You can see a deployed version of it [here](/docs/examples/scraper.html).

## Improvements

Here's some things you can try to do yourself as improvements:

- Use the `https+raw` transport to bypass CORS restrictions in HTTP based sites
- Make the sanitize code smarter to flatten the HTML tree and automatically remove unnecessary navigation elements / focus on content
- Let the users supply the rootURL from wherever they want archives to be saved
- Go through sublinks and automatically clone linked sites (user supplied depth)
- Inline images into the file using data URIs from canvases
