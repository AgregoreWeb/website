# IPFS + Chromium = Agregore Mobile

This is the first in a series of blog posts about Agregore Mobile's development.
In this post we will be looking at how we got the initial version of the browser compiling and some of the challenges we faced in getting IPFS working with our fork of the Chromium Browser.

## Compiling and DeGoogling Chromium

One of the first steps of building Agregore Mobile was to choose a web browser engine to build on top of.
Since the [desktop](https://github.com/AgregoreWeb/agregore-browser/) version of Agregore is based on the [Electron.js](https://www.electronjs.org/) framework, which in turn is built on top of Chromium, we opted to use [Chromium for Android](https://www.chromium.org/chromium-projects/) as the basis of our browser.

However, we wanted to have a more private experience out of the box and to get rid of some of the Google-isms plus add some ad blocking and extension functionality to make it closer to the desktop experience.

### Kiwi Browser

With that in mind, we set out to make use of the [Kiwi browser](https://kiwibrowser.com/) as our basis since it offered a few features out of the box:

- Built-in ad blocking functionality and other privacy preserving features.
- Github Actions based workflow for compiling the browser
- Web Extension support
- Built in devtools

This seemed great on paper, and this is what we pitched in our initial [devgrant proposal](https://github.com/ipfs/devgrants/blob/ef3ac96d6aab4d498b2ecd4cd9f7d99fb29ba2a1/open-grants/open-proposal-agregore-mobile.md#milestone-4-example-app-showcasing-sharing-data), however once we actually started it turned out that there were some things in the way.

The main thing that drew us to Kiwi (other than it's actual features) was their [Github Actions](https://github.com/features/actions) based workflow.
Chromium is a huge pain in the ass to work with due to it only being supported to compile on Ubuntu 18 and requiring at least 33 GB of space (for sparse clones!) for the repo (in practice it was more lik 76 GB).
Kiwi's [latest build](https://github.com/kiwibrowser/src.next/) made use of a build server that would be notified of changes via Github Actions on a commit, and would then compile and publish APKs without needing to set up infrastructure on your own.
It also enabled sparsely tracking just the parts of Chromium that are going to be modified and let developers drastically save on space when cloning the repository to add their changes.

The thing we didn't anticipate was that this build server would only work within the Kiwi repo and that the source code for the server wouldn't get published anywhere.
This meant that in order to compile Kiwi, we needed to set up our own build server without necessarily knowing what was required to make it possible.

We spent about two weeks trying to get an initial build working which ended up delaying our timeline significantly.
Eventually, we had to abandon the idea of using Kiwi when we found out that [there were a bunch of source files that weren't actually in the source tree](https://github.com/kiwibrowser/src.next/issues/411) and that the build could not be made without them.

Another concern was that there were manual exceptions in the ad blocker code to allow [Google, Bing, Yahoo, and some other advertisers](https://github.com/kiwibrowser/src.next/blob/kiwi/third_party/blink/renderer/core/layout/layout_object.cc#L306) to show their ads regardless.

### Chromium

Instead we focused on getting raw Chromium to compile at all.

After setting up a beefy 8 GB RAM + 260 GB disk VM on Digital Ocean, we started following the [official documentation](https://chromium.googlesource.com/chromium/src/+/master/docs/android_build_instructions.md) for compiling Chromium.
We made a decent amount of progress, but ended up running into some build issues related to the python version that came with our Ubuntu 18 machine.

Specifically, the file `/chromium/src/tools/android/modularization/convenience/lookup_dep.py` was trying to load a module called `dataclasses` which wasn't actually available.
We opted to do a dirty hack to keep things running by copying the module's source from `/usr/local/lib/python2.7/dist-packages/dataclasses.py` directly into this folder so it would be able to run.
Generally, Chromium's build tooling is supposed to install and manage its own dependencies, but for some reason it didn't for this case. 🤷

Another issue was a syntax error inside `/chromium/src/build/android/gyp/compile_resources.py` on line 835 where it used the syntax `{exit_code=}` inside a f-strings template.
This is likely another python version-specific issue which we worked around by changing the code to say `{exit_code}` without the extra `=`.

Huge thanks to [@madrets](https://github.com/AgregoreWeb/agregore-mobile/issues/8#issuecomment-1060942366) for figuring these things out!

### Bromite

After getting the initial version working, we started looking at workflows for how to apply patches, and at other browsers we could use to improve privacy.

From some searching we found [Bromite](https://www.bromite.org/) which adds a bunch of privacy-enhancing features on top of Chromium, but doesn't add too many bells and whistles outside of that.

It uses a [git patch](https://mindmajix.com/patch-workflows-git) based workflow, where each feature they create is put into a separate [patch file](https://github.com/bromite/bromite/tree/master/build/patches) and then applied over top of the chrome source.

This makes it easier to send around patches to other projects and to apply them over top of chromium without needing to worry about preserving git history.

We took a similar approach by automating the process in Agregore Mobile and having scripts to [generate](https://github.com/AgregoreWeb/agregore-mobile/blob/default/generate_patch.py) and [apply](https://github.com/AgregoreWeb/agregore-mobile/blob/default/apply_agregore_patches.py) patches.

### Final build structure

Our build process ended up looking like this:

- Clone and set up a `chromium/src` repository within the Agregore Mobile repository
- Clone and set up a `bromite` repository within the Agregore Mobile repository
- Checkout the correct version of Chromium that Bromite is currently building on
- Apply Bromite's patch list (excluded some things we don't need) on top
- Apply Agregore's patch list on top of that
- Trigger a regular Chromium build within the `chromium/src` folder
- Copy the APK somewhere and use it.

This is done using a bunch of python scripts so that folks could run them on their machines as well as some docs on different workflows for using the scripts.

Ultimately we're planning to abstract some of this away within a custom [build server](https://github.com/AgregoreWeb/mobile-build-server) which would make it easier to provision a virtual machine with all the required dependencies to make builds possible.
But in the meantime it should be possible to clone the [agregore-mobile](https://github.com/AgregoreWeb/agregore-mobile) repo, run `setup.py`, and trigger a build with `build.py`.

## Getting IPFS into an Android app

The next part that took a while to figure out was how we could actually run an IPFS gateway from within the Chromium application.

### Getting it to run

Initially, we planned to compile a custom version of the gateway into a standalone executable which we would run on Android.

However, due to some changes in Android 10 for "security" this method became impossible
Initially we tried to hide the binary as a native library dependency to try to run it that way, but this approach also didn't work.

Eventually we settled on compiling the gateway with [Gomobile](https://pkg.go.dev/golang.org/x/mobile/cmd/gomobile) into a regular Java module within an AAR which used JNI to invoke Go methods.
This can be found in our [agregore-ipfs-daemon](https://github.com/AgregoreWeb/agregore-ipfs-daemon/) code, and particularly in the [Releases](https://github.com/AgregoreWeb/agregore-ipfs-daemon/releases) page.
This was then added to Chromium via a [Patch](https://github.com/AgregoreWeb/agregore-mobile/blob/9e7fc70d94ec7ba731928657394bb6992e484f42/patches/0001-AG-IPFS-Daemon.patch) which created a new `third_party` folder in chromium with metadata about the AAR, added it to the relevant `BUILD.gn` files to be tracked in the build, and via a [python script] which downloads the relevant AAR file at runtime.
We split out the AAR with the data itself from the patch that adds support to chromium so that we could reduce the overall size of the patch and the git repo in general.

### Multicast-DNS quirks

Getting the gateway into a binary wasn't enough however.
We also needed to address some issues with Gomobile no longer being able to access some APIs necessary to get a [list of network interfaces](https://github.com/golang/go/issues/40569#issuecomment-1050381441).

We worked around this by getting the list of interfaces within [Java code](https://github.com/AgregoreWeb/agregore-ipfs-daemon/blob/main/get_interfaces.java#L36) and then passing the data to the gateway when it boots up.

Android also started requiring that any usage of multicast UDP sockets, would require calling the [MulticastLock](https://developer.android.com/reference/android/net/wifi/WifiManager.MulticastLock) API in order to configure the network stack to actually process them.
This functionality is disabled by default on most phones in order to reduce overall network traffic that gets processed in order to save battery.

Finally, we also needed to set up a fork of the [mdns service](https://github.com/AgregoreWeb/agregore-ipfs-daemon/blob/main/gateway/gateway.go#L366) to account for these interface changes.

### Gateway specification

One of the cool things of making our own gateway is that we could enable features that aren't available by default, particularly all the features of the [IPFS protocol handlers in Agregore Desktop](https://github.com/AgregoreWeb/agregore-browser/blob/master/docs/Fetch-IPFS.md).

Some of these features:

- Ability to use `POST`/`PUT`/`DELETE` with IPNS and IPFS for uploading and updating data
- Ability to use FormData for uploading several files at once
- libp2p pubsub in a protocol handler to make it available to web apps
- etc

You can find the full spec of the features we added [here](https://github.com/AgregoreWeb/agregore-ipfs-daemon/pull/4/files) and the eventual goal is to get this functionality upstreamed into the official IPFS gateway and into other browsers.

Huge thanks to [@Makeworld](https://github.com/makeworld-the-better-one) for all the hard work on getting the gateway working so effectively!

## Next Steps

With this in place we were able to get an initial version of the browser working which could enable us to load data from IPFS using a fully local node.

Our next steps were to look into wiring up the gateway to `ipfs://` and `ipns://` protocol handlers, and to add the ability to connect phones together using ad-hoc WiFi access points.

Stay tuned for the next blog post by following [@AgregoreBrowser](https://twitter.com/AgregoreBrowser/) on Twitter for updates, or join us on [Matrix](https://matrix.to/#/#agregore:mauve.moe) or [Discord](https://discord.gg/QMthd4Y) if you'd like to chat.

---

Last Updated: 2022/04/26 by [Mauve](https://blog.mauve.moe)
