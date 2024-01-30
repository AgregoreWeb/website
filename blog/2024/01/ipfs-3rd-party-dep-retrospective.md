# Retrospective: Add a 3rd-party library to an IPFS site

## What was the outcome?

### Original goal and what you ended up making.

The plan was to create an IPFS site/application that uses 3rd party dependencies. Specifically, I wanted to update the [self hosted development environment](/docs/tutorials/ipfs-browser-devenv/part-1) created in a previous tutorial to use a code editor. Since the required functionality was there this time I could successfully add the code editor!

### Did you accomplish more or less than the original app idea?

It felt just about right!

### Did the idea evolve or change drastically through the process? If so, how did these changes affect the outcome?

A lot of the changes happened in prior work and things come together nicely this time! 

## What was the process like?

### Describe making the app
Once again it was an iterative process, but with less restarts this time! [The tutorial](https://agregore.mauve.moe/docs/tutorials/ipfs-3rdparty-dep/) is short and sweet, but the payoff feels good at the end having a code editor with syntax highlighting and other features!

Some reflection on the process:

- **What went well?**: The groundwork paid off and this time I could get to what I wanted to do without many detours.
- **What took a lot of time?**: Initially I wanted to use [CodeMirror](https://codemirror.net/), but to make it work I had to create a custom package using rollup. I ended up switching to ACE which was much easier to use.
- **Did you find anything else to be unexpected about making the app?**: It was really easy integrating ACE, I was expecting it to be more work. That said, each 3rd party dependency will have it's own caveats, some will be an easy one file addition, while others might require you to specifically package them.
- **If you could give yourself advice when you started making the app, what would you tell yourself?**: Be fine with keeping it simple. There is constantly the temptation to just add one more thing, don't.

## Discussion

### Future improvements and ideas

The upload feature still lacks progress feedback which is not ideal when uploading many files.

### Suggestions for Agregore or the underlying protocols

Working with in Agregore and storing files in a local node is a fun and easy way to play around with code without having to run the code somewhere (aka setting up a server/hosting environment). It could be a useful tool for people just getting started with HTML and web development!

[JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) hosted on IPFS seems like it should be a great match, but I ran into several problems when I tried to use ESM builds from CodeMirror and had to use rollup to build a custom esm package that included all the needed parts without any conflicts or duplicates. It seems worth investigating if there is a way to resolve the issues I encountered.

## Conclusion

Things played out well this time round! I hope the code editor and tutorials prove useful for someone.
