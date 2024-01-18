# Webapps Milestone 3

# Agregore demos and tutorials round 2

This is the second round of apps and tutorials that we have worked on from [this announcement](/blog/2023/01/demos-and-tutorials-announcement).
For this round we have switched up the team and created 3 more apps and tutorials.

## What we made

### Dirk's p2p pub sub chat

[@DirkCuys](https://github.com/dirkcuys) put together a basic chat app using the `pubsub://` protocol that is part of IPFS. This protocol allows you to `subscribe` on a `topic` and connect to anyone else subscribed on the topic and then `publish` messages that get delivered to everyone. You can see a live version of the chat [here](/docs/examples/ipfs-pub-sub-chat/) or build it yourself with [the tutorial](/docs/tutorials/ipfs-pub-sub-chat).

### Dirk's Directory Uploader

[@DirkCuys](https://github.com/dirkcuys) also investigated how one could more easily upload entire folders using Agregore's built-in protocol handlers and extended his initial browser development environment with this funcionality. With this [demo](/docs/examples/browser-devenv-2/) you can upload a static website or a bunch of dependencies for a javascript project. You can see how you can add this funcionality in the new [tutorial](/docs/tutorials/ipfs-dir-upload/).

### New Docs for `hyper://` Protocol Handlers

We have a new contributor: [@tripledoublev](https://github.com/tripledoublev) aka Vincent who started off by contributing new docs for the [hyper:// protocol handlers](/docs/hypercore-protocol-handlers). Now developers can more easily develop apps with the protocol thanks to copy paste-able examples and easy to acess docs.

### Vincent's Drag and Drop

Next, [Vincent](https://github.com/tripledoublev) created a new Drag and Drop uploader. With this you can easily add a file in Agregore and share it with your friends. Check out the published [app](/docs/examples/drag-and-drop/) or follow the [tutorial](/docs/tutorials/drag-and-drop). This can also be used as a basis for drag and drop file uploads for your own apps like photo collages or profile pictures.

## Retrospectives

As with the preview milestone we had retrospectives to see how the process worked. One of the most important lessons was to scope back when possible. Sometimes the base APIs on the web platform are more complex than one might expect and it's useful to collect more information before starting development so you can avoid having to pivot a bunch due to uncertainty. Some improvements we should look into are making it even easier to copy P2P URLs accross devices, generally improve the documentation, and see if there are improvements that could be added in the protocol handlers for uploading large files.

## Next Steps

Next we have our final round where we'll be publishing 4 more apps and tutorials and wrapping up work on the grant. If you're curious to have these tutorials used for your communities or to develop new ones, reach out to us by [email](mailto:contact@mauve.moe).

---

Full retrospectives:

[IPFS Pub Sub Chat](/blog/2023/11/ipfs-pub-sub-chat-retro)
[Directory Uploader](/blog/2023/12/ipfs-dir-upload-retrospective)
[Drag and Drop Retrospective](/blog/2023/11/drag-and-drop-retrospective)
