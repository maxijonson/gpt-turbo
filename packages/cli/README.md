# GPT Turbo - CLI

A CLI that interacts with the gpt-turbo library

<p align="center">
  <img alt="GPT Turbo Demo" src="https://github.com/maxijonson/gpt-turbo/blob/HEAD/packages/cli/demo.gif?raw=true">
</p>

## Installation

```bash
npm install -g gpt-turbo-cli
```

## Usage

```
# Display help for the CLI
gpt-turbo --help

# Start a conversation with the GPT model
gpt-turbo -k <your OpenAI API key>
```

## CLI Options

Here's a table of the CLI options. Note that all CLI arguments can also be passed as environment variables. For example, you can pass your OpenAI API key as `GPTTURBO_APIKEY` instead of `-k`. Arguments always take precedence over environment variables. Refer to the [library's conversation config](../lib/README.md#conversation-config) for more information on the options default values.

| Argument          | Alias | Environment                | Type    | Description                                                                                                                                                   | Default           | Required |
| ----------------- | ----- | -------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------- |
| apiKey            | k     | GPTTURBO_APIKEY            | string  | Your OpenAI API key                                                                                                                                           | (library default) |          |
| dry               | d     | GPTTURBO_DRY               | boolean | Run the CLI without sending requests to OpenAI (mirror input as output)                                                                                       | (library default) |          |
| model             | m     | GPTTURBO_MODEL             | string  | The model to use.                                                                                                                                             | (library default) |          |
| context           | c     | GPTTURBO_CONTEXT           | string  | The first system message to set the context for the GPT model                                                                                                 | (library default) |          |
| disableModeration | M     | GPTTURBO_DISABLEMODERATION | boolean | Disable message moderation. When left enabled, if `dry` is true and `apiKey` is specified, message will still be moderated, since the Moderation API is free. | (library default) |          |
| softModeration    | S     | GPTTURBO_SOFTMODERATION    | boolean | Keep moderating messages, but don't throw an error if the message is not approved. Ignored if `disableModeration` is `true`.                                  | false             |          |
