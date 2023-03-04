# GPT Turbo - CLI

A CLI that interacts with the @maxijonson/gpt-turbo library

## Installation

```bash
npm install -g @maxijonson/gpt-turbo-cli
```

## Usage

```
# Display help for the CLI
gpt-turbo --help

# Start a conversation with the GPT model
gpt-turbo -k <your OpenAI API key>
```

## CLI Options

Here's a table of the CLI options. Note that all CLI arguments can also be passed as environment variables. For example, you can pass your OpenAI API key as `GPTTURBO_APIKEY` instead of `-k`. Arguments always take precedence over environment variables.

| Argument | Alias | Environment     | Type    | Description                                                             | Default       | Required |
| -------- | ----- | --------------- | ------- | ----------------------------------------------------------------------- | ------------- | -------- |
| apiKey   | k     | GPTTURBO_APIKEY | string  | Your OpenAI API key                                                     |               | Yes      |
| model    | m     | GPTTURBO_MODEL  | string  | The model to use.                                                       | gpt-3.5-turbo |          |
| dryRun   | d     | GPTTURBO_DRY    | boolean | Run the CLI without sending requests to OpenAI (mirror input as output) | false         |          |
