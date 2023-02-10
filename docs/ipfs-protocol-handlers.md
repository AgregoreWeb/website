# ✨🪐 IPFS Fetch API 🪐✨

The `fetch()` API browsers use for HTTP, but for IPFS!
**[Intro Video📺](https://youtu.be/kI9Issf3MNc?t=1629)**

Agregore integrates IPFS protocol handlers natively, meaning you can start using them out of the box, no extra set up necessary! Instead of using fetch to talk to HTTP servers, you can use it to talk to IPFS from within the browsers JS 💫

There are a few copy-pasteable examples throughout this doc, to use them you can use the browsers devtools! To open up the devtools you can do one of the following:

- hit **ctrl + shift + I** (for mac, **cmd + shift + I**)
- right-click anywhere and select **Inspect**
- click the tab labelled files in the upper left corner, select **Open Devtools**

Once you have done one of those things, select the tab labelled **Console** and then you're all set ✨

# Introduction 👋

## What is the Fetch API?

The Fetch API provides a JavaScript interface for accessing and manipulating parts of the protocol, such as requests and responses. It also provides a global fetch() method that provides an easy, logical way to fetch resources asynchronously across the network. (taken from the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)) The MDN docs are a great way to learn about JS stuff in general, it's a good place to start if you want to know more about fetch!

## What is IPFS?

In short, IPFS (which stands for 🌠🌓 InterPlanetary File System 🌗🌠) is a distributed system for storing and accessing files, sites, apps and data! If you'd like to learn more you can check out the [🪐 IPFS homepage](https://ipfs.tech/) or, if you want to dig deeper, you can check out the [🗒 IPFS Docs](https://docs.ipfs.tech/).

## Why is this useful? 🤔

In short, it simplifies the web development process. As long as you have a basic knowledge of web dev (JS, HTML etc.) you can make apps that are shareable right away!

