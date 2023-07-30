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

## Basic Usage

If you want to jump right in and start a conversation with the GPT model, this is the most straightforward way to use this library.

```ts
import { Conversation } from 'gpt-turbo';

const apiKey = "sk-1234"; /* Your API key */

const conversation = new Conversation({ config: { apiKey } });
const response = await conversation.prompt("What's the best way to make my code as precise as a Stormtrooper's aim?");
console.log(`Response: ${response.content}`);
```

## Advanced Usage

### Message Streaming

By default, messsage responses are returned in a single string. However, you can also stream a message as it is generated, just like ChatGPT.

```ts
import { Conversation } from "gpt-turbo";

const conversation = new Conversation({
    config: {
        apiKey,
        stream: true,
    },
});

const response = await conversation.prompt("How can I make my code more efficient than a droid army?");

// New method (v5). Recommended for streamed responses as it automatically unsubscribes when the streaming stops.
response.onContentStream(async (content, isStreaming) => {
    console.log(content);
});

// Legacy method (v4). Still supported, but you need to unsubscribe manually.
const unsubscribeUpdate = response.onUpdate((content) => {
    console.log(content);
});

const unsubscribeStop = response.onStreamingStop(() => {
    unsubscribeUpdate();
    unsubscribeStop();
});
```

### Conversation Serialization and Deserialization

Save and load conversations are a breeze with these Conversation methods.

```ts
import { Conversation } from "gpt-turbo";
import { save, load } from "./utils/db.js";

const conversationJson = await load();
const conversation = await Conversation.fromJSON(conversationJson);

const response = await conversation.prompt("How can I optimize my code to be faster than the Millennium Falcon's Kessel Run?");
console.log(`Response: ${response.content}`);

await save(conversation.toJSON());
```

### Manual History Management

The `prompt` method is the recommended way to prompt the GPT model, as it takes care of managing the message history for you (i.e. add a "user" message to the history, get the chat completion and add the "assistant" response to the history). However, if you need to do some intermediate steps, you can do this manually. The following code is roughly the equivalent of what the `prompt` method does.

```ts
import { Conversation } from "gpt-turbo";
import { getRemainingCredits } from "./utils/quota.js";

const conversation = new Conversation({ config: { apiKey } });
const userMessage = conversation.history.addUserMessage("How can I make my database more scalable than the Galactic Empire?");

try {
    const userFlags = await userMessage.moderate(apiKey);
    if (userFlags.length > 0) {
        throw new Error(userFlags.join(", "));
    }

    const remainingCredits = await getRemainingCredits();
    if (userMessage.content.length > remainingCredits) {
        throw new Error("Insufficient credits, you have. Strong with the Force, your wallet is not.");
    }

    const assistantMessage = await conversation.getChatCompletionResponse();
    await assistantMessage.moderate(apiKey);
    if (assistantMessage.flags.length > 0) {
        throw new Error(assistantMessage.flags.join(", "));
    }

    console.log(`Response: ${assistantMessage.content}`);

    await conversation.history.addAssistantMessage(assistantMessage.content);
} catch (e) {
    conversation.history.removeMessage(userMessage);
    throw e;
}
```

### Message Moderation

> ⚠ Message moderation is also done in dry mode if you've specified an API key. This is because the moderation endpoint is free of charge and does not count towards your API usage quota.

By default, GPT Turbo will use your API key to call OpenAI's Moderation endpoint to make sure the message complies with their terms of service **before** prompting the Chat Completion API. This endpoint is free of charge and does not count towards your API usage quota. If it doesn't pass the moderation check, an error will be thrown. However, you can disable this behavior completely or still moderate the message without throwing an error (flags will be added to the message instead).

```ts
import { Conversation } from "gpt-turbo";

// Moderation enabled (default)

const conversation = new Conversation({
    config: {
        apiKey,
        disableModeration: false, // Default
    },
});
const response = await conversation.prompt("Execute Order 66."); // ModerationException: Message flagged for violence

// Soft moderation

const conversation = new Conversation({
    config: {
        apiKey,
        disableModeration: "soft",
    },
});
const response = await conversation.prompt("Execute Order 66."); // response.flags = ["violence"]

// Disable moderation

const conversation = new Conversation({
    config: {
        apiKey,
        disableModeration: true,
    },
});
const response = await conversation.prompt("Execute Order 66."); // "Yes my Lord."
```

