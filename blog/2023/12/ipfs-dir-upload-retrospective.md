# Retrospective: Uploading a directory of files to IPFS

## What was the outcome?

### Original goal and what you ended up making.

Initially the plan was to create an IPFS site/application that uses 3rd party dependencies. Specifically, I wanted to update the [self hosted development environment](/docs/tutorials/ipfs-browser-devenv/part-1) created in a previous tutorial to use a code editor. I ended up making a tutorial that adds the ability to the environment to upload a directory hierarchy of files.

### Did you accomplish more or less than the original app idea?

Both more and less. Less because the end result is only uploading files. But also more, since this is a requirement for adding 3rd-party dependencies and it can be used for other purposes too, like uploading media to an IPFS site someone is creating.

### Did the idea evolve or change drastically through the process? If so, how did these changes affect the outcome?

It changed a lot. A big factor driving the change was managing the complexity of the tutorial. I've created partial tutorials for adding 3rd-party dependencies, building 3rd-party dependencies in the command line using rollup, handling folders for drag-and-drop. I ended up removing most of this content.


## What was the process like?

### Describe making the app
It was an iterative process with lots of restarts and rethinks, but [the final tutorial](https://agregore.mauve.moe/docs/tutorials/ipfs-dir-upload/) stands on it's own and should be easy to work through.

Some reflection on the process:

- **What went well?**: Writing the code was mostly smooth sailing. I'm excited about adding a proper code editor to the development environment in a next tutorial!
- **What took a lot of time?**: Changing direction multiple times.
- **Did you find anything else to be unexpected about making the app?**: Yes, directory upload can be done in 3 different ways, none of them part of the HTML spec and all wildly varying in complexity with inconvenient trade-offs.
- **If you could give yourself advice when you started making the app, what would you tell yourself?**: Start with a much simpler goal and expand on that only if needed.

## Discussion

### Future improvements and ideas

Uploading many files can take a long time and the current implementation of the folder upload doesn't provide any user feedback. It would also be useful adding the ability to organize files - eg. move, rename, delete, etc. If someone wanted to make a photobook website on IPFS using the development environment, they would sorely lack both an indication of how their upload is progressing and the ability to organize files after it's been uploaded.

### Suggestions for Agregore or the underlying protocols

One of the challenges with uploading a whole directory hierarchy using the js-ipfs-fetch handlers in Agregore Web is that you cannot upload multiple files to different directory paths at the same time. To work around this, files had to be uploaded in batches where all the files in a batch has the same base path.

Being able to merge two UnixFS directories using js-ipfs-fetch without needed to download the content first would make strategies like parallelizing the uploading of batches. I don't know if this is feasible, but currently it is hard to imagine uploading directories with many big files.

## Conclusion

While this tutorial ended up being about something that should have been a small part of the initial idea, the final tutorial covers useful info and will be useful for more than simply adding a 3rd party JavaScript dependency to a site hosted on IPFS.
