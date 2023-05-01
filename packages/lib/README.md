<!-- omit in toc -->
# GPT Turbo

<div align="center">

  [![npm i gpt-turbo](https://img.shields.io/npm/v/gpt-turbo?color=brightgreen&label=gpt-turbo&logo=npm)](https://www.npmjs.com/package/gpt-turbo)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

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
        apiKey: "sk-1234", /* Your OpenAI API key */
    });

    const response = await conversation.prompt("What's the best way to make my code as precise as a Stormtrooper's aim?");
    console.log(`Response: ${response.content}`);
})();
```

## Advanced Usage

### Message Streaming

By default, messsage responses are returned in a single string. However, you can also stream a message as it is generated, just like ChatGPT.

```ts
import { Conversation } from "gpt-turbo";

const conversation = new Conversation({
    apiKey: "sk-1234",
    stream: true,
});

const response = await conversation.prompt("How can I make my code more efficient than a droid army?");
process.stdout.write(`Response: `);
const unsubscribe = response.onMessageUpdate((content) => {
    process.stdout.write(content);
});

response.onStreamingStop(() => {
    unsubscribe();
});
```

### Conversation Serialization and Deserialization

Save and load conversations are a breeze with these Conversation methods.

```ts
import { Conversation } from "gpt-turbo";
import { save, load } from "./utils/db";

const conversationJson = await load();
const conversation = await Conversation.fromJSON(conversationJson);

const response = await conversation.prompt("How can I optimize my code to be faster than the Millennium Falcon's Kessel Run?");
console.log(`Response: ${response.content}`);

await save(conversation.toJSON());
```

### Manual History Management

The `prompt` method is the recommended way to prompt the GPT model, as it takes care of managing the message history for you (i.e. add a "user" message to the history, get the chat completion and add the "assistant" response to the history). However, if you need to do some intermediate steps, you can do this manually.

```ts
import { Conversation } from "gpt-turbo";
import { getRemainingCredits } from "./utils/quota";

const conversation = new Conversation({ apiKey: "sk-1234" });
const userMessage = await conversation.addUserMessage("How can I make my database more scalable than the Galactic Empire?");

try {
    const remainingCredits = await getRemainingCredits();
    if (conversation.cost > remainingCredits) {
        throw new Error("Insufficient credits, you have. Strong with the Force, your wallet is not.");
    }

    const assistantMessage = await conversation.getChatCompletionResponse();
    console.log(`Response: ${assistantMessage.content}`);
    await conversation.addAssistantMessage(assistantMessage.content);
} catch (e) {
    this.removeMessage(userMessage);
    throw e;
}
```

### Message Moderation

> Message moderation is also done in dry mode!

By default, GPT Turbo will use your API key to call OpenAI's Moderation endpoint to make sure the message complies with their terms of service **before** prompting the Chat Completion API. This endpoint is free of charge and does not count towards your API usage quota. If it doesn't pass the moderation check, an error will be thrown. However, you can disable this behavior completely or still moderate the message without throwing an error (flags will be added to the message instead).

```ts
import { Conversation } from "gpt-turbo";

// Moderation enabled (default)

const conversation = new Conversation({
    apiKey: "sk-1234",
    disableModeration: false,
});
const response = await conversation.prompt("Execute Order 66."); // ModerationException: Message flagged for violence

// Soft moderation

const conversation = new Conversation({
    apiKey: "sk-1234",
    disableModeration: "soft",
});
const response = await conversation.prompt("Execute Order 66."); // response.flags = ["violence"]

// Disable moderation

const conversation = new Conversation({
    apiKey: "sk-1234",
    disableModeration: true,
});
const response = await conversation.prompt("Execute Order 66."); // "Yes my Lord."
```

### Re-prompting

Just like on ChatGPT, you can edit previous user messages or re-prompt the assistant for a specific message. When re-prompting, all messages after re-prompted one will be removed from the conversation history.

```ts
import { Conversation } from "gpt-turbo";

const conversation = new Conversation({ apiKey: "sk-1234" });
const first = await conversation.prompt("We do not grant you the rank of Master."); // "How can you do this?!"
const second = await conversation.prompt("Take a seat, young Skywalker."); // "I will slaughter padawans!"
const edit = await conversation.reprompt(first, "We grant you the rank of Master.");
```

## Documentation

View the full documentation [here](https://gpt-turbo.chintristan.io/). The documentation website is auto-generated based on the TSdoc comments in the source code for the latest version of the library.
