#### What was the outcome?

1. To share your app with the group, first walk us through the original goal and what you ended up making.

Initially the plan was to create an IPFS site/application that uses 3rd party dependencies. Specifically, I wanted to update the [self hosted development environment](https://agregore.mauve.moe/docs/tutorials/ipfs-browser-devenv/part-1) created in a previous tutorial to use a code editor. I ended up making a tutorial that adds the ability to the environment to upload a directory hierarchy of files.

2. Did you accomplish more or less than the original app idea? If you started out with a user story, were those aims accomplished?

Both more and less. Less because the end result is only uploading files. But also more, since this is a requirement for adding 3rd-party dependencies and it can be used for other purposes too, like uploading media to an IPFS site someone is creating.

3. Did the idea evolve or change drastically through the process? If so, how did these changes affect the outcome?

It changed a lot. A big factor driving the change was managing the complexity of the tutorial. I've created partial tutorials for adding 3rd-party dependencies, building 3rd-party dependencies in the command line using rollup, handling folders for drag-and-drop. I ended up removing most of this content.


#### What was the process like?

1. Describe making the app. Link to the tutorial here.
It was an iterative process with lots of restarts and rethinks. [Link to tutorial](https://agregore.mauve.moe/docs/tutorials/ipfs-dir-upload/).

2. What else was notable about the process? Some discussion questions:
Q: What went well? 
A: Writing the code was mostly smooth sailing. I'm excited about adding a proper code editor to the development environment in a next tutorial!

Q: What took a lot of time? 
A: Changing direction multiple times.

Q: Did you find anything else to be unexpected about making the app?
A: Yes, directory upload can be done in 3 different ways, none of them part of the HTML spec and all wildly varying in complexity with inconvenient trade-offs.

Q: If you could give yourself advice when you started making the app, what would you tell yourself?
A: Start with a much simpler goal and expand on that only if needed.

#### Discussion

1. What would you do with this app if you kept working on it? E.g. future improvements? Demo it with users (if so, who would the users be)?

Uploading many files can take a long time and the current implementation of the folder upload doesn't provide any user feedback. It would also be useful adding the ability to organize files - eg. move, rename, delete, etc. If someone wanted to make a photobook website on IPFS using the development environment, they would sorely lack both an indication of how their upload is progressing and the ability to organize files after it's been uploaded.

2. If any technical improvements to Agregore or the underlying protocols could make development easier for this app, please describe them here.

One of the challenges with uploading a whole directory hierarchy using the js-ipfs-fetch handlers in Agregore Web is that you cannot upload multiple files to different directory paths at the same time. To work around this, files had to be uploaded in batches where all the files in a batch has the same base path.

Being able to merge two UnixFS directories using js-ipfs-fetch without needed to download the content first would make strategies like parallelizing the uploading of batches. I don't know if this is feasible, but currently it is hard to imagine uploading directories with many big files.
