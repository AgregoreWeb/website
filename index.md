<style>
.agregore-logo {
  width: 50%;
  animation-name: pulse;
  animation-duration: 1.5s;
  animation-timing-function: linear;
  animation-direction: alternate;
  animation-iteration-count: infinite;
  animation-play-state: running;
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}
</style>

<img class="agregore-logo" title="Agregore Logo. Eight arrows pointing out with an eye in the center." src="./icon.svg">

# Agregore

Build the distributed web.

[Explore](./explore)
[Blog](./blog/)
[Docs](./docs/)
[Videos](./videos)
[FAQ](./faq)
[Download](https://github.com/AgregoreWeb/agregore-browser/releases/latest)
[Mobile](https://github.com/AgregoreWeb/agregore-mobile/)

Agregore is not just a `Web-Browser`, it's a `Web-Weaver`.
It gives you the tools to load and author content locally without needing the cloud.
Instead of needing to be always connected to a server, you can load from your cache or directly from others.
Agregore automatically reshares P2P websites with others so the more popular a site is, the faster it is to load it.
It works offline, on local networks, and over the internet.
Made to support a resilient and person-first foundation for software.

### Features

- Browse the existing (HTTP) web like usual.
- Browse the [Distributed Web](https://getdweb.net/) on [Hypercore](https://github.com/hypercore-protocol), [BitTorrent](http://bittorrent.org/introduction.html), and [IPFS](https://ipfs.tech/).
- Browse alternate web protocols like [Gemini](https://geminiprotocol.net/)
- Tracking free with a built in [Ad blocker](https://ublockorigin.com/)
- Render [Markdown](https://www.markdownguide.org/basic-syntax/) and JSON natively.
- Archive and save web pages for offline use via [ArchiveWeb.page](https://archiveweb.page/)
- Customizable [color scheme](/docs/theming) which gets applied to all pages
- New web [APIs for creating p2p sites and apps](/docs/#protocols)
- Built in [large language model APIs](/docs/ai) using free to use local models

![Screenshot showing Agregore Browser loading a hyper:// URL](screenshot.png)

### Watch the 5 Minute Intro

<iframe width="560" height="315" src="https://archive.org/embed/dweb-meetup-dec-2020-dweb-lightning-talks?start=4212" title="Agregore 4 minute intro" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### How does it work?

Agregore works by letting you load web pages and content from peer to peer protocols the same way you would load them from a website.

In the same way as you can navigate to `http://example.com`, you can navigate to `hyper://blog.mauve.moe` and have it load from anybody on the network that has a copy.
This can be done via the different protocols that Agregore supports like [BitTorrent](https://github.com/AgregoreWeb/agregore-markdown-site-generator), [IPFS](https://ipfs.io), and [Hypercore Protocol](https://github.com/AgregoreWeb/agregore-markdown-site-generator).
The web contents are rendered via Chromium using the [Electron framework](https://www.electronjs.org/).
Electron is useful since it's what allows us to publish Agregore on Windows, MacOS, and Linux.

### How do I make stuff?

Agregore not only supports loading data through custom protocols, but it also provides APIs for uploading data into peer to peer protocols.
This is done via the browser's [fetch()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) API which is what web developers use to talk to web servers over HTTP or HTTPS.

You can create your own peer to peer website using this simple code snippet (open dev tools with CTRL+Shift+I):

```javascript
// Upload your website page
url = 'ipfs://bafyaabakaieac/example.txt'
response = await fetch(url, {
  method: 'PUT',
  body: 'Hello World! 👋 🌎🌍🌏'
})// Navigate to the website
window.location.href = response.headers.get('Location')
```

Try making an app in the [DWeb Scratchpad](/apps/scratchpad.html). For more details and demos, check out the the [Videos](videos.html) page, or read the [Fetch API Docs](https://github.com/AgregoreWeb/agregore-browser/tree/master/docs).

[Source Code](https://github.com/AgregoreWeb/agregore-browser)
[Contact](mailto:agregore@mauve.moe)
[Discord](https://discord.gg/QMthd4Y)
[Matrix](https://matrix.to/#/#agregore:mauve.moe)
[Mastodon](https://mastodon.mauve.moe/@agregore)
[BlueSky](https://bsky.app/profile/agregore.mauve.moe)