### Re-prompting

Just like on ChatGPT, you can edit previous user messages or re-prompt the assistant for a specific message. When re-prompting, all messages after re-prompted one will be removed from the conversation history.

```ts
import { Conversation } from "gpt-turbo";

const conversation = new Conversation({ config: { apiKey } });
const first = await conversation.prompt("We do not grant you the rank of Master."); // "How can you do this?!"
const second = await conversation.prompt("Take a seat, young Skywalker."); // "I will slaughter padawans!"
const edit = await conversation.reprompt(first, "We grant you the rank of Master.");
```

### Function Calling

> Function calls are not currently supported in dry mode. There is no planned support for this either.

You can use OpenAI's Function Calling feature with GPT Turbo through the `functionPrompt` method. Just define your functions in the conversation configuration just like you would normally with the Chat Completion API. 

⚠ Unless you configure `functions_call` to explicitly call a function by name (which by default does not, it uses `auto`), make sure you also plan for standard chat completions in your code. To help with detecting which type of response you got, the `Message` class exposes two (type-guarded!) functions: `isFunctionCall` and `isCompletion`.

```ts
import { Conversation, CallableFunction, CallableFunctionString, CallableFunctionObject } from "gpt-turbo";

const locateJedi = (jedi, locationType = "planet") => {
    return {
        name: jedi,
        location: locationType === "planet" ? "Tatooine" : "Mos Eisley",
    };
};

const locateJediFn = new CallableFunction("locateJedi", "Returns the current location of a Jedi")
locateJediFn.addParameter(new CallableFunctionString("jedi", "The name of the Jedi to locate"), true);
locateJediFn.addParameter(new CallableFunctionString("locationType", { enum: ["planet", "city"] }));

const conversation = new Conversation({
    config: {
        apiKey,
    },
});
conversation.callableFunctions.addFunction(locateJediFn);

const r1 = await conversation.prompt("Where can I find Obi-Wan Kenobi?");

if (r1.isCompletion()) {
    console.info(r1.content);
} else if (r1.isFunctionCall()) {
    const { jedi, locationType } = r1.functionCall.arguments;
    const r2 = await conversation.functionPrompt(
        r1.functionCall.name,
        locateJedi(jedi, locationType)
    );
    console.info(r2.content); // "Obi-Wan Kenobi can be found on Tatooine."
}
```

Function calls can also be streamed!

```ts
const conversation = new Conversation({
    config: {
        apiKey,
        stream: true,
    },
});
conversation.callableFunctions.addFunction(locateJediFn);

const r1 = await conversation.prompt("In which city is Obi-Wan Kenobi?");

// New method (v5). Recommended for streamed responses as it automatically unsubscribes when the streaming stops, making it easier to manage.
r1.onContentStream(async (_, isStreaming, message) => {
    // Gracefully handle non-function call completions
    // Optional if you're certain that all completions will be function calls (i.e, specifying `function_call` in the `config`)
    if (message.isCompletion() && message.content) {
        console.info("Completion", message.content);
        return;
    }

    // Wait for function call to complete
    if (isStreaming) return;
    // Not a function call. Stop here.
    if (!message.isFunctionCall()) return;

    const { jedi, locationType } = message.functionCall.arguments;
    const r2 = await conversation.functionPrompt(
        message.functionCall.name,
        locateJedi(jedi, locationType)
    );

    r2.onContentStream((content) => {
        if (!content) return;
        console.info("Function Call:", content); // "Obi-Wan Kenobi is located in the city of Mos Eisley."
    });
});

// Legacy method (v4). Still supported, but it's much more complicated.
const unsubscribeUpdates = r1.onUpdate((_, message) => {
    if (!message.isCompletion()) {
        return;
    }
    console.info(message.content);
});
const unsubscribeStop = r1.onStreamingStop(async (message) => {
    if (message.isFunctionCall()) {
        const { jedi, locationType } = message.functionCall.arguments;
        const r2 = await conversation.functionPrompt(
            message.functionCall.name,
            locateJedi(jedi, locationType)
        );

        const unsubscribeFunctionUpdate = r2.onUpdate((content) => {
            console.info(content); // "Obi-Wan Kenobi is located in the city of Mos Eisley."
        });

        const unsubscribeFunctionStop = r2.onStreamingStop(() => {
            unsubscribeFunctionUpdate();
            unsubscribeFunctionStop();
        });
    }

    unsubscribeUpdates();
    unsubscribeStop();
});
```

