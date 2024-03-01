# Retrospective: IPFS gallery

## What was the outcome?

### Original goal and what you ended up making.

I wanted to create a user focused app that leverages the development environment I've built in previous tutorials. To that purpose the idea was to create an app that allows an user to upload images to IPFS and create a gallery that can be shared.

You can find the tutorial [here](/docs/tutorials/ipfs-gallery/) and a version of the app hosted on html [here](/docs/examples/ipfs-gallery/).

### Did you accomplish more or less than the original app idea?

I'd say in the end this worked out well. I ended up not using some elements of the development environment that I planned to, but it made more sense to do it that way.

### Did the idea evolve or change drastically through the process? If so, how did these changes affect the outcome?

The idea took shape very organically. Some of the decisions, like keeping images on the client side until publishing the gallery, serendipitously also allowed a final version of the app to be publisable over http!

## What was the process like?

### Describe making the app
I sketched the outline for the tutorial and then developed the application in a way to fit the outline -> ie. interface first, then interaction and then saving to IPFS.

Some reflection on the process:

- **What went well?**: Doing most of the app development before writing the tutorial
- **What took a lot of time?**: Getting the layout working without requiring too much CSS and JavaScript. I'm still convinced there is a better way, but I had to move on and finish the application.
- **Did you find anything else to be unexpected about making the app?**: While the code editor is great in that it only requires the Agregore Web browser, I find that the flow of the editor caused me to loose sight of context repeatedly. In other development environments I work, I'd have an editor open with the code and that would stay open. With the integrated editor you have to reload the page each time you make an update and that is distracting.
- **If you could give yourself advice when you started making the app, what would you tell yourself?**: Once again, cut down on requirements. I like adding features, but you really have to cut it down to end up with a working and understandable application and tutorial.

## Discussion

### Future improvements and ideas

There are several interface improvements that can be done - deleting photos in a gallery, reordering photos, improving the layout, etc.

### Suggestions for Agregore or the underlying protocols

I ran into an issue when I uploaded a folder containing a space - ie "folder 1". The upload work, but when doing a request like ?noResolve request, I got a 500 response. Here is a minimal example to trigger the error:

```js
let file = new File(['a'], 'folder 1/file1.txt')
let formData = new FormData()
formData.append('file', file)
let resp = await fetch('ipfs://bafyaabakaieac/', {method: 'put', body: formData})
const newCid = new URL(resp.headers.get('location')).origin
resp = await fetch(newCid + '/folder 1/' + '?noResolve')
```

## Conclusion

I really enjoyed creating this application and I feel even though the gallery is minimal, it is both useable and useful!
