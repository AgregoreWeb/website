# Agregore Web Apps and Tutorials Process

## Summary

This document is part of a [devgrant](https://github.com/ipfs/devgrants/pull/245) with the [Filecoin Foundation](https://fil.org/) for making demos and tutorials for making and using p2p web apps using [IPFS](https://ipfs.tech/) via [Agregore's](https://agregore.mauve.moe/) p2p protocol handler APIs.

The goal of this document is it outline the process we'll be taking for creating small web apps, making tutorials for the web apps, and writing up retrospectives on what we learn from the process.

However, if you're interested in following the process to make your own app or tutorial, this document can give you a nice start.

## Making Apps

### Guidelines for apps

The main guidline when making apps is to think small.
Ideally want to have things that a person can create in an evening and have some easy wins along the way.
In order to make that more straightforward we'll have a few constraints on the code.

1: Aim to make something that would be useful and or fun at the end.
Something which a person might want to use beyond the tutorial or that has room for growth for people to tinker with further.
If it's a note taking app, maybe give them ideas for how to aggregate notes or add custom formatting or text editing functionality.
Useful doesn't necessarily mean that it has to be utilitarian. Apps that exist to be fun to make and play with are also encouraged since the web is useful tool for people to express themselves.

2: Avoid external dependencies unless absolutely necessary.
This means reducing your dependency on external CSS and JS libraries like Bootstrap or JQuery. If a library is absolutely necessary (say you're doing stuff with QR code reading and generation), then prefer to show users how to download source files and add them directly to their app's files. This is important to ensure that all the apps we build are fully local first and can load without depending on the cloud. Note that when prompting users to download libraries, you should be specific about which version to use to avoid trouble in the future.

3: Use the web platform and it's built in APIs.
This means using stuff like Custom Elements for making reusable components.
Showing people how to use built in CSS features such as [Sticky Headers](https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky). There's a lot of cool stuff built into browsers and we can get pretty far by showing people how to use this stuff.

4: Avoid using any build tools like webpack/react/npm/etc.
Users should be able to install Agregore, and get going on adding code without needing to worry about additional dependencies or build tools.
Ideally, it should be possible for a person to start off with either Agregore's built in Chromium DevTools, or to use some of the small apps developed as part of these docs.

5: Avoid depending on centralized servers whenever possible.
Sometimes you might want to pull data from a server for something like an RSS reader, but you should make sure that your app will at least load, or hopefully be useful in some way if that server isn't available.

6: When possible, try using Agregore's built in [theming support](./theming).
This might involve importing the user-configurable CSS variables from `agregore://theme/vars.css` to add splashes of color, or using the entire `agregore://theme/style.css` file to add default styling to headers and code blocks.
This is useful to give apps a similar "agregore-y" look and feel and gives users the option to configure the styles of all the apps they use on the local-first web by modifying their Agregore config with custom colors.

These aren't hard restrictions and you're free to break outside of them whenever you see fit, but their main purpose is to keep things simple and to keep the apps local-first as much as we can.


### Process

 1. Describe the idea briefly
 2. Create at least one user story
    - e.g. Sammy wants to keep notes on recipes. They go to ipns://cooknot.es to start a notebook. From here they can search for recipes to notate. When they select a recipe a note with the date and a link to the recipe is created
 3. Outline your concept. This could be the app ux, architecture, a description, a wireframe or mockups;
    - This should define what the prototype needs to have at a minimum (think about what accomplishes the goal vs. what you can do in two weeks!).
    -  List anticipated features / challenges  e.g. read from external ipfs directory for recipes, save notes to ipfs, create new key for ipns address of site, structure notes, list notes, etc....
 4. Get feedback from the team
 5. If there are any blockers, discuss what you need with the team to move forward.
 6. If no blockers remain, make the app!

We want to explore how long it takes devs of different backgrounds to make apps with these P2P protocols. So we'll timebox the apps at three weeks; roughly two to make the apps and then one to finish up the tutorial and write up retrospectives.

## Making Tutorials

### Some guidelines:

Tutorials should be easy to follow.
* There should always be a clear next step.
* Common issues should be called out and visually distinct.

Err on the side of usability.
* A complete beginner should be able to follow the tutorial but someone with more experience should get something out of it too.

Give the reader a steady path of small wins.
* Be generous with steps that let the reader change the code, refresh the page, and see something new.

A programming tutorial should not only teach you to accomplish a goal, but to debug along the way.
* One useful interactive technique is to "follow the error". Your tutorial moves forward with intuition as one might when programming, and so you have the reader run into the same errors you might. The learner can see the error message and what caused it, and follow the tutorial for the fix.

We want to teach people how to design things, and don't need to spend time teaching people the web.
- Start out showing the reader what they're designing, and how they can write and designing their own idea.
- Link out a lot to MDN for more technical resources.

## Presenting Your App (Retrospectives)

#### What was the outcome?

1. To share your app with the group, first walk us through the original goal and what you ended up making. 
2. Did you accomplish more or less than the original app idea? If you started out with a user story, were those aims accomplished? 
3. Did the idea evolve or change drastically through the process? If so, how did these changes affect the outcome?

#### What was the process like?

1. Describe making the app. Link to the tutorial here.
2. What else was notable about the process? Some discussion questions:
- What went well?
- What took a lot of time?
- Did you find anything else to be unexpected about making the app?
- If you could give yourself advice when you started making the app, what would you tell yourself?

#### Discussion

1. What would you do with this app if you kept working on it? E.g. future improvements? Demo it with users (if so, who would the users be)?  
2. If any technical improvements to Agregore or the underlying protocols could make development easier for this app, please describe them here.


## Publishing

At the end of each sprint we will be publishing the tutorials on the Agregore [docs](https://agregore.mauve.moe/docs/) section of the website, and the retrospectives on the [Blog](https://agregore.mauve.moe/blog/) section. This will be done by submitting pull requests to the [Website's github repo](https://github.com/AgregoreWeb/website/) which will then auto-publish to the site upon merging.

The source code for all the apps will be licensed under the [MIT License](https://en.wikipedia.org/wiki/MIT_License) so that it may be reused by others for any purpose.