There are a lot of ways to create a callable function. Here are **some** of the ways we could've created the `locateJediFn` callable function. While the one we used above is the most verbose, it might not suit all use cases.

```ts
const name = "locateJedi";
const description = "Returns the current location of a Jedi";

// The one we used above
const locateJediFn = new CallableFunction(name, description)
locateJediFn.addParameter(new CallableFunctionString("jedi", "The name of the Jedi to locate"), true);
locateJediFn.addParameter(new CallableFunctionString("locationType", { enum: ["planet", "city"] }));

// Create the parameters using CallableFunctionObject. we're passing a random name to the object because it is generally required for the parameters, but it won't be used in this case. Notice the "addProperty" instead of "addParameter" method.
const parameters = new CallableFunctionObject("_");
parameters.addProperty(new CallableFunctionString("jedi", "The name of the Jedi to locate"), true);
parameters.addProperty(new CallableFunctionString("locationType", { enum: ["planet", "city"] }));
const locateJediFn = new CallableFunction(name, description, parameters);

// Using a JSON Object Schema to define the parameters. This complex structure almost looks like what the library will send to the API in the end.
const locateJediFn = new CallableFunction(name, description, {
    type: "object",
    properties: {
        jedi: {
            type: "string",
            description: "The name of the Jedi to locate",
        },
        locationType: {
            type: "string",
            enum: ["planet", "city"],
        },
    },
    required: ["jedi"],
});

// Using CallableFunction.fromJSON. This is the same object that will be sent to the API in the end. This is what the Web implmentation of GPT Turbo uses, since it loads functions from the local storage as JSON objects.
const locateJediFn = CallableFunction.fromJSON({
    name,
    description,
    parameters: {
        type: "object",
        properties: {
            jedi: {
                type: "string",
                description: "The name of the Jedi to locate",
            },
            locationType: {
                type: "string",
                enum: ["planet", "city"],
            },
        },
        required: ["jedi"],
    },
});

// Finally, you also can totally ignore the CallableFunction class and pass your raw functions to the Conversation constructor
const conversation = new Conversation({
    config: { apiKey },
    callableFunctions: {
        functions: [
            {
                name,
                description,
                parameters: {
                    type: "object", // Notice that "type" will ALWAYS be "object", no matter what your function takes as parameters. This follows the JSON Object Schema specification.
                    properties: {
                        jedi: {
                            type: "string",
                            description: "The name of the Jedi to locate",
                        },
                        locationType: {
                            type: "string",
                            enum: ["planet", "city"],
                        },
                    },
                    required: ["jedi"],
                },
            },
        ],
    },
});
```

Just like every other class in this library, the `CallableFunction` and subclasses of `CallableFunctionParameter` all have a `toJSON` method and `fromJSON` static method. Each `CallableFunctionParameter` subclass also have Zod schemas exported so that you can validate their JSON representation. Here are all subclasses of `CallableFunctionParameter`:

- `CallableFunctionString`
- `CallableFunctionNumber`
- `CallableFunctionBoolean`
- `CallableFunctionObject`
- `CallableFunctionArray`
- `CallableFunctionEnum`
- `CallableFunctionConst`
- `CallableFunctionNull`

There is also a `CallableFunctionParameterFactory.fromJSON` method which is used internally by the `CallableFunctionObject` and `CallableFunctionArray` classes to create their properties/items dynamically from a JSON object.

## Conversation Plugins

Conversation Plugins allow you to extend the functionality of GPT Turbo or simply to attach listeners just like you would without plugins. Throughout the conversation's lifecycle, several events will be triggered by the library so that plugins may tap into them. For example, they can modify the content of a user message during a `prompt` or `reprompt` call.

You can find a detailed example with home-made [`gpt-turbo-plugin-stats` plugin](../plugins/gpt-turbo-plugin-stats/README.md).

### Using a plugin

Plugins can be injected in the `Conversation` constructor through the `plugins` option, or defined as a global plugin that will be used by all conversations.

