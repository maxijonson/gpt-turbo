<div align="center">
  <img src="./logo/logo-inline-transparent.png" alt="GPT Turbo" width="524" />

  [![npm i gpt-turbo](https://img.shields.io/npm/v/gpt-turbo?color=brightgreen&label=gpt-turbo&logo=npm)](https://www.npmjs.com/package/gpt-turbo)
  [![npm i -g gpt-turbo-cli](https://img.shields.io/npm/v/gpt-turbo-cli?color=brightgreen&label=gpt-turbo-cli&logo=windowsterminal&logoColor=white)](https://www.npmjs.com/package/gpt-turbo-cli)
  [![https://gpt-turbo-web.chintristan.io/](https://img.shields.io/github/package-json/v/maxijonson/gpt-turbo?color=brightgreen&filename=packages%2Fweb%2Fpackage.json&label=gpt-turbo-web&logo=react)](https://gpt-turbo-web.chintristan.io/)
  [![GPT Turbo - Nest](https://img.shields.io/github/package-json/v/maxijonson/gpt-turbo?color=brightgreen&filename=packages%2Fnest%2Fpackage.json&label=gpt-turbo-nest&logo=nestjs)](https://github.com/maxijonson/gpt-turbo/tree/develop/packages/nest)
  [![GPT Turbo - Discord](https://img.shields.io/github/package-json/v/maxijonson/gpt-turbo?color=brightgreen&filename=packages%2Fdiscord%2Fpackage.json&label=gpt-turbo-discord&logo=discord)](https://discord.gg/Aa77KCmwRx)

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

## About

> Are you a dev looking for the library? [Click here](./packages/lib/)!

GPT Turbo is a JavaScript library for seamless integration with OpenAI's Chat Completion API. It ensures smooth conversation continuity and message history tracking, perfect for creating conversational AI applications.

## Features

> ✨ New (June 2023): Added support for **Function calling**

🤖 Supports all Chat Completion models, including **GPT-4**. (full list [here](https://platform.openai.com/docs/models/model-endpoint-compatibility))

💬 Supports both single, streamed and function completions, just like ChatGPT.

⚙ Tune chat completion parameters, such as temperature, top-p, and frequency penalty.

🌐 Compatible in both Node.js and the browser.

📜 Keeps track of the conversation history for you, making conversation continuity a breeze.

💰 Estimate the cost and size of conversations before sending them to the API.

💾 Easily persist conversations with serialization and deserialization methods.

💻 Built entirely with TypeScript.

⚔️ Battle-tested in multiple environments. (See [implementations](#implementations))

## Implementations

This repo is a mono-repo containing both the [Library](./packages/lib/) and small projects powered by it. Here's a list of all the projects that were built with the GPT Turbo [Library](./packages/lib/)

- [CLI](./packages/cli/): A command-line interface to chat straight from your terminal.
- [Web](./packages/web/): A web app, very similar to ChatGPT, for handling chats in the browser.
- [Nest](./packages/nest/): A NestJS backend, for interacting with the library via a REST API.
- [Discord](./packages/discord/): A Discord bot for chatting in Discord servers, similar to Discord's own Clyde AI bot.

## Discord

Join the Discord community server [here](https://discord.gg/Aa77KCmwRx)!

## License and Disclaimer

GPT Turbo is licensed under the [MIT License](./LICENSE). 

To prevent accidental charges to your OpenAI account, remember to set billing limits on your OpenAI account!