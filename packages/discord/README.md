# GPT Turbo - Discord

<div align="center">

  [![GPT Turbo - Discord](https://img.shields.io/github/package-json/v/maxijonson/gpt-turbo?color=brightgreen&filename=packages%2Fdiscord%2Fpackage.json&label=gpt-turbo-discord&logo=discord)](https://github.com/maxijonson/gpt-turbo/tree/develop/packages/discord)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

Discord bot powered by the GPT Turbo library. Inspired by Discord's very own Clyde AI chat bot.

## Installation

*Run these at the mono-repo root. Not this package directory*

```bash
# Install mono-repo dependencies
npm install

# Bootstrap the packages
npm run bootstrap

# Build the library and the Discord bot
npm run build
```

*Run these in this package directory*

```bash
# Register slash commands
npm run register
```

## Prerequisites

- You'll need to setup a Discord bot. You can do this by following the [Discord.js guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).
- Before [running the bot](#running-the-bot)  You'll need to specify your Discord bot token and client ID in the environment variables. You can do this by creating a `.env` file in this directory with the `DISCORD_TOKEN` and `DISCORD_CLIENT_ID` variables, by setting them in your shell, or by setting them at runtime (see below).

## Running the bot

> If you plan on deploying this bot for yourself, you'll need to set the following permissions: `395137059840`

*Run these in this package directory*

```bash
# Start the bot
npm start

# Start the bot in development mode
npm run dev

# Start the bot and specify the token and client ID
DISCORD_TOKEN=your-token-here DISCORD_CLIENT_ID=your-client-id-here npm start
DISCORD_TOKEN=your-token-here DISCORD_CLIENT_ID=your-client-id-here npm run dev
```

## Whitelisting / Blacklisting

OpenAI has a gray rule on Bring-Your-Own-Key (BYOK) apps. This means that it's not explicitly clear in their usage policies whether or not you're allowed to ask users of you product for their API keys to use with your app. However, some [old forum replies](https://community.openai.com/t/openais-bring-your-own-key-policy/14538/2) from OpenAI staff suggests that it's not allowed. 

> It's different for other implementations of GPT Turbo, as they don't store the API key anywhere else than on the user's machine. ([source](https://community.openai.com/t/openais-bring-your-own-key-policy/14538/4)) This implementation would need to store the API key somewhere other than your machine in order to use it for conversations.

That being said, you'll need to provide your own API key for everyone to use. Because you don't want everyone making it paid calls to OpenAI, I implemented a whitelist and blacklist system for the bot. This means that you can specify a list of users/guilds that are allowed to use the bot, and a list of users/guilds that are not allowed to use the bot. 

This is done through environment variables. Refer to the [`.env.example`](./.env.example) file for more information on how to set this up.

> No matter what the whitelist says, the blacklist will always take precedence.

## The `MESSAGE_CONTENT` intent

The `MESSAGE_CONTENT` intent is a privileged Discord bot intent that allows bots to read messages that do not directly involve them (i.e. where the bot is not mentioned or being replied to with ping enabled). Developers can enable it at any time on the [Discord Developer Portal](https://discord.com/developers/applications), but bots with over 100 servers need to be approved by Discord to use it.

Fortunately, this bot can work with both the `MESSAGE_CONTENT` intent enabled and disabled. If you have it enabled, you'll need to set the `USE_MESSAGE_CONTENT_INTENT=true` environment variable for the bot to use the intent (on top of enabling it in the Discord Developer Portal). However, keep in mind the bot was designed to work with it disabled first. You may report any issues you encounter with it enabled.

> There are no intent-related limitations in DMs. In DMs, the bot will always create a new conversation when the message is not replying to the bot's previous message.

There are some differences in how the bot works depending on whether or not the intent is enabled:
- When **disabled**, the user needs to consistently reply to the bot's messages with ping enabled in order for it to work.
  - Users need to mention the bot in order to start a conversation.
  - Users need to reply to the bot's initial response **with ping enabled** in order to continue the conversation in a thread.
  - **Users need to reply to the bot's messages with ping enabled in a thread (created by the bot) in order to continue the conversation in the thread.**
- When **enabled**, the user doesn't need to reply to the bot'
  - Users need to mention the bot in order to start a conversation.
  - Users need to reply to the bot's initial response in order to continue the conversation in a thread.
  - **Users can send messages in the thread, without the need to reply to the bot's previous message, to continue the conversation in the thread**