Definitely check out the [intro video](https://youtu.be/kI9Issf3MNc?t=1629) (same as the one linked above) for a look into the *whys* if that's something of interest. It also has a small demo if you'd like to see it in action!

## Resources and Further Reading 📖

While some of these have already been linked, if you are new to any of this then taking a peek at the following sites and referencing back to them as you play around with these tools will be extremely beneficial. Relevant links will appear throughout the docs but going through some of them beforehand should prove helpful!

- [👩‍💻 MDN Docs](https://developer.mozilla.org/en-US/)
- [🪐 IPFS Homepage](https://ipfs.tech/)
- [📑 IPFS Docs](https://docs.ipfs.tech/)
- [🌑 IPNS Page from IPFS Docs](https://docs.ipfs.tech/concepts/ipns/#mutability-in-ipfs)
- [🔗 IPLD Homepage](https://ipld.io/)
- [🌕 IPLD Docs](https://ipld.io/docs/)
- [📚 LibP2P Docs](https://docs.libp2p.io/)

# The API 📜

```JavaScript
await fetch(URL, options)
```

The API takes a URL, the thing you want to fetch, and can also take some options to modify the fetch request.

## Using Fetch with IPFS 🌠

In the code snippets you'll see **CID** pop up frequently, this stands for **Content Identifier**, IPFS links are generated from the content of a file rather than being a files location. You can read more about it on [this page](https://docs.ipfs.tech/concepts/content-addressing/#what-is-a-cid) from the IPFS docs.

## Loading Data 📨

```JavaScript
await fetch('ipfs://CID/example.txt')
```

If you specify a URL for a file (no trailing slash) it will be loaded from IPFS and the content will be sent as the response body.

The response headers will have a `Content-Length` header to set the size of the file.

### Example

```JavaScript
url = 'ipfs://bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze/wiki/Elephant'
response = await fetch(url)
await response.text()
```

The above example is fetching the Wikipedia article (from the [IPFS Wikipedia Mirror 📚](https://github.com/ipfs/distributed-wikipedia-mirror)) for elephants and then spits out the content of the page as text. You can then do `response.headers.get('Content-Length')` for getting the content length.

```JavaScript
await fetch('ipfs://CID/example/')
```

If you specify a URL for a folder (has trailing slash), the folder will be enumerated from IPFS and an HTML page listing its various files will be rendered.

Hyperlinks to files/folders will be automatically generated as relative URLs.

Links will have a trailing slash for folders.

If the folder contains an `index.html` it will be served as a file instead of performing a directory listing.

One of the options is to set the request method by default it is `GET` (meaning `await fetch('ipfs://CID/example.txt')` is functionally the same as `await fetch('ipfs://CID/example.txt', method: 'GET')`).

### Example

```JavaScript
url = 'ipfs://bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze/wiki/'
response = await fetch(url)
await response.text()
```

Like the previous example this will just spit out the contents of the page, in this case it is all of the pages available from the Wikipedia Mirror.

```
await fetch('ipfs://CID/example.txt', { method: 'HEAD' })
```

If you set the method to `HEAD` it will be like doing a `GET` request but without actually loading the data. This is useful for getting the `Content-Length` or checking to see if a file exists.

## Uploading Data 📤

```JavaScript
url = 'ipfs://bafyaabakaieac/example.txt'
response = await fetch(url, {
  method: 'PUT',
  body: 'Hello World! 👋 🌎🌍🌏'
})
```

You can upload files to IPFS by setting the method to `PUT`.

The response will contain a `Location` header with the created URL. e.g. `const url = response.headers.get('Location')`

Note that `ipfs://bafyaabakaieac/` is an IPFS URL representing an empty directory (using an inline block definition).

In the code snippet above we also see the `body` option for the first time, it's used to give your request a body, in this case just being some text.

```JavaScript
response = await fetch('ipfs://bafyaabakaieac/', {
  method: 'PUT',
  body: new FormData()
})
```

You can upload several files to IPFS by using `PUT` messages with a [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) body.

You can [append](https://developer.mozilla.org/en-US/docs/Web/API/FormData/append) to a formData with `formData.append(fieldname, content, 'filename.txt')` where `fieldname` gets ignored (use something like `file`?), the `content` can either be a String, Blob, or some sort of stream. The `filename` will be the filename inside the IPFS directory that gets created.

The response will contain a `Location` header with the created URL. e.g. `const url = response.headers.get('Location')`

Note that `ipfs://bafyaabakaieac/` is an IPFS URL representing an empty directory (using an inline block definition).

## Common Headers 🤠

```JavaScript
response = await fetch('ipfs://CID/example/', {
  headers: {'X-Resolve': none}
})
```

If you specify the `X-Resolve: none` header in your request, the resolution of `index.html` will be ignored and a directory listing will always be performed.

```
var response = await fetch('ipfs://CID/example/', {headers: {Accept: 'application/json'}})
```

If you specify a URL for a folder, and set the `Accept` header to only contain `application/json`, the directory will be enumerated and the list of files/folders will be returned as a JSON array.

You can get the file/folder list out of the response using `await response.json()`.

Names will have a trailing slash for folders.

### Example

```JavaScript
url = 'ipfs://bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze/wiki/'
response = await fetch(url, {
  headers: {
    Accept: 'application/json'
  }
})
```

In this example we are once again using the IPFS Wikipedia mirror. Once that is done being fetched you may do `await response.json()` to see the file/folder list.

```JavaScript
response = await fetch('ipfs://CID/example.txt', {
  headers: { Range: 'bytes=0-4' }
})
```

You can specify the `Range` header when making a request to load a subset of a file.

## Using Fetch with IPNS 🚀

### What is IPNS?

Since IPFS CIDs are generated based on the content of a file, if you ever want to change the content, then well, the CID changes too. Obviously there are many cases where one would need to update content frequently and it could become very cumbersome to have to send out a new CID everytime an update is made.

That's where IPNS (which stands for 🌟🌎 InterPlanetary Naming System 🌏🌟) comes in! IPNS is a system for creating mutable pointers to CIDs. If you're interested in learning more, [here's a page](https://docs.ipfs.tech/concepts/ipns/) about it from the IPFS docs! ✨

```JavaScript
await fetch('ipns://CID/example.txt')
```

You can specify an IPNS URL to have it resolve to whatever resource you wanted using IPNS.

```JavaScript
await fetch('ipns://localhost/?key=example_key')
```

You can redirect to a `ipns://k2k4r...` public key URL by doing a `GET` on an existing key using the special `localhost` IPNS domain.

You must specify a custom "key name" in the `key` URL search parameter.

This will result in a `302` redirect with the URL being in the `Location` response header.

If you have not created this key before, a `404` response will be sent instead.

```
await fetch('ipns://localhost/?key=example_key', {method: 'POST'})
```

You can create a new  IPNS key using the `POST` method to the special `localhost` IPNS domain.

You must specify a custom "key name" in the `key` URL search parameter.

This name will be used to generate and keep track of an IPNS public key.

The response will contain a `Location` header which will have your `ipns://k2k4r...` public key URL.

Calling this method on an existing key will be a "no-op" and return a success regardless.

```JavaScript
response = await fetch('ipns://PUBLIC_KEY/', {
  method: 'POST',
  body: 'ipfs://CID/example.txt'
})
```

You can publish to IPNS using the `POST` method.

The `body` should contain the `ipfs://` URL you want to point to.

The response will be an `ipns://` URL for your data.

It's best to point at directories when possible so that they can be treated as origins within browser contexts.

The key in the origin must be the public `ipns://k2k4r...` style key that you created with `ipns://localhost?key=`.

*If you have ideas for how to do key import and export, please open a GitHub issue about it!* 💞

```JavaScript
response = await fetch('ipns://PUBLIC_KEY/example.txt', {
  method: 'PUT',
  body: 'Hello World!'
})
```

You can update some data in an IPNS directory using the `PUT` method and a file path.

The `body` should be the contents of your file.

The key in the origin must be the public `ipns://k2k4r...` style key that you created with `ipns://localhost?key=`.

If this IPNS key has already had some data published under it, the CID for the directory will be fetched, and your file will be added on top.

This enables you to have mutable folders of data on top of IPFS+IPNS without having to juggle CIDs and merge data in your application.

## IPLD 📡

### What is IPLD?

IPLD (which stands for 💫🔗 InterPlanetary Linked Data 🔗💫) is the data model that IPFS is built upon. It is a bit much to get into so if you'd like a more detailed explanation there's [this page](https://blog.ipfs.tech/what-is-ipld/) from the IPFS blog and there's always the [🛰 IPLD homepage](https://ipld.io/) as well as the [📘 IPLD Docs](https://ipld.io/docs/). 

```JavaScript
await fetch('ipld://CID/example', {
  method: 'GET',
  headers: {
    'Accept': "application/json"
  }
})
```

You can get get raw IPLD data from a CID using the `ipld` protocol scheme.

The data pointed to by the CID will not be interpreted as UnixFS and will use raw IPLD traversal wih the path.

Path segments can have custom parameters separated by `;` and can use URL encoding to have special characters like `/` represented.

The `Accept` header can be used to re-encode the data into a different format. Valid options right now are `application/json` or `application/vnd.ipld.dag-json` for dag-JSON encoding, and `application/vnd.ipld.dag-cbor` for CBOR encoding.

This lets you view IPLD data encoded as CBOR as JSON in your application without needing to decode it yourself.

```JavaScript
await fetch('ipld://localhost?format=dag-cbor', {
  method: 'POST',
  body,
  headers: {
    'Content-Type': "application/json"
  }
})
```

You can upload data to the IPLD data model by doing a `POST` to `ipfs://localhost`.

You can specify the encoding used for the body using the `Content-Type` header. Data encoded in JSON will be encoded to the data model as dag-JSON.

You can also specify that you want the data to be saved in another format than what was used to upload it via the `?format` parameter. Valid options are `dag-json` to save the body as JSON, and `dag-cbor` to save the body as CBOR.

This lets your application send data to IPLD authored in JSON, but have it saved to the more efficient CBOR encoding.

The resulting data will be returned in the `Location` header in the format of `ipld://CID/`.

## LibP2P's PubSub Protocol 📰

```JavaScript
new EventSource('pubsub://TOPIC/?format=base64')
// Or
fetch('pubsub://TOPIC/', {headers: {Accept: "text/event-stream"}})
```

You can subscribe to [LibP2P's Publish/Subscribe](https://docs.libp2p.io/concepts/pubsub/overview/) topics when using the `pubsub` protocol, and using the `text/event-stream` Accept header.


If you have access to the Browser's [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) you can automatically parse the resulting events.
Otherwise you'll need to read from the response `body` and parse the stream body manually.

The `TOPIC` can be any utf-8 string and will be used to connect to peers from accross the network.

The `EventSource` will emit message events whose `data` is a JSON object which contains the following parameters:

- `from`: the ID of the peer that sent the message
- `topics`: What topics the peer that sent this event is also gossiping on
- `data`: The encoded `data` for the message. By default it is a base64 encoded string.

```JavaScript
await fetch('pubsub://TOPIC/', {method: 'POST', data})
```

You can publish a new message to subscribed peers for a `TOPIC` by doing a `POST` to the `pubsub` protocol.

The `TOPIC` can be any utf8 string and will be used to find peers on the network to send the data to.

The `body` will be sent as a binary buffer to all other peers and it'll be up to them to decode the data.

---

[Back](/)
