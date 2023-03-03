# GPT Turbo

OpenAI's gpt-3.5-turbo model has an API that allows you to generate conversational text from a prompt just like the [ChatGPT Plus subscription](https://openai.com/blog/chatgpt-plus). The difference between ChatGPT Plus and the gpt-3.5-turbo model API is the price. At the time of writing, ChatGPT Plus is a flat US$20 per month, while its API counterpart is US$0.002 per 1K [tokens](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them). This means that if you don't plan on using more than 10M tokens per month (and the limitations listed below), you could potentially save money by using the gpt-3.5-turbo model API instead of the ChatGPT Plus subscription. This monorepo contains implementations of the gpt-3.5-turbo model API in different JavaScript environments.

## Disclaimer

Implementations are provided as-is. I am not responsible for any accidental, incidental, special, consequential, or exemplary damages, including without limitation, damages for loss of profits, goodwill, use, data or other intangible losses, resulting from the use of the implementations. Use at your own risk. [Set limits](https://platform.openai.com/account/billing/limits) on OpenAI's billing page to avoid unexpected charges.

## Limitations

Here are some known limitations of the gpt-3.5-turbo model API compared to the ChatGPT Plus subscription (some may not have been documented):

- The gpt-3.5-turbo model API has a maximum of 4096 tokens taken as input. This means that your entire conversation with the model cannot be longer than 4096 tokens. This includes the context, your prompts and the model's responses tokens.

## Pre-requisites

Since gpt-3.5-turbo is a paid model, you'll need an [OpenAI API key](https://platform.openai.com/account/api-keys) and [setup billing information](https://platform.openai.com/account/billing/overview). Make sure to [set a usage limit](https://platform.openai.com/account/billing/limits) to avoid unexpected charges.

## Implementations

Most implementations were made following this guide: [OpenAI Docs: Chat completion](https://platform.openai.com/docs/guides/chat)

- [Library](./packages/lib/): A JavaScript library that allows you to interact with the gpt-3.5-turbo model API.
- [CLI](./packages/cli/): A command-line interface for interacting with the library.