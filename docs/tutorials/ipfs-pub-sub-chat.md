# IPFS PUBSUB Chat tutorial

In this tutorial you will create a simple decentralized chat app using [IPFS](https://ipfs.tech) and the [Agregore Browser](https://github.com/AgregoreWeb/agregore-browser). We will be covering some basic HTML and CSS and touch on different features of IPFS.

IPFS (which stands for Inter Planetary File System) is a network protocol that makes it possible for devices in a network to exchange data without a central server. Data is stored on devices themselves and the protocol provides a mechanism for discovering and transferring data between devices.

IPFS will be used to store the HTML, CSS and JavaScript files used for the application we're building. Additionally, we will use a feature called [PUBSUB](https://blog.ipfs.tech/25-pubsub/) to send messages between the app.

The Agregore Browser incorporates IPFS, making it possible to access a website on IPFS. In addition Agregore enables you to interact with the local IPFS node, making it possible to do more than just a static website! To complete this tutorial, you need to download the Agregore Browser [here](https://github.com/AgregoreWeb/agregore-browser/releases). version 2.3.0 was used for this tutorial, but a later version should also work.

In a previous [tutorial](https://agregore.mauve.moe/docs/tutorials/ipfs-browser-devenv/part-1) we created a [self-contained website template + development environment](https://agregore.mauve.moe/docs/examples/browser-devenv/) and we will use it as a starting point. You don't need to complete that tutorial to continue.

Open [the template](https://agregore.mauve.moe/docs/examples/browser-devenv/) in the Agregore Browser and click start. It might take a few moment while Agregore starts up an IPFS node that will be used to store your files for this site.

This is what you'll see:

![](./ipfsdevenv.png)

If you click on "Show Editor", an editor modal should open. On the left hand side are all the files that are part of the site, currently only `index.html` and `lib.js`. If you click on one of these two filenames, it will open the file for you to edit. When you click on "Save" at the bottom, your updated content will be saved in a new IPFS folder and the site will reload to display you the updated website.

Before we get to the app itself, let's make a few small changes to the editor. We don't want the "Edit" button to be part of our site, but we still want to be able to open the editor. Click on 'lib.js' and add the following code at the end of the file:

```javascript
window.addEventListener('load', e => {
    document.addEventListener('keydown', e => {
        if( e.ctrlKey && e.key == 'i' ){
            showEditor().catch(console.error)
        }
    })
})
```

This code will execute when the document loads (line 1), add an event listener for key events (line 2) and if the `Ctrl` and `i` are both pressed at the same time, we open up the editor (line 3 & 4). Save the file and test opening up the editor by pressing Ctrl and i at the same time. Now we can remove the button whenever we want.

Now lets update the HTML for the app and remove that button. Open `index.html` and update the content accordingly:

```html
<!DOCTYPE html>
<html>
  <head><title>PUBSUB chat</title></head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <body>
    <div class="container" id="setup">
      <h1>IPFS PUBSUB chat</h1>
      <form id="roomNameForm">
        <input name="channelName" id="channelNameInput" placeholder="Pick a room name" />
        <p><button type="submit">Set name</button></p>
      </form>
    </div>
    <script src="lib.js"></script> 
  </body>
</html>
```

Save. Now we have the basic elements, let's update the way they are displayed by creating a style sheet. Open the editor, but instead of opening a file this time, type `style.css` in the filename field and add the following content.

```css
html, body {
    height: 100%;
    margin: 0;
}
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: center;
}
```

Once you've saved this, you'll notice it didn't have any effect. We need to add a link to the CSS in the `index.html`. Add the following code right after the `meta` tag:

```html
  <link rel="stylesheet" href="style.css" />
```

Next we'll start adding some functionality. When a user enters a room name and clicks the button, we want to start an IPFS PUBSUB channel with the given name. PUBSUB works on the concept that you can subscribe to a named channel to receive any data published to that channel.

Create a new file `pubsub.js` and add the following content

```javascript
window.addEventListener('load', (event) => {
    const form = document.getElementById('roomNameForm')
    form.addEventListener('submit', event => {
        event.preventDefault()
        const channelName = document.getElementById('channelNameInput').value
        console.log('Set room name: ', channelName)
    })
})
```

Now add the new script to `index.html` by adding

```html
    <script src="pubsub.js"></script>
```

You can open the dev tools to see if the room name is indeed logged to the console.

Now that we have a room name, we need to create a PUBSUB connection for receiving messages.

We will create a class that will setup and handle the PUBSUB connection for us. Start by creating the call called `PubSub` and store the channel name. Add the following in `pubsub.js`.

```
class PubSub {
    constructor(channelName){
        this.channelName=channelName
    }
}
```

To subscribe to a PUBSUB channel/topic in Agregore you need to use the [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) interface. `EventSource` establishes a connection with the IPFS node and gives you callbacks `onopen`, `onmessage` and `onerror`. To create the event source and listen for messages, add the following methods to the PubSub class

```
   async listenForMsg() {
        let es = new EventSource(`pubsub://${this.channelName}/?format=json`)
        es.onmessage = this.onmessage
        es.onopen = this.onopen
        es.onerror = this.onerror
    }

    onopen(e) {
        console.log('onOpen', e)
    }

    onmessage(e) {
        console.log('onmessage', e)
    }

    onerror(e) {
        console.log('onmessage', e)
    }
```

Let's hook this up to the submit callback for setting the room name. Update the callback in `pubsub.js` as follows:

```
window.addEventListener('load', (event) => {
    const form = document.getElementById('roomNameForm')
    form.addEventListener('submit', event => {
        event.preventDefault()
        const channelName = document.getElementById('channelNameInput').value
        console.log('start pubsub', channelName)
        window.pubsub = new PubSub(channelName)
        window.pubsub.listenForMsg().catch(console.error)
    })
})
```

This creates an EventSource with the channelName we've chosen and then installs callbacks for each of the different callbacks.

If you now set a room name, you should see the log message for `onOpen` in the console. 

To test if it's working, send a message in the console using fetch:

```javascript
fetch(`pubsub://${window.pubsub.channelName}/`, {method: 'POST', body: JSON.stringify({'msg': 'test'})})
```

If you look at the data property of the MessageEvent, you'll see some json like this:

```json
{   
    "from":"12D3KooWRerqXAocomr2RC9otQAhRUzuG7YsMLs3FgKnoJ8UJDPX",
    "data": {
        "msg":"test"
    }
}
```

The `from` property (our own address) is the node address that sent the PUBSUB message and the data we passed as the body in the `data` property. And from this we see that we're receiving messages that we are sending.

The from address isn't accessible anywhere else, so we need to first send a message before we can determine what our address is. We can send this message when the connection is established. To make sure that we are getting the address from our own message, we will generate a random value include it in the message. Update `onopen` in `PubSub`:

```js
class PubSub {
    //...

    onopen(e) {
        console.log('onOpen', e)
        this.myRand = Math.random()
        let message = {msg: "hello", rnd: this.myRand}
        fetch(`pubsub://${this.channelName}/`, {
            method: 'POST',
            body: JSON.stringify(message),
        }).catch(console.error)
    }

    //...
}
```

There is a subtle error here. The `this` variable in the `opopen` method doesn't refer to the this we'd expect - the `PubSub` instance we've created. Instead it refers to the EventSource. We can fix this by binding this in the class constructor for the methods:

```javascript
class PubSub {
    constructor(channelName){
        this.channelName = channelName
        this.onopen = this.onopen.bind(this)
        this.onmessage = this.onmessage.bind(this)
        this.onerror = this.onerror.bind(this)
    }

    //...
}
``` 
ipfs://bafybeigluaugn5nzjb6xattprvsylrvhlidpwxawz4rimnkapxfssmse4e/
ipfs://bafybeiawi7rujscm4ynagb7s56nphvzcoo2qpgxvs3c5k5b23o6hqskppa/#

You can read more about how this binding [on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this).

Now when we receive our message, we can save the from address. Let's update the `onmessage` callback to save our own address.

```js
class PubSub {
    //...

    onmessage(e) {
        console.log('onmessage', e)
        try {
            let msg = JSON.parse(e.data)
            if (!this.whoami && msg.data.rnd && msg.data.rnd == this.myRand){
                console.log('Hello from myself. Yay!')
                this.whoami = data.from
            } else (msg.data.rnd && msg.data.rnd != this.myRand ){
                console.log('Hello from a friend!')
            }
        } catch (error) {
            console.log(error)
        }
    }

    //...
}
```

If we don't already have our own address saved in `whoami`  we compare the random value in the message to the value we generated, if that matches, then we can store the from address as our own address.

Now that we have the basic plumbing set up to send messages, we can link it up to the interface to create a basic messaging application!

Add the following html to `index.html`:

```html
    <div class="container hidden" id="chat">
        <h1 id="roomName">Room name</h1>
        <textarea readonly></textarea>
        <form id="chatForm">
            <input id="messageInput" placeholder="Type your message here" />
            <button type="submit">Send</button>
        </form>
    </div>
```

We also need to update the CSS

```css
.hidden {
    display: none;
}

#chat textarea {
    flex-grow: 1;
    margin-bottom: 1em;
    width: 80%;
}

#chatForm {
    display: flex;
    width: 80%;
    margin-bottom: 1em;
}

#messageInput {
    flex-grow: 1;
    line-height: 1.7;
}
```

To display the chat interface and hide the initial room name interface, we add some extra code once a connection is established. We also add a callback to send a message and clear the input field when we hit enter of click send:

```javascript
    onopen(e) {

        // ...

        document.getElementById('setup').classList.add('hidden')
        document.getElementById('chat').classList.remove('hidden')
        document.getElementById('roomName').innerHTML = this.channelName
        document.querySelector('#chatForm').addEventListener('submit', e => {
            e.preventDefault()
            let textInput = document.querySelector('#chat input')
            fetch(`pubsub://${this.channelName}/`, {
                method: 'POST',
                body: JSON.stringify({message: textInput.value}),
            }).catch(console.error)
            textInput.value = ''
        })
    }
```

And finally we should handle message we are receiving and add it to the chat display:

```javascript
    onmessage(e) {
        console.log('onmessage', e)
        try {
            let msg = JSON.parse(e.data)
            if (!this.whoami && msg.data.rnd && msg.data.rnd == this.myRand){
                console.log('Hello from myself. Yay!')
                this.whoami = msg.from
            } else (msg.data.rnd && msg.data.rnd != this.myRand ){
                console.log('Hello from a friend!')
            } else {
                let textarea = document.querySelector('#chat textarea')
                textarea.value = textarea.value + `\n> ${msg.from}: ${msg.data.message}`
            }
        } catch (error) {
            console.log(error)
        }
    }
```

If you haven't already, open up Agregore Browser on a different device and navigate to the ipfs:// URL of your application. If you choose the same channel name, you should be able to chat with each other!!


End result of tutorial: ipfs://bafybeifcnneyw2gp7cqtiltab44jsf6zzkpakxvx7kwxary6dsax5462na/
Premade ex. ipfs://bafybeiawi7rujscm4ynagb7s56nphvzcoo2qpgxvs3c5k5b23o6hqskppa/

