# Considerations for P2P Web in Community Networks.

This post will talk about community networks, how they can leverage peer to peer web technology, and some of the things communities will need to consider to ensure their networks are safe.

By Dirk Uys and Eric Nitschke

## What are community networks?

Community networks (CNs) and other community-based connectivity initiatives, previously seen as fringe projects, are being increasingly recognized as one of the central ways to overcome barriers to internet access and enable un-or-underconnected (more than 3 billion people) to connect themselves.

There are innumerable models of CNs, but in general, CNs are simply networks planned, built and maintained by communities and/or community-based orgs that seek positive social change rather than ROI.  They may offer internet access, local/offline content and services (often educational in nature), tech training, or income streams through network maintenance and monitoring - but the one thing they all tend to share is a common purpose for enhancing community resilience in a world where access to information is increasingly essential for survival. 

Many CNs operate in areas where internet access is intermittent due to power issues (both electrical and political). As such, many CNs have solar-powered infrastructure and operate as local area networks in which community members can engage with each other and local content and services, regardless of access to the wider internet.

## Local Services/Content - Production & Sharing

There are several options for running services locally in a community network like [Internet in a box](https://internet-in-a-box.org/), [Yunohost](http://yunohost.org/), and [Lokal](https://wakoma.co/lokal/). Often old computers are upcycled into servers that run [self-hosted](https://github.com/awesome-selfhosted/awesome-selfhosted) and mostly open-source applications which enable users to communicate with each other, share files, steam & download media, build websites, read Wikipedia and eBooks, develop software, and so much more.
While not nearly the same as having direct access to the interwebz, it’s sometimes the next best option.  In places where backhaul is expensive, hosting services & content locally reduces the costs of operating the network (since the local traffic doesn’t count against their monthly cap).
While hosting services locally on a community network can help alleviate the need for internet connectivity, they create silos of information that cannot easily be shared outside the network and are difficult to reconcile with new information from sources outside the network.  For example, in CNs with only public hotspots or connected community buildings and spaces (instead of wifi to the home) users can stream the content when connecting to those hotspots, or download the content to their phone/device and take it home to reach/watch later.  (image of this?) 
How we make it easier to share this content between devices? How do we enable locally relevant content to be produced in local languages and shared widely, even when there is no internet or power?

## What is the peer 2 peer web?

The [Peer to Peer (P2P) web](https://en.wikipedia.org/wiki/Peer-to-peer_web_hosting) could be one answer.. Rather than relying on centralized servers and uninterrupted connectivity, information is distributed between peers (or nodes) in the network. These nodes can exchange information with each other whenever connectivity is available.

If MNOs are the large rocks in the jar, and CNs are the pebbles….peer-to-peer is the water that fills in the remaining space.

Current P2P web technologies are still in development and not widely adopted by the average user. It requires a high level of technical literacy to deploy and use and while it could be used to improve connectivity, that isn’t necessarily the prime focus.

Furthermore most user applications are developed for the model of a centralized internet. For instance, services like Wordpress and Wikipedia can easily be used in a community setting, but they don’t provide any mechanisms for dealing with decentralization.

[Agregore](https://agregore.mauve.moe/) is a project working towards improving the peer web and making it more usable by everyday users that could benefit from the distributed model. 

We received funding via the [Filecoin Foundation](https://fil.org/) from [Protocol Labs](https://protocol.ai/), the organization behind [IPFS](https://ipfs.io/), to begin the conversation about how CNs can leverage P2P web tech to increase community resilience. We developed a mobile browser capable of interacting with the peer web through IPFS, built a blogging application to demonstrate how an application can be built to run on the P2P web and added support to the Lokal platform to support IPFS in a community network as an offline service.

IPFS enables creating a peer to peer network where different nodes can share data in a well defined way. This enables the creation of a peer web where you can use a browser to visit a site with some hyper text content.

[Agregore mobile](https://github.com/AgregoreWeb/agregore-mobile/) is a browser for Android that runs an IPFS node. This allows a user to access content whenever they can make a connection to another node with the relevant content (my phone connects directly to your phone then we can share stuff).. It also allows someone to create content without requiring a connection to the internet or another node. Lack of locally relevant content in local languages is a central reason why nearly half of the world is not connected to the internet.

To demonstrate the features of Agregore mobile we developed a peer web blogging application. A user can create content on their device and share it with other users in a true peer to peer fashion over wifi direct or if both users are connected to the same wifi network.

To enable the use of IPFS in community networks we updated the Lokal services platform to include an IPFS node and pinning service. This allows users to access content pinned on the server or to add their own content on the server by pinning it.

This is still early days, but the result could be very promising.

The idea that you don’t need to be constantly connected to be able to interact usefully with the network is a powerful concept that holds lots of promise. Rather than creating islands of disconnected services, you can create a resilient network that can function despite intermittent connectivity.

## Workshop 1

With these elements developed, we had enough to concretely engage local communities to start a conversation about their needs and gather feedback. We held a [workshop in Cape Town](https://www.thebacklog.net/2022/07/12/reflections-on-running-a-p2p-web-workshop/) where we invited people from local community networks, small internet service providers, advocacy groups and the civic tech community.
During the workshop we talked about community networks, the P2P web, local challenges and opportunities.  We installed the mobile browsers on phones and tested out the blogging application.
The event was a good way to engage the people that could benefit from the use of the P2P web. It was attended by a diverse group of people and several good connections were made between people with different skills, interests and cultural backgrounds.
From running the event, we learned about peoples local needs and gained a better understanding of users’ questions and concerns regarding the peer web.

## Further Considerations for P2P in CNs

Moving forward we intend to investigate and test how communities may use technologies like IPFS to address their own connectivity challenges.  This will involve further development of tools like Agregore Mobile, applying them in innovative and collaborative ways, conducting applied research, and engaging communities in workshops and conversations (both in-person and on/off-line).

There are many remaining questions that need to be tackled by CNs related to privacy, security, moderation and administration of P2P web tech, some of which were discussed in the first workshop.

One central question is about moderation. How do we keep harmful or otherwise inappropriate content from being shared in community networks that leverage the power of P2P web?  In centralized networks it’s easy to remove harmful content or malicious participants.  The CN manager(s) simply block the MAC of the participant’s device (phone/computer/etc) or block access to certain websites (ones which serve harmful content). In peer-to-peer networks however, content is stored on and served by any and all devices, which communicate directly with each other. So, if people are using IPFS and the peer-to-peer web ‘inside’ of a community network, how do we block the bad stuff? Luckily there are some really smart people working on solutions for this.

One such solution is a system where the participants, or CN users themselves, decide on who moderates content on their behalf.  In the system, participants can automatically block malicious users and content if they discover they have already been blocked by someone they trust. “My friend says your content is harmful or malicious, and I trust my friend ‘this much’, so I’m also going to block your garbage”. Say that friend starts being shady, you can decrease or remove your trust in that person to moderate on your behalf.

[Cloudflare](https://blog.cloudflare.com/cloudflare-ipfs-safe-mode/) is also working on innovative ways to enable decentralization of content networks while preventing nodes/devices from serving/spreading harmful content. Their team has enabled secure filtering capabilities in IPFS which protects users from phishing, ransomware, and other threats. The tools make it possible to [block nodes](https://proto.school/introduction-to-libp2p) from serving malicious content, and enable each user/participant to curate their own [block lists](https://github.com/cloudflare/go-ipfs/tree/v0.9.1-safemode#build-from-source) based on what they deem appropriate. There is also a growing list of content already flagged for various reasons, called the [Bad Bits Denylist](https://badbits.dwebops.pub/), which allows “IPFS node operators (e.g. someone running a public IPFS gateway) to opt into not hosting previously flagged content”.

Community networks and the people they serve can be more resilient by using the peer-to-peer web, but we must also better understand how to collectively prevent the propagation of harmful content and participation of malicious actors. If community networks are about uplifting each other, then we must also protect each other.
