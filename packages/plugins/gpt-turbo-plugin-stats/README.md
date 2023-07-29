# GPT Turbo - Plugin - Stats

<div align="center">

  [![npm i gpt-turbo-plugin-stats](https://img.shields.io/npm/v/gpt-turbo-plugin-stats?color=brightgreen&label=gpt-turbo-plugin-stats&logo=npm)](https://www.npmjs.com/package/gpt-turbo-plugin-stats)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

A GPT Turbo plugin to augment conversations with usage statistics:

- **Size**: The size (in tokens) of the conversation. This includes the system (context) message. It's an indicator of the **minimum** amount of tokens that will be sent on the next Chat Completion call.
- **Cumulative Size**: The cumulative size (in tokens) of the conversation. It's the amount of tokens that have been send/received since the start of the conversation. This is the amount of tokens you've been charged for.
- **Cost**: The cost (in $USD) of the conversation. It's an indicator of the **minimum** amount of money that will be charged on the next Chat Completion call.
- **Cumulative cost**: The cumulative cost (in $USD) of the conversation. It's the amount of money that has been charged since the start of the conversation.

## Disclaimer

The statistics are based on the tokens given by a third party library: [`gpt-tokenizer`](https://www.npmjs.com/package/gpt-tokenizer). While its tokenization is usually accurate, it's not guaranteed to be 100% accurate. Stats may differ from OpenAI's bill, but usually not by much.

## Installation

[`gpt-turbo`](https://www.npmjs.com/package/gpt-turbo) is required to use this plugin and is marked as a peer dependency. You can install it with:

```bash
npm i gpt-turbo
```

Then install this plugin with:

```bash
npm i gpt-turbo-plugin-stats
```

*Note: since this plugin is developed alongside the library, both versions **must** be equal. Your installation will fail otherwise.*

## Usage

Here are some examples of how to inject the plugin (`statsPlugin`) in a `Conversation` and how to retrieve the output `ConversationStats` instance (`stats`).

```ts
import { Conversation } from "gpt-turbo";
import statsPlugin, { statsPluginName } from "gpt-turbo-plugin-stats";

// As a per-conversation plugin
const conversation = new Conversation({
    plugins: [statsPlugin]
});
const stats = conversation.plugins.getPluginOutput(statsPluginName); // ConversationStats

// As a global plugin
const globalPlugins = [statsPlugin];
declare module "gpt-turbo" {
    interface ConversationGlobalPluginsOverride {
        globalPlugins: typeof globalPlugins;
    }
}
Conversation.globalPlugins = globalPlugins;
const conversation = new Conversation();
const stats = conversation.plugins.getPluginOutput(statsPluginName); // ConversationStats
```

If you're getting the plugin dynamically (i.e. not from a string literal or the `statsPluginName` constant), you can use the `isStatsPlugin` type guard to properly type the plugin:

```ts
import { Conversation } from "gpt-turbo";
import statsPlugin, { isStatsPlugin } from "gpt-turbo-plugin-stats";

const conversation = new Conversation({
    plugins: [statsPlugin]
});

const plugin = conversation.plugins.getPlugin("gpt-turbo-plugin" + "-stats");
plugin.out; // any

if (isStatsPlugin(plugin)) {
    const stats = plugin.out; // ConversationStats
}
```

With the `ConversationStats` instance, you can retrieve the stats:

```ts
console.log(stats.size, stats.cumulativeSize, stats.cost, stats.cumulativeCost);
```

Finally, you can subscribe to events to get notified when the stats change:

```ts
const unsubscribe = stats.onStatsUpdate(() => {
    console.log(stats.size, stats.cumulativeSize, stats.cost, stats.cumulativeCost);
});
setTimeout(unsubscribe, 1000); // Unsubscribe after 1 second
```