```ts
import { Conversation } from "gpt-turbo";
import stats from "gpt-turbo-plugin-stats";

// Injected in the constructor
const conversation = new Conversation({
    plugins: [stats],
});

// Global plugin
const globalPlugins = [stats];
Conversation.globalPlugins = globalPlugins;
const conversation = new Conversation();

// Typing the global plugins for type safety
declare module "gpt-turbo" {
    interface ConversationGlobalPluginsOverride {
        globalPlugins: typeof globalPlugins;
    }
}
```

If your plugin exposes an output meant to be used by client code, you can use the `getPluginOutput` method to retrieve it. If you're using TypeScript, the plugin output will be fully typed as long as you're accessing the plugin through a literal string or a constant. You should also notice you get automatic intellisense when typing the plugin name. If you're getting the plugin dynamically, the plugin output defaults to `any` and could be `undefined`. Usually, it's recommended that plugin authors export a type guard to properly type the plugin output for dynamic use (more on that later).

```ts
const pluginOutput = conversation.plugins.getPluginOutput("pluginName");
const pluginOutput = conversation.plugins.getPlugin("pluginName").out; // Same as the above
```

### Authoring a plugin

Plugins can be authored for a specific project only or be published as a standalone package. If you're publishing a standalone package, it's recommended you follow the `gpt-turbo-plugin-` naming convention. This will make it easier for users to find your plugin and will also make it easier for you to find a name that isn't already taken. You can also add the `gpt-turbo-plugin` to your tags on npm to make it easier to find.

Plugins are functions that receive every `Conversation` properties, even the ones that are normally private to regular usage, such as `ChatCompletionService` and `PluginService`. They also receive optional plugin data persisted through the `getPluginData` property of your plugin. Your plugin function returns the **plugin definition**, which is an object with the properties you want your plugin to react to during the conversation lifecycle.

For convenience, it's recommended to use the `createConversationPlugin` function, but you could technically define it manually with the `ConversationPlugin` interface exported by the library.

```ts
import { createConversationPlugin } from "gpt-turbo";

// Recommended to expose the plugin name as a constant
export const myPluginName = "myPlugin";

export const myPlugin = createConversationPlugin(myPluginName, ({ conversation, history, /* ... */ }, pluginData?: number) => {
    if (pluginData) {
        console.log("Plugin data was persisted from a previous conversation (new Conversation(prevConversation.toJSON()))");
        console.log(`Plugin data: ${pluginData}`);
    } else {
        console.log("First time plugin is used (new **Conversation**)");
    }

    return {
        onUserPrompt: async (message) => {
            console.log(`User prompt: ${message.content}`);
            message.content = await yodaSpeak(message.content);
        },
        getPluginData: () => (pluginData ?? 0) + 1,
        out: "Hello there!", // Plugin output available through `conversation.plugins.getPluginOutput("myPlugin")`. Can be virtually anything you want! (usually a function or a class instance though!)
        /* Many more methods you can tap into... */
    }
});
```

For TypeScript users, the `conversation.getPlugin` method (and other alike such as `getPluginOutput`) has strong type inference to infer the plugin output and data type when called with a literal. However, in some cases, users may want to dynamically get plugins by their name. To help differentiate your plugin from other plugins in these cases while preserving types, it's recommended to ship a type guard with your plugin.

```ts
/* ... */
import { ConversationPluginDefinitionFromPlugin, ConversationPluginDefinition } from "gpt-turbo";

export type MyPluginDefinition = ConversationPluginDefinitionFromPlugin<typeof myPlugin>;
export const isMyPlugin = (plugin?: ConversationPluginDefinition): plugin is MyPluginDefinition => {
    return plugin?.name === myPluginName;
};
```

Because plugins are functions, you can allow custom options to be passed to your plugin by client code. This isn't a feature of GPT Turbo, it's just JavaScript! As long as your plugin function returns a plugin definition, you can do whatever you want with it. 

```ts
const myPlugin = (options) => {
    // do something with options, maybe
    return createConversationPlugin(myPluginName, ({ conversation, history, /* ... */ }, pluginData?: number) => {
        /* do something else with options, maybe */
        return { /* ... */ };
    });
}

// Usage
const options = { /* ... */ };
const conversation = new Conversation({
    plugins: [myPlugin(options)],
});
```

## Documentation

View the full documentation [here](https://gpt-turbo.chintristan.io/). The documentation website is auto-generated based on the TSdoc comments in the source code for the latest version of the library.
