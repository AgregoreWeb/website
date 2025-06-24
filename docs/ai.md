## 🤖 AI and LLM APIs 🤖

Agregore enables P2P web apps to access user configurable Large Language Model APIS that are modelled after the text completion features in OpenAI.

Unlike other browsers that provide a chat interface, that accesses the browser, we leave it up to web apps and extensions to do whatever they want while keeping control over the model to the user.

As well, instead of onboarding you onto an expensive and [environment killing](https://impactclimate.mit.edu/2024/04/10/considering-the-environmental-impacts-of-generative-ai-to-spark-responsible-development/) cloud based LLM, we default to using a local [ollama](https://ollama.com/) install and a default 3B model that can be run locally on most consumer hardware. These models are a bit less effective at complex tasks but they take orders of magnitude less power, work fully offline (after initial setup) and keep all your conversations private.

You can extend [this example app](/apps/scratchpad.html?url=/docs/examples/llm-chat.html) to create your own AI powered chat.

### Setting up ollama

Before you can run local models you will want to set up [ollama](https://ollama.com/download) on your computer. In the future we may integrate it directly into Agregore, if you want this feature, please [open an issue on our Github repository](https://github.com/AgregoreWeb/agregore-browser/issues/new).

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

From there you can test that it's running by navigating to the [models list](http://127.0.0.1:11434/v1/models).

Note that the first time the LLM API is used it will download the configured `model` if it is not already downloaded. This will prompt the user before downloading and notify them when the download is done.

### API 📜

#### `window.llm.isSupported`

```javascript
if(await window.llm?.isSupported()) {
    // Use APIs here
} else {
    alert("This website requires Agregore's LLM API")
}
```

#### `window.llm.chat`

```javascript
let messages = [
        {role: 'system', content: 'You are a friendly AI assistant that likes to ramble about cats'},
        {role: 'user', content: 'What is your favorite thing?'}
    ]

const {role, content} = await window.llm.chat({
    // this is mandatory
    messages,
    // this is optional
    maxTokens: 1337,
    temperature: 0.9,
    stop: ["cat"]
})

// Now you can loop and keep a convo history
messages.push({role, content})
```

#### `window.llm.complete`

```javascript
const text = await window.llm.complete('The capital of Canada is', {
      // this is optional
    maxTokens: 1337,
    // remove this and use the default unless you know what you're doing
    temperature: 0.9,
    stop: [" "]
})
```

### Streaming `window.llm.chat`

```javascript
const element = document.querySelector('.content')

let messages = [
  {role: 'system', content: 'You are a friendly AI assistant that likes to ramble about cats'},
  {role: 'user', content: 'Tell me a long-winded story so I can fall asleep.'}
]

// Instead of await, you can go one word at a time using for-await-of
for await(const {role, content} of await window.llm.chat({
  messages
})) {
  element.innerText += content
}
```

### Configuring ️✏️

You can configure your settings in your `.agregorerc` file which you can open with `Help > Edit Configuration File`.

```json
{
  "llm": {
    "enabled": true,
    "baseURL": "http://127.0.0.1:11434/v1/",
    "apiKey": "ollama",
    "model": "qwen2.5-coder"
  }
}
```

IF you don't want pages to access this feature at all, set `llm.enabled` to `false` and it'll auto deny any requests.

#### Ollama Models

If you're curious to try out different models, check out the list available in the [Ollama Library](https://ollama.com/library).

#### OpenAI

If your computer is very weak or if you're set on using the fancier cloud models, you can make use of [OpenAI](https://openai.com/) awnd their available models.

First you should replace the `llm.apiKey` config in your `.agregorerc` with [an OpenAI API key](https://platform.openai.com/api-keys), and then replace the `llm.baseURL` field with `https://api.openai.com/v1/`. You will also want to choose a `model` to use like `gpt-4o-mini` from the [list on their website](https://platform.openai.com/docs/models).
