# Theme Builder Tutorial


## The Idea ✨

Jesse is using the Agregore theme (found [here](browser://theme/style.css) or [here](https://agregore.mauve.moe/docs/theming)) to keep their apps looking cohesive.
They want to change up the theme, so they navigate to ipns://themebuild.er to play around with the colors until they find something they like, then export it to reuse it in Agregore.

### Preamble

This tutorial assumes a very basic level of web development experience as well as a small familiarity with p2p web protocols or IPFS.
Maybe you've made a handful of single page web apps and have heard about the distributed web before but haven't really played around with it.

## Getting Started 🏁

To keep things simple for this tutorial I'm just going to use an online code playground (I used [JSFiddle](https://jsfiddle.net/) specifically) as our dev environment.
Of course, you're free to use whatever you want, but that's the context that surround this tutorial.

We will use Agregore's built in [IPFS Fetch API](https://agregore.mauve.moe/docs/ipfs-protocol-handlers) to publish our site on IPFS.
At the time of writing the latest version for Agregore can be found [here](https://github.com/AgregoreWeb/agregore-browser/releases/latest).

## Developing Our App 👩‍💻

So, let's start making our app, our basic endgoal here is to have some color pickers to choose the theme colors, an "example page" to reflect the color changes, and a way for the user to "save" those changes.

### Set Up

First let's set up our file, if you navigate to browser://theme/vars.css you can see Agregore's default styles.
You can add these styles to your jsfiddle by pasting `@import "browser://theme/style.css"` into the CSS section.

The reason we're doing things this was is because we're gonna want to be able to apply the default styles and mess with them with custom values.

The variables for the colors can be found in another file called browser://theme/vars.css which should look like this:

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

After we've done that we're going to want to have some content for the CSS to style. For that I decided to use The tutorial up to this point!

And with that, we're done set up. You should have a CSS file that looks like this:

```css
@import "browser://theme/style.css"
```

And an HTML file that looks like this:

```html
<h1>Theme Builder</h1>
<h2>The Idea ✨</h2>
<p>Jesse is using the Agregore theme (found <a href="browser://theme/style.css">here</a> or <a href="https://agregore.mauve.moe/docs/theming">here</a>) to keep their apps looking cohesive. They want to change up the theme, so they navigate to ipns://themebuild.er to play around with the colors until they find something they like.
</p>
<h3>Preamble</h3>
<p>This tutorial assumes a very basic level of web development experience as well as a small familiarity with p2p web protocols or IPFS. Maybe you've made a handful of single page web apps and have heard about the distributed web before but haven't really played around with it.</p>
<h2>Getting Started 🏁</h2>
<p>To keep things simple for this tutorial I'm just going to use an online code playground (I used <a href="https://jsfiddle.net/">JSFiddle</a> specifically) as our dev environment. Of course, you're free to use whatever you want, but that's the context that surround this tutorial.</p>
<p>We will use Agregore's built in <a href="https://agregore.mauve.moe/docs/ipfs-protocol-handlers">IPFS Fetch API</a> to publish our site on IPFS. At the time of writing the latest version for Agregore can be found <a href="https://github.com/AgregoreWeb/agregore-browser/releases/tag/v1.10.1">here</a>.</p>
<h2>Developing Our App</h2>
<p>So, let's start making our app, our basic endgoal here is to have some color pickers to choose the theme colors, an "example page" to reflect the color changes, and a way for the user to "save" those changes.</p>
<p>
First let's set up our file, if you navigate to <code>browser://theme/style.css</code> we're just going to copy paste this whole thing into the css. 
</p>
<p>
Once you've done that, delete the second line (the <code>@import url("browser://theme/vars.css")</code>) and replace it with the following:
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
If you took a peek at <code>browser://theme/vars.css</code> you might notice that this looks very similar because it's essentially that file. The reason we're doing things this was is because we're gonna want to be able to mess with the CSS file and edit it freely. 
</p>
<p>
After we've done that we're going to want to have some content for the CSS to style. For that I decided to use this tutorial up to this point!</p>
```

### Changing colors 🖌

The most essential part of a theme builder is the ability to change the colors of the page. To do that, we'll be using those CSS variables.
For now, lets just switch some of the colors with each other to get the hang of things.

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

I switched the background and text colors with each other and the primary and secondary colors, to see this change lets create a button that will call this function.
I put my button at the top of our HTML file so it's easy to access but you can put it wherever you want.

Here's the HTML for the button: `<button onclick="colorChange()">Click Me!</button>`

### color Picking 🎨

Now that we know how to change our colors, let's make it easy for a  user to pick the colors themselves.
Luckily for us the `<input>` element has can be used as a color picker by assigning it `type = "color"` let's make four of these for each of the CSS variables that have colors assigned to them, and let's put some labels to keep things together.

```html
  <label for="backgroundCol">Background: </label><input type="color" id="backgroundCol" value="#111">
  <label for="textCol">Text: </label><input type="color" id="textCol" value="#F2F2F2">
  <label for="primaryCol">Primary: </label><input type="color" id="primaryCol" value="#6e2de5">
  <label for="secondaryCol">Secondary: </label><input type="color" id="secondaryCol" value="#2de56e">
```

I placed this before our button but feel free to place them wherever you feel is best. I've also made it so that the default colors are, well, the default colors of the theme.

### Changing colors with color picking 🖼

Ok now lets use the those color pickers to change the theme colors. To do this we're going to need some event listeners on on them. All of them are going to look a bit like this:

```javascript
backgroundCol.addEventListener("input", function(event) {
    colorChange(event, "--ag-theme-background");
},false);
```

You could set the event type to "change" instead of "input" and it would work similarly.
(Change would make it so the color changes when the picker is dismissed, where input makes it so that it happens actively.)
If you noticed I used our colorChange function inside of an anonymous function as the listener function.
Let's edit that so it makes sense:

```javascript
function colorChange(event, colorVar) {
  root.style.setProperty(colorVar, event.target.value);
}
```

The anonymous function is there because I wanted to pass that second variable along with the event object.

Ok now that we've got that covered we can write out the event listeners for our other color pickers:

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
With this the theme colors update when a user interacts with a color picker, rendering our button obsolete, let's give it a new purpose.

### Saving and downloading to a file 💾

Lets make it so our user can download an `.agregorerc` file so that they can save it to their home folder and apply the theme accross all of Agregore!
First we'll need a new variable `let rootStyle = getComputedStyle(document.body);` this makes it so we can get the styles in a read only format.
And now we'll write a download function (remember to replace our colorChange call in the button with this guy!):

```javascript
function downloadTheme(){
  const link = document.createElement("a");
  const content = `
{
  "theme": {
    "font-family": "system-ui",
    "background": "${rootStyle.getPropertyValue("--ag-theme-background")}",
    "text": "${rootStyle.getPropertyValue("--ag-theme-text")}",
    "primary": "${rootStyle.getPropertyValue("--ag-theme-primary")}",
    "secondary": "${rootStyle.getPropertyValue("--ag-theme-secondary")}"
  }
}
  `;
  const file = new Blob([content],{type: "text/plain"});
  console.log(content);
  link.href = URL.createObjectURL(file);
  link.download = ".agregorerc";
  link.click();
  URL.revokeObjectURL(link.href);
}
```

My button HTML looks like this now: `<button onclick="downloadTheme()">Download</button>`

The stuff in the "content" variable is almost entirely the CSS file, the only difference being the custom colors in the root.

### Hosting on IPFS 🕸

Okay now we have our app mostly finished (save some finishing touches) lets put it up so that we can share it with people!

The simplest way to do this is by putting this whole thing into one html file (as opposed to having separate JS and CSS files that our html links to)
and then uploading it using [this handy file upload](https://agregoreweb.github.io/agregore-drag-and-drop/) though you'll need to open it up in Agregore to get it to work.

You should just be able to plop your file in and it should spit out a link which you can now share with other people!

### Recap 🔍

Okay, so let's revisit that basic goal we started with at the beginning:

"Our basic endgoal here is to have a way for our use to to choose the theme colors, an "example page" to reflect the color changes, and a way for the user to "save" those changes."

I'd say we got those goals down pat!

We also learned how we can upload our file to IPFS from within Agregore.

In the end you should have a file that looks like this:

```html
<!DOCTYPE html>
<title>Theme Builder</title>
<style>
    @import "browser://theme/style.css";
</style>

<h1>Theme Builder</h1>

<label for="backgroundCol">Background: </label><input type="color" id="backgroundCol" value="#111">
<label for="textCol">Text: </label><input type="color" id="textCol" value="#F2F2F2">
<label for="primaryCol">Primary: </label><input type="color" id="primaryCol" value="#6E2DE5">
<label for="secondaryCol">Secondary: </label><input type="color" id="secondaryCol" value="#2DE56E">
<button onclick="downloadTheme()">Download</button>

<h2>The Idea ✨</h2>
<p>
Play around with Agregore's built in styles and download a copy of an <code>.agregorerc</code> file to save to your home folder to apply your styles globally.
</p>
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
  const content = `
{
  "theme": {
    "font-family": "system-ui",
    "background": "${rootStyle.getPropertyValue("--ag-theme-background")}",
    "text": "${rootStyle.getPropertyValue("--ag-theme-text")}",
    "primary": "${rootStyle.getPropertyValue("--ag-theme-primary")}",
    "secondary": "${rootStyle.getPropertyValue("--ag-theme-secondary")}"
  }
}
  `;
  const file = new Blob([content],{type: "text/plain"});
  console.log(content);
  link.href = URL.createObjectURL(file);
  link.download = ".agregorerc";
  link.click();
  URL.revokeObjectURL(link.href);
}
</script>
```
