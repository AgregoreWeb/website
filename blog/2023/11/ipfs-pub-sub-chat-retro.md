#### What was the outcome?

1. To share your app with the group, first walk us through the original goal and what you ended up making.

Initially I wanted to create a video calling app using PUBSUB to do signalling and WebRTC for the audio and video. I ended up removing the WebRTC component of the app and created a chat app instead.


2. Did you accomplish more or less than the original app idea? If you started out with a user story, were those aims accomplished?

Technically I accomplished less, since text < video, but in terms of the application it introduced slightly more interface logic than the video would have required. Using WebRTC would also have required that I use a 3rd party STUN/TURN server which introduce a non-peer-to-peer element to the app.

3. Did the idea evolve or change drastically through the process? If so, how did these changes affect the outcome?

I wrote the app first with PUBSUB and WebRTC, but while writing the tutorial I realized that it was trying to cover too many topics. I decided to remove the WebRTC component and create a chat application using PUBSUB to cover a more realistic range of topics.


#### What was the process like?

1. Describe making the app. Link to the tutorial here.

As mentioned above, I started with the app before writing the tutorial. I used the development environment made in a [previous tutorial](/docs/tutorials/ipfs-browser-devenv/part-1) and it worked reasonably well, although I wished that it had a few more features. You can find the tutorial for the PUBSUB chat app [here](/docs/tutorials/ipfs-pubsub-chat)

2. What else was notable about the process? Some discussion questions:
Q: What went well? 
A: I prototyped the PUBSUB and WebRTC components previously, which made it easy to use in this app.

Q: What took a lot of time? 
A: Deciding to change the application after having written most of the tutorial required rewriting the whole tutorial.

Q: Did you find anything else to be unexpected about making the app?
A: When testing the app using two laptops, it took me a while to share the URL between the two devices since the URLs aren't easy to manually enter.

Q: If you could give yourself advice when you started making the app, what would you tell yourself?
A: Don't try to do too much!

#### Discussion

1. What would you do with this app if you kept working on it? E.g. future improvements? Demo it with users (if so, who would the users be)?
Add some features like implementing presence to give users a nickname and indicate when other people are online. Add the ability to have join more than one chat channel. Add encryption to allow private communications. Add the ability to persist chat history using IPLD.

2. If any technical improvements to Agregore or the underlying protocols could make development easier for this app, please describe them here.
A plugin for Agregore to share short readable/writeable links between devices using Agregore to avoid having to copy and paste long CIDs.

