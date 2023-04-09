<!-- omit in toc -->
# GPT Turbo

A library for interacting with OpenAI's Chat Completion API. Its main goal is to keep track of the message history through a Conversation object, which is useful to keep track of the conversation as it progresses without needing to manually keep track of the previous messages sent/received.

## Installation

```bash
npm install gpt-turbo
```

## Usage

If you want to jump right in and start a conversation with the GPT model, this is the most straightforward way to use this library.

```ts
import { Conversation } from 'gpt-turbo';

(async () => {
    const conversation = new Conversation({
        apiKey: /* Your OpenAI API key */,
    });

    const response = await conversation.prompt("What is TypeScript?");
    console.log(`Response: ${response.content}`);
})();
```

You can also stream messages like ChatGPT does.

```ts
import { Conversation } from 'gpt-turbo';

(async () => {
    const conversation = new Conversation({
        apiKey: /* Your OpenAI API key */,
        stream: true,
    });

    const response = await conversation.prompt("What is TypeScript?");
    process.stdout.write(`Response: `);
    const unsubscribe = response.onMessageUpdate((content) => {
        process.stdout.write(content);
    });

    response.onStreamingStop(() => {
        unsubscribe();
    });
})();
```

## Documentation

The documentation for this library can be found [here](https://gpt-turbo.chintristan.io/).
