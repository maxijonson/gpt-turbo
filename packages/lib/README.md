# GPT Turbo

A library for interacting with OpenAI's Chat Completion API. It is essentially a wrapper around OpenAI's Node SDK for convenience, such as keeping the thread of messages so you don't have to and providing a simple interface for sending/receiving messages.

## Installation

```bash
npm install @maxijonson/gpt-turbo
```

## Basic Usage

If you want to jump right in and start a conversation with the GPT model, this is the most straightforward way to use this library.

```ts
import { Conversation } from '@maxijonson/gpt-turbo';

(async () => {
    const conversation = new Conversation({
        apiKey: /* Your OpenAI API key */,
    });

    const response = await conversation.prompt("What is TypeScript?");
    console.log(`Response: ${response}`);
})();
```

## Conversation Config

Here are some of the config options you can pass to the Conversation constructor. Note that these options inherit those from OpenAI's SDK ([ConfigurationParameters](https://github.com/openai/openai-node/blob/master/dist/configuration.d.ts)). This means that, as well as the options below, you can also pass any of the options from OpenAI's SDK. However, keep in mind that some of these options may conflict with the options below. The inheritance was done to make those options more accessible in case I didn't take them into account at the time of development.

| Name    | Type   | Description                                                    | Default                                                                            | Required |
| ------- | ------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------- |
| apiKey  | string | Your OpenAI API key                                            |                                                                                    | Yes      |
| model   | string | The model to use. ("gpt-3.5-turbo" or "gpt-3.5-turbo-0301")    | gpt-3.5-turbo                                                                      |          |
| context | string | The first system message to set the context for the GPT model. | You are a large language model trained by OpenAI. Answer as concisely as possible. |          |
