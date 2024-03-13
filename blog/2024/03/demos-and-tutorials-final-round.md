# Agregore demos and tutorials round 3

This is our third and final round of apps and tutorials for our [FFDW grant](/blog/2023/01/demos-and-tutorials-announcement). In this round we have four new apps and tutorials as well as some final thoughts for what we want next.

## What we made

This time around we had a mix of working more on some foundational tutorials and some usable apps that people could customize for themselves.

### Dirk's ACE Editor integration

First up is Dirk's final tweak to his code editor series. This time he's figured out how to add third party dependencies to the editor, specifically ACE for syntax highlighting. You can follow along with the latest tutorial [here](/docs/tutorials/ipfs-3rdparty-dep/) or start at the beginning [here](/docs/tutorials/ipfs-browser-devenv/part-1). You can also see the live deployed version [here](/docs/examples/browser-devenv-v3/index.html).

### Dirk's Image Gallery

Dirk's final app was an image gallery where you can upload images and then create a web app to display them in a pleasant tiled format. You can find the tutorial [here](/docs/tutorials/ipfs-gallery/) and a version of the app hosted on html [here](/docs/examples/ipfs-gallery/). This also builds on top of his development environment so you can use the new syntax highlighting and multi-file uploading features as you develop.

### Vincent's P2Pad code editor

After getting comfortable with making apps and tutorials, Vincent worked on a simple [JSFidde](https://jsfiddle.net/) or [Code Pen](https://codepen.io/) inspired editor where you enter HTML, CSS, and JavaScript into separate text inputs and render a live preview for quickly sketching up web pages and apps. This is a more barebones alternative to Dirk's editor which handles editing files in a directory whereas this generates single HTML pages. You can play around and make your own page [here](/docs/examples/p2pad/) or follow [the tutorial](/docs/tutorials/p2pad-code-editor.md) to make your own.

### Vincent's DLinkTree link aggregator

For his last app Vincent made use of his P2Pad app too bootstrap making a small app for aggregating links and publishing them as a page on IPFS. You can view the
[tutorial](/docs/tutorials/dlinktree-builder.md) to build it yourself or check out the final version [here](/docs/examples/dlinktree-builder/). Since this doesn't require Devtools to build you can even try to build it on an Android phone with [Agregore Mobile](https://github.com/AgregoreWeb/agregore-mobile/releases/tag/101.0.4951.53).

## Retrospectives

As with the other milestones, keeping stuff small and reducing feature sets has helped keep the apps more focused and made it easier to build them. This time around we also saw the benefits of working on top of existing code which could be copied from past projects or in the case of the editors, used to make new projects with less fuss than devtools. It aslo looks like working on the app code before writing the tutorial has been best for avoiding rewriting the tutorial as you go. Overall we've been getting better at scoping tutorials and apps and finding ways to work with the tools we have available.

## Next steps

From doing these tutorials we've found that we can get a lot done with just a bit of code and Agregore's protocol handlers. We'd love to iterate on this further and focus on the following:
- Get the tutorials and docs translated to more languages like Spanish to reach more audiences.
- Fix some of the bugs we found during app/tutorial development.
- Add some better sharing built into Agregore itself.
- Expand one some of the improvements we thought of for existing apps as follow up tutorials.

If you want to work on this or fund work like this, get in touch by either joinng our [Matrix Channel](https://matrix.to/#/#agregore:mauve.moe) or sending us an [email](mailto:agregore@mauve.moe).

---

Full Retrospectives:

- [Ace Editor](/blog/2024/01/ipfs-3rd-party-dep-retrospective.md)
- [IPFS Gallary](/blog/2024/03/ipfs-gallery-retrospective.md)
- [P2Pad](/blog/2024/01/p2pad-code-editor-retrospective.md)
- [DLinkTree](/blog/2024/03/dlinktree-builder-retrospective.md)
