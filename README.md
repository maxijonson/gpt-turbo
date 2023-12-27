<div align="center">
  <img src="./logo/logo-inline-transparent.png" alt="GPT Turbo" width="524" />

  [![npm i gpt-turbo](https://img.shields.io/npm/v/gpt-turbo?color=brightgreen&label=gpt-turbo&logo=npm)](https://www.npmjs.com/package/gpt-turbo)

  Implementations using GPT Turbo
  
  [![npm i -g gpt-turbo-cli](https://img.shields.io/npm/v/gpt-turbo-cli?color=brightgreen&label=gpt-turbo-cli&logo=windowsterminal&logoColor=white)](https://www.npmjs.com/package/gpt-turbo-cli)
  [![https://gpt-turbo-web.chintristan.io/](https://img.shields.io/github/package-json/v/maxijonson/gpt-turbo?color=brightgreen&filename=packages/implementations/web/package.json&label=gpt-turbo-web&logo=react)](https://gpt-turbo-web.chintristan.io/)
  [![GPT Turbo - Nest](https://img.shields.io/github/package-json/v/maxijonson/gpt-turbo?color=brightgreen&filename=packages/implementations/nest/package.json&label=gpt-turbo-nest&logo=nestjs)](https://github.com/maxijonson/gpt-turbo/tree/develop/packages/implementations/nest)
  [![GPT Turbo - Discord](https://img.shields.io/github/package-json/v/maxijonson/gpt-turbo?color=brightgreen&filename=packages/implementations/discord/package.json&label=gpt-turbo-discord&logo=discord)](https://discord.gg/Aa77KCmwRx)

  Plugins for GPT Turbo

  [![npm i gpt-turbo-plugin-stats](https://img.shields.io/npm/v/gpt-turbo-plugin-stats?color=brightgreen&label=gpt-turbo-plugin-stats&logo=npm)](https://www.npmjs.com/package/gpt-turbo-plugin-stats)

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

> ⚠⚠⚠ **IMPORTANT NOTICE** ⚠⚠⚠
> 
> As of December 2023, GPT Turbo is still based on an older version of OpenAI's Chat Completion API and uses deprecated features. 
> For example, the library is still using the concept of "function calling", which has been replaced by "tools" with an equivalent functionality.
> While this is still supported by the API as of writing this, it is currently flagged as deprecated and will most likely stop working in the future, even if you have the latest version of GPT Turbo running on your project.
>
> I (maxijonson) have been a bit busy with other projects lately, which is why GPT Turbo has not been getting much attention lately and has missed a few new features.
> I'm planning on updating the library to the latest version of the API and adding new features in the future, but I can't give any ETA on when this will happen (if ever). 
> Being the only maintainer of the project and not focusing on it as much as I used to, it's hard to find the time to work on it.
> 
> The branch [`feature/api-update`](https://github.com/maxijonson/gpt-turbo/tree/feature/api-update) contains a work in progress version of the library that is based on the latest version of the API.
>
> Sorry for the inconvenience this may cause you. PRs are always welcome if you want to help out!

## About

> Are you a dev looking for the library? [Click here](./packages/lib/)!

GPT Turbo is a JavaScript library for seamless integration with OpenAI's Chat Completion API. It allows you to manage conversation history for smooth conversation continuity, fine-tune chat completion parameters and define callable functions. The library also supports plugins for extending its functionality beyond the core features.

## Features

🤖 Supports all Chat Completion models, including **GPT-4**. (full list [here](https://platform.openai.com/docs/models/model-endpoint-compatibility))

💬 Supports both single, streamed and function completions, just like ChatGPT.

⚙ Tune chat completion parameters, such as temperature, top-p, and frequency penalty.

🌐 Compatible in both Node.js and the browser.

📜 Keeps track of the conversation history for you, making conversation continuity a breeze.

💰 Estimate the cost and size of conversations before sending them to the API. (*through the `gpt-turbo-plugin-stats` plugin*)

💾 Easily persist conversations with serialization and deserialization methods.

🔌 Includes a plugin system for extending the library's functionality.

💻 Built entirely with TypeScript.

⚔️ Battle-tested in multiple environments. (See [implementations](#implementations))

## Implementations

This repo is a mono-repo containing both the [Library](./packages/lib/) and small projects powered by it. Here's a list of all the projects that were built with the GPT Turbo [Library](./packages/lib/)

- [Web](./packages/implementations/web/): A web app, very similar to ChatGPT, for handling chats in the browser.
- [Discord](./packages/implementations/discord/): A Discord bot for chatting in Discord servers, similar to Discord's own Clyde AI bot.
- [CLI](./packages/implementations/cli/): A command-line interface to chat straight from your terminal.
- [Nest](./packages/implementations/nest/): A NestJS backend, for interacting with the library via a REST API.

## Plugins

GPT Turbo has a plugin system for extending the library's functionality. While anyone can create and publish custom plugins, this repo contains the following home-made plugins:

- [gpt-turbo-plugin-stats](./packages/plugins/gpt-turbo-plugin-stats/): A plugin for estimating the cost and size of conversations before sending them to the API.

## Discord

Join the Discord community server [here](https://discord.gg/Aa77KCmwRx)!

## License and Disclaimer

GPT Turbo is licensed under the [MIT License](./LICENSE). 

To prevent accidental charges to your OpenAI account, remember to set billing limits on your OpenAI account!