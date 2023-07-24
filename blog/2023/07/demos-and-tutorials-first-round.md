# Agregore Demos and Tutorials Round One

After working on it for a few months we've finished our first milestone for our [Demos and Tutorials devgrant](/2023/01/demos-and-tutorials-announcement)!
As outputs from this we have two tutorials, and 4 small apps for folks to try out.

## What we made

### Dirk's DBrowser Development Environment

[@DirkCuys](https://github.com/dirkcuys) put together a step by step guide for bootstrapping a development environment from just the devtools interface in Agregore.
You can see a live version of the final app [here](/docs/examples/browser-devenv/) or follow step by step from the [tutoial](/docs/tutorials/ipfs-browser-devenv/part-1).
This app builds up from uploading your logic via devtools all the way to a fully fledgged GUI which you can use to edit files within your IPFS sites.

### Ankeet's Blocks App

[@sudocurse](https://github.com/sudocurse) made an "app laucher" where you can track a list of linksand open them up.
The original source code can be found [on GitHub](https://github.com/sudocurse/agregore-blocks-app) and you can see a live demo of a touched up version that automatically publishes your links on IPFS [on the website](/docs/examples/blocks-app/).
This app makes use of raw DOM APIs to dynamically construct the page.
The live code also contains reusable bits for cloning a page into a new IPNS site.

### Judy's Game TODO List

[@JudyTuna](https://github.com/judytuna) put together a TODO list for managing the games she's planning to play.
You can find the source code [on GitHub](https://github.com/judytuna/ipfs-multido) or published [on IPNS](ipns://k51qzi5uqu5dkwoi3kwuekamipebnng03h8qhqblf9xcazdcu2ytn45bgu4ev4).
This app was made as a single HTML file and uses a bash script for publishing it to IPFS via Agregore's built in daemon.

### Caprice's Theme Builder

Lastly, [@CapriceEsmas](https://github.com/capriceesmas) put together a small theme editor so you can customize the look and feel of Agregore and any apps using [Agregore's theme system](/docs/theming).
You can see a live version of the tool [here](/docs/examples/themebuilder.html) or follow along with their tutorial [here](/docs/tutorials/themebuilder-tutorial).
Caprice took a step by step approach of adding small bits of Javascript/CSS/HTML together to add functionality to the theme builder within a single HTML file.
What's cool in particular is that you can export the theme as a `.agregorerc` file and apply the theme accross the entire app and any apps we publish with our tutorials.

## Reflections

Overall folks had an easy time progressing on their apps once they got going and didn't need to change too drastically throughout.
Some learned lessons were to focus on smaller pieces and not get too hung up on the "best" way to do things from the get go.
Keeping a target audience for tutorials will be useful for knowing how technical one should go and how much explaining of basics should be done.
There was a bit of trouble in understanding how to best use IPFS and IPNS and how to integrate the example apps with Agregore's unique functionality.
In particular there was an obvious need to have an easier graphical way to upload files from a folder into IPFS for when folks were developing apps as text files from their OS's text editor.
Having a nice way to get a live preview foor the app also seemed important.

## Next Round

Based on what we learned from these first few apps we now have a better picture of the sorts of apps we want to build for the next round and the sorts of approache's we'll take to make the apps and tutorials.
If you'd like to stay up to date, come join us on the [Agregore Matrix Channel](https://matrix.to/#/#agregore:mauve.moe) or follow our [website GitHub repo](https://github.com/AgregoreWeb/website) to keep track of changes.

----

## Reflections: Raw

This section contains the raw response for the reflections portion of our process.

#### What was the outcome?

1. To share your app with the group, first walk us through the original goal and what you ended up making.

Dirk: The original goal was to bootstrap a simple development environment for a mobile website/app using only the Agregore Browser.

Cap: I wanted a simple one page app with colour pickers that changed the value of CSS variables (which were then visually reflected on the site). I then wanted a way for the user to have a way to "save" their changes and use them elsewhere.
Cap: In the end I had just that, using the Agregore theming, the "save" functionality came in the form of a button which downloaded the CSS (albeit in a crude form it feels).

Judy: The original goal was a multi stage TODO app. That Specifically tracked games I wanted to play and whether I could finish them. I ended up with that. It's very barebones, but it's there.

Ankeet: Originally set out to create a gallery with random pieces of media and text in a collection. Since we were all making different apps it worked very well as an app launcher. That helped me focus on a finite feature set.

2. Did you accomplish more or less than the original app idea? If you started out with a user story, were those aims accomplished?

Dirk: Yes, although the app is very basic, it has the basic components to author a site stored on IPFS and shared using IPNS.

Cap: I pretty much got everything I wanted done for the app. I did have a "user story" which was essentially describing my apps basic goal. So yes, the aims were accomplished.

Judy: Yes! Original app idea was very small, did accomplish it.

Ankeet: Stopped short of being able to put images into the app. Did pretty much everything else until then.

3. Did the idea evolve or change drastically through the process? If so, how did these changes affect the outcome?

Dirk: It scaled back a little. Initially I hoped to use more of the browser dev tools, but that proved to be difficult to integrate into a workflow that is easy to communicate.

Cap: It didn't really, no. While ideas for like, "stretch goals" came up I really wanted to focus on something basic since this was the first time I'd ever developed anything in an environment like this and I was a little rusty in general.

Judy: No. 

Ankeet: Went through different ideas of what I wanted the app to be while making it. Initially it was a gallary/scrapbooking thing. Then I thought one thign that would be cool is if a person could scan a QR code on their phone they could pull it into their phone. Then realized I'd need to do QR scanning on a phone: platform limitations. Was grappling with the concept of local-first when it came to sharing local-first stuff. At the core of it all is if you make something and I went on my phone then I could get it onto this launcher on my phone. Went in a circle.

#### What was the process like?

1. Describe making the app. Link to the tutorial here.

Dirk: I ended up making the app as I wrote the tutorial. The tutorial can be found [here](https://www.thebacklog.net/projects/agregore-web-apps/part-1)

Cap: Making the app was interesting! I guess it wasn't too eventful, the tough part was trying to figure out what my dev environment was going to be like.

Judy: I realized while making it that I didn't have any separation of content and presentation. So I rewrote it. Started out just having the stage data written down as a class. Because I was typing in devtools, I started with making a `<ul>` of video games and sticking stuff like "played", "not yet started", "playing" as a CSS class. Found that hated typing in devtools. Would ctrl+a code in editor, then paste into devtools. Edited in vs-code, loaded index.html and JS just to test it.
- edited in vscode
- loaded index.html in firefox just for javascript
- then to see if saving in agregore worked, copied index.html into agregore devtools, edited HTML, shoved new pasted code in there, then typed await save();, reloaded page, tested stuff there.
  - aka used dev tools when there was a bug or an append tiny change
  - would have to remember to copy the edits into the source of truth file in the text editor
  - this means there’s separate sources of truth - one for code, and one for data. not SUPER hard but still frictional
 - really it’s bootstrapping the app, and then playing with it in agregore. an end user might not need to modify the code so it wouldn’t matter

Ankeet: First things I realized, it wsan't as easy as I thought to edit the instance, but was super easy to copy an instance. Thought of making a "fork" button to make a copy. Having a copy was a lot easier than doing it collaboratively. Saving and pushing automatically was easier than expected. Using localStorage in the browser for data. Went through similar opinions when working in devtools. At some point it stops being fun. Switched to a script to push stuff. Didn't realize the dynamics of decentralized nature initially.

3. What else was notable about the process? Some discussion questions:
- What went well?

Dirk: It was really nice to not need lots of tools to get started

Cap: The overall process felt pretty good! I got into a decent rhythm with it and it felt like what I had to do next was pretty clear.

Judy: Really easy and fast to just get started

Ankeet: Quick to have a workflow and edit live. Have someone else be able to access the content. Immediatly other viewers would have their own user data.

- What took a lot of time?

Dirk: I had to go back and update some parts of the tutorials several times when I decided to change things

Cap: The most time consuming thing was dealing with the p2p hosting, my experience with making p2p web apps were small "hello world" type apps and so I didn't know best practices in terms of how to connect files together. (Like having an image or using a css/js file instead of it all being in one big HTML file). In the end I decided not to deal with it this time around. But hopefully I can try it out for my next app.

Judy: Trying to figure out which port the IPFS daemon was running on. Had to go back to an older version of Agregore. Also when we were running the same version, my port was different so we had to do a lot of snooping to figure out what port it was. Ankeet helped by digging through used ports and I looked through the code searching for config files where ports were set. Eventually did get it working. This was during when there was some platform changes.

Ankeet: Apart from figuring out how far I could take the idea, conceptual part was time consuming. Trying to figure out how to make it "portable". Beyond that figuring out how IPNS works. Still dont' quite get it.

- Did you find anything else to be unexpected about making the app?

Dirk: I’m a little uncertain about some of the coding in the app. The idea is to be beginner friendly, but it’s easy to run into concepts like recursion and that seems out of scope for a tutorial like this.

Cap: Can't think of anything for this one.

Judy: Realized that I accidentally reinvented a kanban board.

Ankeet: Had a lot of success with rewriting the app. Started from scratch knowing which features I needed and that made the code much cleaner.

- If you could give yourself advice when you started making the app, what would you tell yourself?

Dirk: Try and find someone in the target audience of the tutorial to provide feedback throughout.

Cap: Probably to be flexible. I spent way too long thinking about how I was going to do something a specific way when I could have just done it. Apps are not unchangeable, if I did something "wrong" I could simply fix it later or make note of it for the future.

Judy: Would have said to not just start with a list and put data on with CSS. But because I did that I  learned some things. I was thinking that in the tutorial I could start how I started but then modify it to abstract data into JS objects.

Ankeet: Don't get hung up on platform limitations as much as I did. Wanted about all the cool things that it could do if it was on platforms that it was not. Tried to make an app with that in mind.

#### Discussion

1. What would you do with this app if you kept working on it? E.g. future improvements? Demo it with users (if so, who would the users be)?

Dirk: I’d like to figure out a way to easily share and re-use code. With features like ES modules and import maps it might be possible to use existing libraries as is. It would be extremely useful to use a good code editor with better code editing support.

Cap: As it is right now, it's very barebones (which I think is good!) I think I'd like a way to load themes into it that a friend provides (to emphasize sharing themes around) and I'd like a way to like, have saved themes be on the site and loadable so you can have multiple themes to switch between (so like, imagine there are swatches on a sidebar which you can click on and then the site turns into that theme, and you can add more themes to that, I dunno if that describes it very well). I wonder too if I could merge these things into a "theme shop" kinda thing but like, not a shop!

Cap: I also was thinking about adding more customization to things, like maybe you want more theme colours than the 4 currently provided, or you want to use serif fonts for headers but sans-serif for the rest of the site. I think there is a point or a line somewhere where someone should just learn CSS? But I do think there is some usability in a *little* more customization.

Judy: I have a massive todo list here: https://github.com/judytuna/hyper-multido#todo
Mainly usability features.

Ankeet: Would have multimedia stuff. Could get QR codes scanning to work on there, that would be good.

2. If any technical improvements to Agregore or the underlying protocols could make development easier for this app, please describe them here.

Dirk: Having the ability to resolve an IPNS address would be really useful! It didn’t look like that is possible with the current js-ipfs-fetch implementation?
Dirk: I had an issue with the AppImage version of Agregore Browser where I couldn’t get the IPFS node to work between browser invocations - iow, each time I quit the browser and started it again, I had to delete the IPFS directory for the IPFS node to successfully start.

Cap: Can't think of anything at the moment.

Judy: Dirk's shell script for pushing was useful. Don't know how it would work with Agregore. Having a button that would push stuff from a folder to IPFS would be good to have. Curious how hosting should work. Where do I put the live app? Earthstar? Would I need a hyper app? Would it have to be a hybrid thing?

Ankeet: Thinking of FTP servers and how they work, would be nice to have something like that. Better deal with the IPFS stuff. Help resolve the IPNS stuff that Dirk said, but not sure how it works. Platform stuff like iOS support.
