# GPT Turbo - Discord

<div align="center">

  [![GPT Turbo - Discord](https://img.shields.io/github/package-json/v/maxijonson/gpt-turbo?color=brightgreen&filename=packages%2Fdiscord%2Fpackage.json&label=gpt-turbo-discord&logo=discord)](https://github.com/maxijonson/gpt-turbo/tree/develop/packages/discord)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

Discord bot powered by the GPT Turbo library.

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
