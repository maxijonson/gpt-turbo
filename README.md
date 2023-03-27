# GPT Turbo

OpenAI's GPT Chat Completion API allows you to generate conversational text from a prompt just like the [ChatGPT Plus subscription](https://openai.com/blog/chatgpt-plus). The difference between ChatGPT Plus and the this API is mainly the price. At the time of writing, ChatGPT Plus is a flat US$20 per month, while its API counterpart is US$0.002 per 1K [tokens](https://platform.openai.com/docs/introduction/tokens). This means that if you don't plan on using more than 10M tokens per month (and the limitations listed below), you could potentially save money by using the Chat Completion API instead of the ChatGPT Plus subscription. 

This monorepo contains implementations of the Chat Completion API in different JavaScript environments. The main implementation is the `gpt-turbo` library, which is used by the other implementations and can be used in your own projects. 

## Disclaimer

Implementations are provided as-is. I am not responsible for any accidental, incidental, special, consequential, or exemplary damages, including without limitation, damages for loss of profits, goodwill, use, data or other intangible losses, resulting from the use of the implementations. Use at your own risk. [Set limits](https://platform.openai.com/account/billing/limits) on OpenAI's billing page to avoid unexpected charges.

## Features

- Interact with any of OpenAI's Chat Completion models, including **GPT-4**, if you have access to it. 
  - Full list of models [here](https://platform.openai.com/docs/models/model-endpoint-compatibility)
- Keeps track of message history sent to OpenAI's API to enable conversation continuation.
- Easily access the estimated cost of your conversations before sending them to OpenAI's API.
- Easily access the estimated cost of the cumulative usage of your conversation as it progresses.
- Built with entirely with TypeScript

## Pre-requisites

Since Chat Completion models are paid, you'll need an [OpenAI API key](https://platform.openai.com/account/api-keys) and [setup billing information](https://platform.openai.com/account/billing/overview). Make sure to [set a usage limit](https://platform.openai.com/account/billing/limits) to avoid unexpected charges.

Since this a JavaScript monorepo, you'll need to have [Node.js](https://nodejs.org/en/) installed.

## Implementations

Most implementations were made following this guide: [OpenAI Docs: Chat completion](https://platform.openai.com/docs/guides/chat). Check out each of their respective folder for more information on how to use them.

- [Library](./packages/lib/): A JavaScript library that allows you to interact with the Chat Completion API.
- [CLI](./packages/cli/): A command-line interface for interacting with the library. (Built with React!)

## Development

This monorepo uses [Lerna](https://lerna.js.org/) to manage different implementations. Since every implementation rely on the Library, it's a good idea to watch for changes in the Library and automatically build it when changes are detected. To do so, run the following command in the root of the project (here):

```bash
npm run dev
```

This will watch for changes in the Library and automatically build it when changes are detected, making it available to the other implementations.
