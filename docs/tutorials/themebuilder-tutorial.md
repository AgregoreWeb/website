# Theme Builder Tutorial


## The Idea ✨

Jesse is using the Agregore theme (found [here](agregore://theme/style.css) or [here](https://agregore.mauve.moe/docs/theming)) to keep their apps looking cohesive. They want to change up the theme, so they navigate to ipns://themebuild.er to play around with the colours until they find something they like.

### Preamble

This tutorial assumes a very basic level of web development experience as well as a small familiarity with p2p web protocols or IPFS. Maybe you've made a handful of single page web apps and have heard about the distributed web before but haven't really played around with it.

## Getting Started 🏁

To keep things simple for this tutorial I'm just going to use an online code playground (I used [JSFiddle](https://jsfiddle.net/) specifically) as our dev environment. Of course, you're free to use whatever you want, but that's the context that surround this tutorial.

We will use Agregore's built in [IPFS Fetch API](https://agregore.mauve.moe/docs/ipfs-protocol-handlers) to publish our site on IPFS. At the time of writing the latest version for Agregore can be found [here](https://github.com/AgregoreWeb/agregore-browser/releases/tag/v1.10.1).

## Developing Our App 👩‍💻

So, let's start making our app, our basic endgoal here is to have some colour pickers to choose the theme colours, an "example page" to reflect the colour changes, and a way for the user to "save" those changes.

### Set Up

First let's set up our file, if you navigate to agregore://theme/style.css we're just going to copy paste this whole thing into the css.

Once you've done that, delete the second line (the `@import url("agregore://theme/vars.css")`) and replace it with the following:

```css

:root {
  --ag-theme-font-family: system-ui;
  --ag-theme-background: #111;
  --ag-theme-text: #F2F2F2;
  --ag-theme-primary: #6e2de5;
  --ag-theme-secondary: #2de56e;
  --ag-theme-indent: 16px;
  --ag-theme-max-width: 666px;
}
```

If you took a peek at agregore://theme/vars.css you might notice that this looks very similar because it's essentially that file. The reason we're doing things this was is because we're gonna want to be able to mess with the CSS file and edit it freely.

After we've done that we're going to want to have some content for the CSS to style. For that I decided to use The tutorial up to this point!

And with that, we're done set up. You should have a CSS file that looks like this:

```css
@charset "utf-8";

:root {
  --ag-theme-font-family: system-ui;
  --ag-theme-background: #111;
  --ag-theme-text: #F2F2F2;
  --ag-theme-primary: #6e2de5;
  --ag-theme-secondary: #2de56e;
  --ag-theme-indent: 16px;
  --ag-theme-max-width: 666px;
}
  

* {
  box-sizing: border-box;
}

html, body, input, button, textarea {
  background: var(--ag-theme-background);
  color: var(--ag-theme-text);
  font-family: var(--ag-theme-font-family);
  font-size: inherit;
}

input, button, textarea {
  border: 1px solid var(--ag-theme-primary);
}

body {
  padding: 1em;
  max-width: var(--ag-theme-max-width);
  margin: 0 auto;
}

a {
  color: var(--ag-theme-secondary);
  text-decoration: underline;
  text-decoration-color: var(--ag-theme-primary);
}

a:visited {
    color: var(--ag-theme-primary);
}

img, video, svg, object {
  width: 80%;
  display: block;
  margin: 1em auto;
}

iframe {
  display: block;
  margin: 1em auto;
}

code {
  background: var(--ag-theme-primary);
  font-weight: bold;
  padding: 0.25em;
}

pre > code {
  display: block;
  padding: 0.5em;
}

br {
  display: none;
}

li {
  list-style-type: " ⟐ ";
}

hr {
  border-color: var(--ag-theme-primary);
}

*:focus {
  outline: 2px solid var(--ag-theme-secondary);
}

h1 {
  text-align: center;
}

/* Reset style for anchors added to headers */
h2 a, h3 a, h4 a {
  color: var(--ag-theme-text);
  text-decoration: none;
}

h1 a {
  color: var(--ag-theme-primary);
  text-decoration: none;
}

h1:hover::after, h2:hover::after, h3:hover::after, h4:hover::after {
  text-decoration: none !important;
}
h2::before {
  content: "## ";
  color: var(--ag-theme-secondary);
}
h3::before {
  content: "### ";
  color: var(--ag-theme-secondary);
}
h4::before {
  content: "#### ";
  color: var(--ag-theme-secondary);
}
```

And an HTML file that looks like this:

```html
<html>
    <body>
        <h1> Theme Builder</h1>
        <h2>The Idea ✨</h2>
        <p>Jesse is using the Agregore theme (found <a href="agregore://theme/style.css">here</a> or <a href="https://agregore.mauve.moe/docs/theming">here</a>) to keep their apps looking cohesive. They want to change up the theme, so they navigate to ipns://themebuild.er to play around with the colours until they find something they like.
        </p>
        <h3>Preamble</h3>
        <p>This tutorial assumes a very basic level of web development experience as well as a small familiarity with p2p web protocols or IPFS. Maybe you've made a handful of single page web apps and have heard about the distributed web before but haven't really played around with it.</p>
        <h2>Getting Started 🏁</h2>
        <p>To keep things simple for this tutorial I'm just going to use an online code playground (I used <a href="https://jsfiddle.net/">JSFiddle</a> specifically) as our dev environment. Of course, you're free to use whatever you want, but that's the context that surround this tutorial.</p>
        <p>We will use Agregore's built in <a href="https://agregore.mauve.moe/docs/ipfs-protocol-handlers">IPFS Fetch API</a> to publish our site on IPFS. At the time of writing the latest version for Agregore can be found <a href="https://github.com/AgregoreWeb/agregore-browser/releases/tag/v1.10.1">here</a>.</p>
        <h2>Developing Our App</h2>
        <p>So, let's start making our app, our basic endgoal here is to have some colour pickers to choose the theme colours, an "example page" to reflect the colour changes, and a way for the user to "save" those changes.</p>
        <p>
        First let's set up our file, if you navigate to <code>agregore://theme/style.css</code> we're just going to copy paste this whole thing into the css. 
        </p>
        <p>
        Once you've done that, delete the second line (the <code>@import url("agregore://theme/vars.css")</code>) and replace it with the following:
        </p>
        <pre>
        <code>:root {
          --ag-theme-font-family: system-ui;
          --ag-theme-background: #111;
          --ag-theme-text: #F2F2F2;
          --ag-theme-primary: #6e2de5;
          --ag-theme-secondary: #2de56e;
          --ag-theme-indent: 16px;
          --ag-theme-max-width: 666px;
        }</code>
        </pre>
        <p>
        If you took a peek at <code>agregore://theme/vars.css</code> you might notice that this looks very similar because it's essentially that file. The reason we're doing things this was is because we're gonna want to be able to mess with the CSS file and edit it freely. 
        </p>
        <p>
        After we've done that we're going to want to have some content for the CSS to style. For that I decided to use this tutorial up to this point!</p>
        </body>
</html>
```

### Changing Colours 🖌

The most essential part of a theme builder is the ability to change the colours of the page. To do that, we'll be using those CSS variables. For now, lets just switch some of the colours with each other to get the hang of things.

Let's make a function to do just that, in the JS file do the following:

```javascript
let root = document.documentElement;
function colorChange(){
    root.style.setProperty("--ag-theme-background","#F2F2F2");
    root.style.setProperty("--ag-theme-text","#111");
    root.style.setProperty("--ag-theme-primary","#2de56e");
    root.style.setProperty("--ag-theme-secondary","#2de56e");
}
```

I switched the background and text colours with each other and the primary and secondary colours, to see this change lets create a button that will call this function. I put my button at the top of our HTML file so it's easy to access but you can put it wherever you want.

Here's the javascript for the button: `<button onclick="colorChange()">Click Me!</button>`

### Colour Picking 🎨

Now that we know how to change our colours, let's make it easy for a  user to pick the colours themselves. Luckily for us the `<input>` element has can be used as a colour picker by assigning it `type = "color"` let's make four of these for each of the CSS variables that have colours assigned to them, and let's put some labels to keep things together.

```html
  <label for="backgroundCol">Background: </label><input type="color" id="backgroundCol" value="#111">
  <label for="textCol">Text: </label><input type="color" id="textCol" value="#F2F2F2">
  <label for="primaryCol">Primary: </label><input type="color" id="primaryCol" value="#6e2de5">
  <label for="secondaryCol">Secondary: </label><input type="color" id="secondaryCol" value="#2de56e">
```

I placed this before our button but feel free to place them wherever you feel is best. I've also made it so that the default colours are, well, the default colours of the theme.

### Changing Colours with colour picking 🖼

Ok now lets use the those colour pickers to change the theme colours. To do this we're going to need some event listeners on on them. All of them are going to look a bit like this:

```javascript
backgroundCol.addEventListener("input", function(event) {
    colorChange(event, "--ag-theme-background");
},false);
```

You could set the event type to "change" instead of "input" and it would work similarly. (Change would make it so the colour changes when the picker is dismissed, where input makes it so that it happens actively.) If you noticed I used our colorChange function inside of an anonymous function as the listener function. Let's edit that so it makes sense:

```javascript
function colorChange(event, colorVar) {
  root.style.setProperty(colorVar, event.target.value);
}
```

The anonymous function is there because I wanted to pass that second variable along with the event object.

Ok now that we've got that covered we can write out the event listeners for our other colour pickers:

```javascript
backgroundCol.addEventListener("change", function(event) {
	colorChange(event, "--ag-theme-background");
},false);
textCol.addEventListener("input",function(event) {
	colorChange(event, "--ag-theme-text");
},false);
primaryCol.addEventListener("change",function(event) {
	colorChange(event, "--ag-theme-primary");
},false);
secondaryCol.addEventListener("change",function(event) {
	colorChange(event, "--ag-theme-secondary");
},false);
```
With this the theme colours update when a user interacts with a colour picker, rendering our button obsolete, let's give it a new purpose.

### Saving and downloading to a file 💾

Lets make it so our user can download the CSS file so that they can upload it a reuse it! First we'll need a new variable `let rootStyle = getComputedStyle(document.body);` this makes it so we can get the styles in a read only format. And now we'll write a download function (remember to replace our colorChange call in the button with this guy!):

```javascript
function downloadTheme(){
const link = document.createElement("a");
  const content = `@charset "utf-8";

:root {
  --ag-theme-font-family: system-ui;
  --ag-theme-background: `+ rootStyle.getPropertyValue("--ag-theme-background") + `;
  --ag-theme-text: `+ rootStyle.getPropertyValue("--ag-theme-text") + `;
  --ag-theme-primary: ` + rootStyle.getPropertyValue("--ag-theme-primary") + `;
  --ag-theme-secondary: ` + rootStyle.getPropertyValue("--ag-theme-secondary") + `;
  --ag-theme-indent: 16px;
  --ag-theme-max-width: 666px;
}
  

* {
  box-sizing: border-box;
}

html, body, input, button, textarea {
  background: var(--ag-theme-background);
  color: var(--ag-theme-text);
  font-family: var(--ag-theme-font-family);
  font-size: inherit;
}

input, button, textarea {
  border: 1px solid var(--ag-theme-primary);
}

body {
  padding: 1em;
  max-width: var(--ag-theme-max-width);
  margin: 0 auto;
}

a {
  color: var(--ag-theme-secondary);
  text-decoration: underline;
  text-decoration-color: var(--ag-theme-primary);
}

a:visited {
  color: var(--ag-theme-primary);
}

img, video, svg, object {
  width: 80%;
  display: block;
  margin: 1em auto;
}

iframe {
  display: block;
  margin: 1em auto;
}

code {
  background: var(--ag-theme-primary);
  font-weight: bold;
  padding: 0.25em;
}

pre > code {
  display: block;
  padding: 0.5em;
}

br {
  display: none;
}

li {
  list-style-type: " ⟐ ";
}

hr {
  border-color: var(--ag-theme-primary);
}

*:focus {
  outline: 2px solid var(--ag-theme-secondary);
}

h1 {
  text-align: center;
}

/* Reset style for anchors added to headers */
h2 a, h3 a, h4 a {
  color: var(--ag-theme-text);
  text-decoration: none;
}

h1 a {
  color: var(--ag-theme-primary);
  text-decoration: none;
}

h1:hover::after, h2:hover::after, h3:hover::after, h4:hover::after {
  text-decoration: none !important;
}
h2::before {
  content: "## ";
  color: var(--ag-theme-secondary);
}
h3::before {
  content: "### ";
  color: var(--ag-theme-secondary);
}
h4::before {
  content: "#### ";
  color: var(--ag-theme-secondary);
}`;
  const file = new Blob([content],{type: "text/css"});
  console.log(content);
  link.href = URL.createObjectURL(file);
  link.download = "style.css";
  link.click();
  URL.revokeObjectURL(link.href);
}
```

My button HTML looks like this now: `<button onclick="downloadTheme()">Download</button>`

The stuff in the "content" variable is almost entirely the CSS file, the only difference being the custom colours in the root.

### Hosting on IPFS 🕸

Okay now we have our app mostly finished (save some finishing touches) lets put it up so that we can share it with people!

The simplest way to do this is by putting this whole thing into one html file (as opposed to having separate JS and CSS files that our html links to) and then uploading it using [this handy file upload](https://agregoreweb.github.io/agregore-drag-and-drop/)
though you'll need to open it up in Agregore to get it to work.

You should just be able to plop your file in and it should spit out a link which you can now share with other people!

### Finishing Touches and using IPNS ✨

Let's say you wanted to update parts of this site, like put a little explanation at the top about how to use your app, and some resources on accessibility for example. If you updates your site, in any manner, even if you used a different approach than the file drag and drop, because of the way IPFS works you would be given a different link.

So, in comes IPNS! IPNS is a system for creating mutable pointers to our unmutable IPFS links. Let's walk through what using IPNS might look like.

Here is a version of our app without the updates I want to make:
ipfs://bafybeigxwr63ak6oyrdk4bkvdk7psrtwpsc655vocnzlg2skn7yq3awyq4/themebuilder.html

Let's assign that to a IPNS url.

First open that up in Agregore and then open up the console. We'll need to create a new key to publish our site with, which we can do like this:

```javascript
let res = await fetch('ipns://localhost/?key=themebuilder', {method: 'POST'})
let key = 
```

### Recap 🔍

Okay, so let's revisit that basic goal we started with at the beginning:

"Our basic endgoal here is to have a way for our use to to choose the theme colours, an "example page" to reflect the colour changes, and a way for the user to "save" those changes."

I'd say we got those goals down pat!

We also learned some ways to host 

In the end you should have a file that looks like this:

```html
<!DOCTYPE html>
<head>
<style>
    @charset "utf-8";

:root {
  --ag-theme-font-family: system-ui;
  --ag-theme-background: #111;
  --ag-theme-text: #F2F2F2;
  --ag-theme-primary: #6e2de5;
  --ag-theme-secondary: #2de56e;
  --ag-theme-indent: 16px;
  --ag-theme-max-width: 666px;
}
  
* {
  box-sizing: border-box;
}

html, body, input, button, textarea {
  background: var(--ag-theme-background);
  color: var(--ag-theme-text);
  font-family: var(--ag-theme-font-family);
  font-size: inherit;
}

input, button, textarea {
  border: 1px solid var(--ag-theme-primary);
}

body {
  padding: 1em;
  max-width: var(--ag-theme-max-width);
  margin: 0 auto;
}

a {
  color: var(--ag-theme-secondary);
  text-decoration: underline;
  text-decoration-color: var(--ag-theme-primary);
}

a:visited {
	color: var(--ag-theme-primary);
}

img, video, svg, object {
  width: 80%;
  display: block;
  margin: 1em auto;
}

iframe {
  display: block;
  margin: 1em auto;
}

code {
  background: var(--ag-theme-primary);
  font-weight: bold;
  padding: 0.25em;
}

pre > code {
  display: block;
  padding: 0.5em;
}

br {
  display: none;
}

li {
  list-style-type: " ⟐ ";
}

hr {
  border-color: var(--ag-theme-primary);
}

*:focus {
  outline: 2px solid var(--ag-theme-secondary);
}

h1 {
  text-align: center;
}

/* Reset style for anchors added to headers */
h2 a, h3 a, h4 a {
  color: var(--ag-theme-text);
  text-decoration: none;
}

h1 a {
  color: var(--ag-theme-primary);
  text-decoration: none;
}

h1:hover::after, h2:hover::after, h3:hover::after, h4:hover::after {
  text-decoration: none !important;
}
h2::before {
  content: "## ";
  color: var(--ag-theme-secondary);
}
h3::before {
  content: "### ";
  color: var(--ag-theme-secondary);
}
h4::before {
  content: "#### ";
  color: var(--ag-theme-secondary);
}
</style>
</head>
<html>
    <body>
        <label for="backgroundCol">Background: </label><input type="color" id="backgroundCol" value="#111">
        <label for="textCol">Text: </label><input type="color" id="textCol" value="F2F2F2">
        <label for="primaryCol">Primary: </label><input type="color" id="primaryCol" value="#6e2de5">
        <label for="secondaryCol">Secondary: </label><input type="color" id="secondaryCol" value="#2de56e">
        <button onclick="downloadTheme()">Download</button>
        <h1> Theme Builder</h1>
        <h2>The Idea ✨</h2>
        <p>Jesse is using the Agregore theme (found <a href="agregore://theme/style.css">here</a> or <a href="https://agregore.mauve.moe/docs/theming">here</a>) to keep their apps looking cohesive. They want to change up the theme, so they navigate to ipns://themebuild.er to play around with the colours until they find something they like.
        </p>
        <h3>Preamble</h3>
        <p>This tutorial assumes a very basic level of web development experience as well as a small familiarity with p2p web protocols or IPFS. Maybe you've made a handful of single page web apps and have heard about the distributed web before but haven't really played around with it.</p>
        <h2>Getting Started 🏁</h2>
        <p>To keep things simple for this tutorial I'm just going to use an online code playground (I used <a href="https://jsfiddle.net/">JSFiddle</a> specifically) as our dev environment. Of course, you're free to use whatever you want, but that's the context that surround this tutorial.</p>
        <p>We will use Agregore's built in <a href="https://agregore.mauve.moe/docs/ipfs-protocol-handlers">IPFS Fetch API</a> to publish our site on IPFS. At the time of writing the latest version for Agregore can be found <a href="https://github.com/AgregoreWeb/agregore-browser/releases/tag/v1.10.1">here</a>.</p>
        <h2>Developing Our App</h2>
        <p>So, let's start making our app, our basic endgoal here is to have some colour pickers to choose the theme colours, an "example page" to reflect the colour changes, and a way for the user to "save" those changes.</p>
        <p>
        First let's set up our file, if you navigate to <code>agregore://theme/style.css</code> we're just going to copy paste this whole thing into the css. 
        </p>
        <p>
        Once you've done that, delete the second line (the <code>@import url("agregore://theme/vars.css")</code>) and replace it with the following:
        </p>
        <pre>
        <code>:root {
          --ag-theme-font-family: system-ui;
          --ag-theme-background: #111;
          --ag-theme-text: #F2F2F2;
          --ag-theme-primary: #6e2de5;
          --ag-theme-secondary: #2de56e;
          --ag-theme-indent: 16px;
          --ag-theme-max-width: 666px;
        }</code>
        </pre>
        <p>
        If you took a peek at <code>agregore://theme/vars.css</code> you might notice that this looks very similar because it's essentially that file. The reason we're doing things this was is because we're gonna want to be able to mess with the CSS file and edit it freely. 
        </p>
        <p>
        After we've done that we're going to want to have some content for the CSS to style. For that I decided to use this tutorial up to this point!</p>
        </body>
</html>
<script>
let root = document.documentElement
let rootStyle = getComputedStyle(document.body);

backgroundCol.addEventListener("change", function(event) {
	colorChange(event, "--ag-theme-background");
},false);
textCol.addEventListener("input",function(event) {
	colorChange(event, "--ag-theme-text");
},false);
primaryCol.addEventListener("change",function(event) {
	colorChange(event, "--ag-theme-primary");
},false);
secondaryCol.addEventListener("change",function(event) {
	colorChange(event, "--ag-theme-secondary");
},false);

function colorChange(event, colorVar) {
	root.style.setProperty(colorVar, event.target.value);
}

function downloadTheme(){
	const link = document.createElement("a");
  const content = `@charset "utf-8";

:root {
  --ag-theme-font-family: system-ui;
  --ag-theme-background: `+ rootStyle.getPropertyValue("--ag-theme-background") + `;
  --ag-theme-text: `+ rootStyle.getPropertyValue("--ag-theme-text") + `;
  --ag-theme-primary: ` + rootStyle.getPropertyValue("--ag-theme-primary") + `;
  --ag-theme-secondary: ` + rootStyle.getPropertyValue("--ag-theme-secondary") + `;
  --ag-theme-indent: 16px;
  --ag-theme-max-width: 666px;
}
  

* {
  box-sizing: border-box;
}

html, body, input, button, textarea {
  background: var(--ag-theme-background);
  color: var(--ag-theme-text);
  font-family: var(--ag-theme-font-family);
  font-size: inherit;
}

input, button, textarea {
  border: 1px solid var(--ag-theme-primary);
}

body {
  padding: 1em;
  max-width: var(--ag-theme-max-width);
  margin: 0 auto;
}

a {
  color: var(--ag-theme-secondary);
  text-decoration: underline;
  text-decoration-color: var(--ag-theme-primary);
}

a:visited {
	color: var(--ag-theme-primary);
}

img, video, svg, object {
  width: 80%;
  display: block;
  margin: 1em auto;
}

iframe {
  display: block;
  margin: 1em auto;
}

code {
  background: var(--ag-theme-primary);
  font-weight: bold;
  padding: 0.25em;
}

pre > code {
  display: block;
  padding: 0.5em;
}

br {
  display: none;
}

li {
  list-style-type: " ⟐ ";
}

hr {
  border-color: var(--ag-theme-primary);
}

*:focus {
  outline: 2px solid var(--ag-theme-secondary);
}

h1 {
  text-align: center;
}

/* Reset style for anchors added to headers */
h2 a, h3 a, h4 a {
  color: var(--ag-theme-text);
  text-decoration: none;
}

h1 a {
  color: var(--ag-theme-primary);
  text-decoration: none;
}

h1:hover::after, h2:hover::after, h3:hover::after, h4:hover::after {
  text-decoration: none !important;
}
h2::before {
  content: "## ";
  color: var(--ag-theme-secondary);
}
h3::before {
  content: "### ";
  color: var(--ag-theme-secondary);
}
h4::before {
  content: "#### ";
  color: var(--ag-theme-secondary);
}`;
  const file = new Blob([content],{type: "text/css"});
  link.href = URL.createObjectURL(file);
  link.download = "style.css";
  link.click();
  URL.revokeObjectURL(link.href);
}

</script>
```
