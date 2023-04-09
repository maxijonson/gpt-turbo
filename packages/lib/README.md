<!-- omit in toc -->
# GPT Turbo

A library for interacting with OpenAI's Chat Completion API. Its main goal is to keep track of the message history through a Conversation object, which is useful to keep track of the conversation as it progresses without needing to manually keep track of the previous messages sent/received.

- [Installation](#installation)
- [Usage](#usage)
- [GPT Turbo API](#gpt-turbo-api)
  - [Conversation](#conversation)
    - [`constructor(config?: ConversationConfigParameters, options?: RequestOptions)`](#constructorconfig-conversationconfigparameters-options-requestoptions)
    - [`id: string`](#id-string)
    - [`prompt(prompt: string, options?: PromptOptions, requestOptions?: RequestOptions): Promise<Message>`](#promptprompt-string-options-promptoptions-requestoptions-requestoptions-promisemessage)
    - [`reprompt(fromMessage: string | Message, newPrompt?: string, options?: PromptOptions, requestOptions?: RequestOptions): Promise<Message>`](#repromptfrommessage-string--message-newprompt-string-options-promptoptions-requestoptions-requestoptions-promisemessage)
    - [`addAssistantMessage(message: string): Promise<Message>`](#addassistantmessagemessage-string-promisemessage)
    - [`addUserMessage(message: string): Promise<Message>`](#addusermessagemessage-string-promisemessage)
    - [`getMessages(includeContext?: boolean): Message[]`](#getmessagesincludecontext-boolean-message)
    - [`onMessageAdded(listener: (message: Message) => void): () => void`](#onmessageaddedlistener-message-message--void---void)
    - [`offMessageAdded(listener: (message: Message) => void): void`](#offmessageaddedlistener-message-message--void-void)
    - [`onMessageRemoved(listener: (message: Message) => void): () => void`](#onmessageremovedlistener-message-message--void---void)
    - [`offMessageRemoved(listener: (message: Message) => void): void`](#offmessageremovedlistener-message-message--void-void)
    - [`clearMessages(): void`](#clearmessages-void)
    - [`removeMessage(message: string | Message): void`](#removemessagemessage-string--message-void)
    - [`getChatCompletionResponse(options?: PromptOptions, requestOptions?: RequestOptions): Promise<Message>`](#getchatcompletionresponseoptions-promptoptions-requestoptions-requestoptions-promisemessage)
    - [`getSize(): number`](#getsize-number)
    - [`getCumulativeSize(): number`](#getcumulativesize-number)
    - [`getCost(): number`](#getcost-number)
    - [`getCumulativeCost(): number`](#getcumulativecost-number)
    - [`setContext(context: string): void`](#setcontextcontext-string-void)
    - [`getConfig(): {ConversationConfig}`](#getconfig-conversationconfig)
    - [`setConfig(config: ConversationConfigParameters, merge?: boolean): void`](#setconfigconfig-conversationconfigparameters-merge-boolean-void)
  - [Message](#message)
    - [`constructor(role?: "user" | "assistant" | "system", content?: string, model?: string)`](#constructorrole-user--assistant--system-content-string-model-string)
    - [`id: string`](#id-string-1)
    - [`role: "user" | "assistant" | "system"`](#role-user--assistant--system)
    - [`content: string`](#content-string)
    - [`model: string`](#model-string)
    - [`flags: string[]`](#flags-string)
    - [`isFlagged: boolean`](#isflagged-boolean)
    - [`size: number`](#size-number)
    - [`cost: number`](#cost-number)
    - [`isStreaming: boolean`](#isstreaming-boolean)
    - [`onMessageUpdate(listener: (content: string, message: Message) => void): () => void`](#onmessageupdatelistener-content-string-message-message--void---void)
    - [`offMessageUpdate(listener: (content: string, message: Message) => void): void`](#offmessageupdatelistener-content-string-message-message--void-void)
    - [`onMessageStreamingUpdate(listener: (isStreaming: boolean, message: Message) => void): () => void`](#onmessagestreamingupdatelistener-isstreaming-boolean-message-message--void---void)
    - [`onMessageStreamingStart(listener: (message: Message) => void): () => void`](#onmessagestreamingstartlistener-message-message--void---void)
    - [`onMessageStreamingStop(listener: (message: Message) => void): () => void`](#onmessagestreamingstoplistener-message-message--void---void)
    - [`offMessageStreamingUpdate(listener: (isStreaming: boolean, message: Message) => void): void`](#offmessagestreamingupdatelistener-isstreaming-boolean-message-message--void-void)
    - [`moderate(apiKey: string, requestOptions?: RequestOptions): Promise<string[]>`](#moderateapikey-string-requestoptions-requestoptions-promisestring)
    - [`readContentFromStream(response: ReadableStream): Promise<void>`](#readcontentfromstreamresponse-readablestream-promisevoid)
  - [ConversationConfig](#conversationconfig)
- [GPT Turbo Utils](#gpt-turbo-utils)
  - [`base64Encode(payload: string): string`](#base64encodepayload-string-string)
  - [`createChatCompletion(chatCompletionRequestParams: CreateChatCompletionRequest, requestOptions?: RequestOptions): Promise<object | ReadableStream>`](#createchatcompletionchatcompletionrequestparams-createchatcompletionrequest-requestoptions-requestoptions-promiseobject--readablestream)
  - [`createDryChatCompletion(message: string, config?: CreateDryChatCompletionConfig): ReadableStream`](#createdrychatcompletionmessage-string-config-createdrychatcompletionconfig-readablestream)
  - [`createModeration(moderationRequestParams: CreateModerationRequest, requestOptions?: RequestOptions): Promise<CreateModerationResponse>`](#createmoderationmoderationrequestparams-createmoderationrequest-requestoptions-requestoptions-promisecreatemoderationresponse)
  - [`getMessageCost(message: string | number, model: string, type: "prompt" | "completion"): number`](#getmessagecostmessage-string--number-model-string-type-prompt--completion-number)
  - [`getMessageSize(message: string): number`](#getmessagesizemessage-string-number)
  - [`getMessageTokens(message: string): string[]`](#getmessagetokensmessage-string-string)
  - [`getPricing(model: string): { prompt: number, completion: number }`](#getpricingmodel-string--prompt-number-completion-number-)
- [GPT Turbo TypeScript Interfaces](#gpt-turbo-typescript-interfaces)
  - [CreateChatCompletionRequest](#createchatcompletionrequest)
  - [CreateModerationRequest](#createmoderationrequest)
  - [CreateModerationResponse](#createmoderationresponse)
  - [ConversationConfigParameters](#conversationconfigparameters)
  - [RequestOptions](#requestoptions)
  - [RequestOptionsProxy](#requestoptionsproxy)
  - [PromptOptions](#promptoptions)
  - [CreateDryChatCompletionConfig](#createdrychatcompletionconfig)


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

## GPT Turbo API

### Conversation

The Conversation class is the main class for interacting with the GPT Turbo API. It keeps track of all sent and received messages, so that they can be provided to the API for the next prompt.

#### `constructor(config?: ConversationConfigParameters, options?: RequestOptions)`

Creates a new Conversation instance.

| Parameter | Type                                                          | Description                                                 | Default                                             |
| --------- | ------------------------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| config    | [ConversationConfigParameters](#conversationconfigparameters) | Options to pass to the Create Chat Completion API endpoint. | `{}`. See [ConversationConfig](#conversationconfig) |
| options   | [RequestOptions](#requestoptions)                             | Options to pass for the HTTP request.                       | `{}`                                                |

#### `id: string`

A UUID generated by the library for this conversation. Not the same as the conversation ID returned by the OpenAI API. This can be useful when managing multiple conversations in your app.

#### `prompt(prompt: string, options?: PromptOptions, requestOptions?: RequestOptions): Promise<Message>`

This is the **recommended** way to interact with the GPT model. It's a wrapper method around other public methods that handles the logic of adding a user message, sending a request to the OpenAI API, and adding the assistant's response.

Returns the assistant's response as a [`Message`](#message) instance.

| Parameter      | Type                              | Description                                                                                                                 | Default    |
| -------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------- |
| prompt         | string                            | The prompt to send to the OpenAI API.                                                                                       | *Required* |
| options        | [PromptOptions](#promptoptions)   | Additional options to pass to the Create Chat Completion API endpoint. This overrides the config passed to the constructor. |            |
| requestOptions | [RequestOptions](#requestoptions) | Additional options to pass for the HTTP request. This overrides the config passed to the constructor.                       |            |

#### `reprompt(fromMessage: string | Message, newPrompt?: string, options?: PromptOptions, requestOptions?: RequestOptions): Promise<Message>`

Removes all messages starting from (but excluding) the `fromMessage` if it's a user message, or its previous user message if `fromMessage` is an assistant message. Then, the `prompt` method is called using either the specified `newPrompt` or the previous user message's content.

This is useful if you want to edit a previous user message (by specifying `newPrompt`) or if you want to regenerate the response to a previous user message (by not specifying `newPrompt`).

Returns the assistant's response as a [`Message`](#message) instance.

| Parameter      | Type                              | Description                                                                                                                 | Default    |
| -------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------- |
| fromMessage    | string \| [Message](#message)     | The message to re-prompt from. This can be either a message ID or a [`Message`](#message) instance.                         | *Required* |
| newPrompt      | string                            | The new prompt to use for the previous user message. If not provided, the previous user's message content will be reused.   |            |
| options        | [PromptOptions](#promptoptions)   | Additional options to pass to the Create Chat Completion API endpoint. This overrides the config passed to the constructor. |            |
| requestOptions | [RequestOptions](#requestoptions) | Additional options to pass for the HTTP request. This overrides the config passed to the constructor.                       |            |


<!-- omit in toc -->
##### Example

```typescript
let assistantRes1 = await conversation.prompt("Hello!"); // Hi
let assistantRes2 = await conversation.prompt("How are you?"); // I'm good, how are you?

// Regenerate the assistantRes2 response
assistantRes2 = await conversation.reprompt(assistantRes2); // Good! What about you?

// Edit the initial prompt (and remove all messages after it. In this case, assistantRes2's response)
assistantRes1 = await conversation.reprompt(assistantRes1, "Goodbye!"); // See you later!
```

#### `addAssistantMessage(message: string): Promise<Message>`

Adds a message with the role of "assistant" to the conversation.

Return the [`Message`](#message) object that was added to the conversation

| Parameter | Type   | Description                 | Default    |
| --------- | ------ | --------------------------- | ---------- |
| message   | string | The content of the message. | *Required* |

#### `addUserMessage(message: string): Promise<Message>`

Adds a message with the role of "user" to the conversation.

Return the [`Message`](#message) object that was added to the conversation

| Parameter | Type   | Description                 | Default    |
| --------- | ------ | --------------------------- | ---------- |
| message   | string | The content of the message. | *Required* |

#### `getMessages(includeContext?: boolean): Message[]`

Get the messages in the conversation.

Returns a **shallow copy** of the messages array.

| Parameter      | Type    | Description                                                   | Default |
| -------------- | ------- | ------------------------------------------------------------- | ------- |
| includeContext | boolean | Whether to include the context message in the returned array. | `false` |

#### `onMessageAdded(listener: (message: Message) => void): () => void`

Adds a listener function that is called whenever a message is added to the conversation.

Returns a function that removes the listener from the list of listeners.

| Parameter | Type                         | Description                                                       | Default    |
| --------- | ---------------------------- | ----------------------------------------------------------------- | ---------- |
| listener  | `(message: Message) => void` | The function to call when a message is added to the conversation. | *Required* |

#### `offMessageAdded(listener: (message: Message) => void): void`

Removes a listener function from the list of listeners that was previously added with `onMessageAdded`.

| Parameter | Type                         | Description                                        | Default    |
| --------- | ---------------------------- | -------------------------------------------------- | ---------- |
| listener  | `(message: Message) => void` | The function to remove from the list of listeners. | *Required* |

#### `onMessageRemoved(listener: (message: Message) => void): () => void`

Adds a listener function that is called whenever a message is removed to the conversation.

Returns a function that removes the listener from the list of listeners.

| Parameter | Type                         | Description                                                         | Default    |
| --------- | ---------------------------- | ------------------------------------------------------------------- | ---------- |
| listener  | `(message: Message) => void` | The function to call when a message is removed to the conversation. | *Required* |

#### `offMessageRemoved(listener: (message: Message) => void): void`

Removes a listener function from the list of listeners that was previously added with `onMessageRemoved`.

| Parameter | Type                         | Description                                        | Default    |
| --------- | ---------------------------- | -------------------------------------------------- | ---------- |
| listener  | `(message: Message) => void` | The function to remove from the list of listeners. | *Required* |

#### `clearMessages(): void`

Clears all messages in the conversation except the context message, if it is set.

#### `removeMessage(message: string | Message): void`

Removes a message from the conversation's history.

| Parameter | Type                            | Description                                                                                                 | Default    |
| --------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------- |
| message   | string \| [`Message`](#message) | Either the ID of the message to remove, or the message object itself (where the ID will be extracted from). | *Required* |

#### `getChatCompletionResponse(options?: PromptOptions, requestOptions?: RequestOptions): Promise<Message>`

Sends a Create Chat Completion request to the OpenAI API using the current messages stored in the conversation's history.

Returns a new [`Message`](#message) instance with the role of "assistant" and the content set to the response from the OpenAI API. If the `stream` config option was set to `true`, the content will be progressively updated as the response is streamed from the API. Listen to the returned message's `onMessageUpdate` event to get the updated content.

| Parameter      | Type                              | Description                                                                                                                 | Default |
| -------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------- |
| options        | [PromptOptions](#promptoptions)   | Additional options to pass to the Create Chat Completion API endpoint. This overrides the config passed to the constructor. |         |
| requestOptions | [RequestOptions](#requestoptions) | Additional options to pass for the HTTP request. This overrides the config passed to the constructor.                       |         |

#### `getSize(): number`

Returns the sum of the token count of each message in the conversation's current messages. The next time `getChatCompletionResponse()` is called, this is the minimum amount of tokens that will be sent to the OpenAI API (estimated).

#### `getCumulativeSize(): number`

Returns the total amount of tokens that have been sent to the OpenAI API since the conversation was created.

#### `getCost(): number`

Returns the sum of the estimated cost of each message in the conversation's current messages. The next time `getChatCompletionResponse()` is called, this is the minimum cost that will be incurred by the OpenAI API (estimated).

#### `getCumulativeCost(): number`

Returns the total estimated cost that has been incurred by the OpenAI API since the conversation was created.

#### `setContext(context: string): void`

Sets the first message sent to the OpenAI API with the role of "system". This gives context the Chat Completion and can be used to customize its behavior.

| Parameter | Type   | Description                        | Default    |
| --------- | ------ | ---------------------------------- | ---------- |
| context   | string | The content of the system message. | *Required* |

#### `getConfig(): {ConversationConfig}`

Gets the current config properties as a JavaScript object. (not an instance of the `ConversationConfig` class)

Returns the current config properties as a JavaScript object.

#### `setConfig(config: ConversationConfigParameters, merge?: boolean): void`

Assigns a new config to the conversation.

| Parameter | Type                                                            | Description                                                                             | Default    |
| --------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------- |
| config    | [`ConversationConfigParameters`](#conversationconfigparameters) | The new config to use.                                                                  | *Required* |
| merge     | boolean                                                         | Set to `true` to merge the new config with the existing config instead of replacing it. | `false`    |

### Message

Messages are the building blocks of a conversation. They are created by the user and the assistant and are stored in the [`Conversation`](#conversation)'s history.

#### `constructor(role?: "user" | "assistant" | "system", content?: string, model?: string)`

Creates a new message instance.

| Parameter | Type                              | Description                                                                                                                                                      | Default  |
| --------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| role      | "user" \| "assistant" \| "system" | The role of who this message is from. Either "user", "assistant" or "system".                                                                                    | `"user"` |
| content   | string                            | The content of the message.                                                                                                                                      | `""`     |
| model     | string                            | The model used for processing this message. This is only used to calculate the cost of the message. If you don't specify a model, the `cost` will always be `0`. | `""`     |

#### `id: string`

A UUID generated for this message by the library.

#### `role: "user" | "assistant" | "system"`

The role of who this message is from.

#### `content: string`

The content of the message.

#### `model: string`

The model used to generate this message.

#### `flags: string[]`

The flags detected by OpenAI's moderation API. Only set after calling `moderate`.

#### `isFlagged: boolean`

Whether the message is flagged by OpenAI's moderation API. Always `false` unless `moderate` has been called.

#### `size: number`

The size of the message's content, in tokens.

#### `cost: number`

The estimated cost of the message's content.

#### `isStreaming: boolean`

Whether the message is currently being streamed.

#### `onMessageUpdate(listener: (content: string, message: Message) => void): () => void`

Add a listener for message content changes.

Returns an unsubscribe function for this `listener`

| Parameter | Type                                          | Description                                    | Default    |
| --------- | --------------------------------------------- | ---------------------------------------------- | ---------- |
| listener  | `(content: string, message: Message) => void` | The listener to trigger when `content` changes | *Required* |

#### `offMessageUpdate(listener: (content: string, message: Message) => void): void`

Removes a message update listener, previously set with `onMessageUpdate`.

| Parameter | Type                                          | Description                   | Default    |
| --------- | --------------------------------------------- | ----------------------------- | ---------- |
| listener  | `(content: string, message: Message) => void` | The previously added listener | *Required* |

#### `onMessageStreamingUpdate(listener: (isStreaming: boolean, message: Message) => void): () => void`

Adds a listener for message streaming state changes.

Returns an unsubscribe function for this `listener`

| Parameter | Type                                               | Description                                        | Default    |
| --------- | -------------------------------------------------- | -------------------------------------------------- | ---------- |
| listener  | `(isStreaming: boolean, message: Message) => void` | The listener to trigger when `isStreaming` changes | *Required* |

#### `onMessageStreamingStart(listener: (message: Message) => void): () => void`

Adds a listener for message streaming start.

**Note:** Internally, this creates a new function wrapping your passed `listener` and passes it to `onMessageStreamingUpdate`.
For this reason, you cannot remove a listener using `offMessageStreaming(listener)`.
Instead, use the returned function to unsubscribe the listener properly.

Returns an unsubscribe function for this `listener`

| Parameter | Type                         | Description                                                 | Default    |
| --------- | ---------------------------- | ----------------------------------------------------------- | ---------- |
| listener  | `(message: Message) => void` | The listener to trigger when `isStreaming` is set to `true` | *Required* |

#### `onMessageStreamingStop(listener: (message: Message) => void): () => void`

Adds a listener for message streaming stop.

**Note:** Internally, this creates a new function wrapping your passed `listener` and passes it to `onMessageStreamingUpdate`.
For this reason, you cannot remove a listener using `offMessageStreaming(listener)`.
Instead, use the returned function to unsubscribe the listener properly.

Returns an unsubscribe function for this `listener`

| Parameter | Type                         | Description                                                  | Default    |
| --------- | ---------------------------- | ------------------------------------------------------------ | ---------- |
| listener  | `(message: Message) => void` | The listener to trigger when `isStreaming` is set to `false` | *Required* |

#### `offMessageStreamingUpdate(listener: (isStreaming: boolean, message: Message) => void): void`

Removes a message streaming listener, previously set with `onMessageStreamingUpdate`.

| Parameter | Type                                               | Description                   | Default    |
| --------- | -------------------------------------------------- | ----------------------------- | ---------- |
| listener  | `(isStreaming: boolean, message: Message) => void` | The previously added listener | *Required* |

#### `moderate(apiKey: string, requestOptions?: RequestOptions): Promise<string[]>`

Call the OpenAI moderation API to check if the message is flagged. Only called once for the same content.

Returns the flags applied on the message

| Parameter      | Type                                | Description                          | Default    |
| -------------- | ----------------------------------- | ------------------------------------ | ---------- |
| apiKey         | string                              | The OpenAI API key                   | *Required* |
| requestOptions | [`RequestOptions`](#requestoptions) | The request options to pass to fetch | `{}`       |

#### `readContentFromStream(response: ReadableStream): Promise<void>`

Progessively adds content to the message from a streamed response type.

| Parameter | Type           | Description                            | Default    |
| --------- | -------------- | -------------------------------------- | ---------- |
| response  | ReadableStream | The ReadableStream from the OpenAI API | *Required* |

### ConversationConfig

The ConversationConfig class is used internally by the Conversation class, cannot be accessed through client code and serves no purpose outside of the Conversation instance. It is configured through the Conversation's `config` constructor parameter. You can retrieve it using the `Conversation.getConfig()` method and modify it using the `Conversation.setConfig()` method, but note that both of these methods return/use a JavaScript object and not a ConversationConfig instance itself.

This class is only documented here to provide a reference on the default values for the configuration parameters, when not provided in the Conversation `config` constructor parameter. **It will never be useful to client code (your code) and you shouldn't need it.**

| Property          | Type                   | Description                                                                                                                                                                                                                                                                       | Default                                                                                |
| ----------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| apiKey            | string                 | The OpenAI API key to use for the conversation.                                                                                                                                                                                                                                   | `""`                                                                                   |
| context           | string                 | The first message sent to the OpenAI API with the role of "system". This gives context the Chat Completion and can be used to customize its behavior.                                                                                                                             | `"You are a large language model trained by OpenAI. Answer as concisely as possible."` |
| dry               | boolean                | Run prompts in dry mode. If `true`, assistant responses will be the same as the user prompt                                                                                                                                                                                       | `false`                                                                                |
| disableModeration | boolean \| "soft"      | Disable message moderation with OpenAI's free Moderation API. If set to `"soft"`, the API will still be called, but won't throw an error if the message violates one of OpenAI's guidelines. Because this API is free, it will still be used in `dry` mode, if an API key is set. | `false`                                                                                |
| model             | string                 | The Chat Completion model to use. Refer to the [Model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) for the available models.                                                                                                     | `"gpt-3.5-turbo"`                                                                      |
| stream            | boolean                | If set, partial message deltas will be sent, like in ChatGPT. See [stream](https://platform.openai.com/docs/api-reference/chat/create#chat/create-stream).                                                                                                                        | `false`                                                                                |
| temperature       | number                 | What sampling temperature to use. See [temperature](https://platform.openai.com/docs/api-reference/chat/create#chat/create-temperature).                                                                                                                                          |                                                                                        |
| top_p             | number                 | An alternative to sampling with temperature, called nucleus sampling. See [top_p](https://platform.openai.com/docs/api-reference/chat/create#chat/create-top_p)                                                                                                                   |                                                                                        |
| stop              | string \| string[]     | Up to 4 sequences where the API will stop generating further tokens. See [stop](https://platform.openai.com/docs/api-reference/chat/create#chat/create-stop).                                                                                                                     |                                                                                        |
| max_tokens        | number                 | The maximum number of tokens to generate in the chat completion. See [max_tokens](https://platform.openai.com/docs/api-reference/chat/create#chat/create-max_tokens).                                                                                                             |                                                                                        |
| presence_penalty  | number                 | Increase or decrease the model's likelihood to talk about new topics. See [presence_penalty](https://platform.openai.com/docs/api-reference/chat/create#chat/create-presence_penalty).                                                                                            |                                                                                        |
| frequency_penalty | number                 | Increase or decrease the model's likelihood to repeat the same line verbatim. See [frequency_penalty](https://platform.openai.com/docs/api-reference/chat/create#chat/create-frequency_penalty).                                                                                  |                                                                                        |
| logit_bias        | Record<number, number> | Modify the likelihood of specified tokens appearing in the completion. See [logit_bias](https://platform.openai.com/docs/api-reference/chat/create#chat/create-logit_bias).                                                                                                       |                                                                                        |
| user              | string                 | A unique identifier representing your end-user. See [user](https://platform.openai.com/docs/api-reference/chat/create#chat/create-user).                                                                                                                                          |                                                                                        |

## GPT Turbo Utils

The following are some utility functions mostly used internally by the library, but they're exported in case you need them.

### `base64Encode(payload: string): string`

Isomorphic base64 encoding function.

Returns the base64 encoded string.

| Parameter | Type     | Description           | Default    |
| --------- | -------- | --------------------- | ---------- |
| payload   | `string` | The string to encode. | *Required* |

### `createChatCompletion(chatCompletionRequestParams: CreateChatCompletionRequest, requestOptions?: RequestOptions): Promise<object | ReadableStream>`

Sends a Create Chat Completion request to the OpenAI API.

The response from the OpenAI API. A `ReadableStream` if `chatCompletionRequestParams.stream` is set to `true` in the request, otherwise a JSON object.

| Parameter                   | Type                                                          | Description                            | Default    |
| --------------------------- | ------------------------------------------------------------- | -------------------------------------- | ---------- |
| chatCompletionRequestParams | [`CreateChatCompletionRequest`](#createchatcompletionrequest) | The Create Chat Completion parameters. | *Required* |
| requestOptions              | [`RequestOptions`](#requestoptions)                           | Options to pass for the HTTP request.  | `{}`       |

### `createDryChatCompletion(message: string, config?: CreateDryChatCompletionConfig): ReadableStream`

Creates a dry chat completion and returns a `ReadableStream`. Can be used to simulate a streamed chat completion.

Returns a `ReadableStream` that can be used to simulate a streamed chat completion.

| Parameter | Type                                                              | Description                                    | Default    |
| --------- | ----------------------------------------------------------------- | ---------------------------------------------- | ---------- |
| message   | string                                                            | The message to simulate.                       | *Required* |
| config    | [`CreateDryChatCompletionConfig`](#createdrychatcompletionconfig) | The configuration for the dry chat completion. | `{}`       |

### `createModeration(moderationRequestParams: CreateModerationRequest, requestOptions?: RequestOptions): Promise<CreateModerationResponse>`

Sends a Create Moderation request to the OpenAI API.

Returns the CreateModerationResponse from the OpenAI API.

| Parameter               | Type                                                  | Description                           | Default    |
| ----------------------- | ----------------------------------------------------- | ------------------------------------- | ---------- |
| moderationRequestParams | [`CreateModerationRequest`](#createmoderationrequest) | The Create Moderation parameters.     | *Required* |
| requestOptions          | [`RequestOptions`](#requestoptions)                   | Options to pass for the HTTP request. | `{}`       |

### `getMessageCost(message: string | number, model: string, type: "prompt" | "completion"): number`

Returns the cost of a message according to the OpenAI API [pricing page](https://openai.com/pricing#chat).

| Parameter | Type                     | Description                                                                                                          | Default    |
| --------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------- | ---------- |
| message   | string \| number         | The message to get the cost of. Either a string or a number of tokens.                                               | *Required* |
| model     | string                   | The model to use for the calculation. See list: https://platform.openai.com/docs/models/model-endpoint-compatibility | *Required* |
| type      | "prompt" \| "completion" | The type of message to calculate the cost of. Either "prompt" or "completion".                                       | *Required* |

### `getMessageSize(message: string): number`

Returns the size of a message in tokens.

| Parameter | Type     | Description                     | Default    |
| --------- | -------- | ------------------------------- | ---------- |
| message   | `string` | The message to get the size of. | *Required* |

### `getMessageTokens(message: string): string[]`

Returns an array of tokens from a given `message`.

| Parameter | Type     | Description                         | Default    |
| --------- | -------- | ----------------------------------- | ---------- |
| message   | `string` | The message to get the tokens from. | *Required* |

### `getPricing(model: string): { prompt: number, completion: number }`

Returns the pricing model for a given `model`.

| Parameter | Type     | Description                                             | Default    |
| --------- | -------- | ------------------------------------------------------- | ---------- |
| model     | `string` | The chat completion model to get the pricing model for. | *Required* |

## GPT Turbo TypeScript Interfaces

The following are some of the TypeScript interfaces used in this library. They are all exported from the library, so you can use them in your own code.

### CreateChatCompletionRequest

[OpenAI's Chat Completion API parameters](https://platform.openai.com/docs/api-reference/chat/create). 

Same as the [`ConversationConfig`](#conversationconfig) properties, except the following:

- context
- dry
- disableModeration

### CreateModerationRequest

Request parameters for the [Create Moderation](https://platform.openai.com/docs/api-reference/moderations/create) endpoint.

| Property | Type   | Description           |
| -------- | ------ | --------------------- |
| apiKey   | string | Your OpenAI API key.  |
| input    | string | The text to classify. |

### CreateModerationResponse

Response from the [Create Moderation](https://platform.openai.com/docs/api-reference/moderations/create) endpoint.

| Property | Type                                                                                                   | Description                                     |
| -------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| label    | string                                                                                                 | The ID of the request.                          |
| model    | string                                                                                                 | The moderation model used to classify the text. |
| results  | `[{ categories: Record<string, boolean>, category_scores: Record<string, number>, flagged: boolean }]` | The flagged categories and their scores.        |

### ConversationConfigParameters

Parameters for configuring a Conversation's [`ConversationConfig`](#conversationconfig). Combines custom configuration parameters specific to the library as well as [OpenAI's Chat Completion API parameters](https://platform.openai.com/docs/api-reference/chat/create) ([`CreateChatCompletionRequest`](#createchatcompletionrequest)

Since all of this interface's properties are the same used by the ConversationConfig class, please refer to the [`ConversationConfig`](#conversationconfig) documentation for more information on each property.

### RequestOptions

Additional options to use when making HTTP requests with the `fetch` API.

| Property | Type                                          | Description                                                                                 |
| -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| headers  | Record<string, string>                        | Additional headers to send with the request.                                                |
| proxy    | [`RequestOptionsProxy`](#requestoptionsproxy) | Proxy configuration for making proxied requests instead of direct requests to OpenAI's API. |

### RequestOptionsProxy

Proxy configuration for making proxied requests instead of direct requests to OpenAI's API.

| Property | Type                                     | Description                                     |
| -------- | ---------------------------------------- | ----------------------------------------------- |
| host     | string                                   | The hostname or IP address of the proxy server. |
| port     | number                                   | The port of the proxy server.                   |
| protocol | "http" \| "https"                        | The protocol of the proxy server.               |
| auth     | `{ username: string, password: string }` | The username and password for the proxy server. |

### PromptOptions

Options typically used to override the Conversation's configuration for a single prompt.

This interface contains the same properties as the [`ConversationConfig`](#conversationconfig) class, but with the following properties omitted:

- model
- messages
- apiKey
- context
- dry
- disableModeration

The reason each of these options cannot be overriden for a single prompt is because it is not possible to remember these overrides for the next prompt, which could have confusing results. As the library grows, some of these properties may be handled internally in a way that would allow them to be overriden for a single prompt, but for now, they are omitted.

### CreateDryChatCompletionConfig

Options for creating a dry run of a streamed Chat Completion request.

| Property     | Type   | Description                               |
| ------------ | ------ | ----------------------------------------- |
| model        | string | The model to use for the completion.      |
| initialDelay | number | The delay before the first chunk is sent. |
| chunkDelay   | number | The delay between each chunk.             |