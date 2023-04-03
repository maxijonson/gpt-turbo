# GPT Turbo - Web

A Web app, very similar to ChatGPT, that interacts with the gpt-turbo library. The main difference between this and the official ChatGPT website is that you can decide which GPT model to use, just like the OpenAI playground.

## Conversation and Settings Storage

Just like ChatGPT, conversations and their messages can be saved. You can also set some default settings, such as your API key, so you don't need to re-enter it every time. This is possible through the use of the browser's local storage. This web app does not use any hosted cloud service. Everything is done locally in your browser.

Since this feature could require that your API key be saved for each conversation that uses it, and due to the security implications of that, the web app will only save your conversations if you explicitly allow it during the conversation's initial setup page.

Due to the nature of local storage, your conversations and settings will be lost if you clear your browser's local storage, switch browsers, or use a different device. This also applies if you run the web app on a different port (on localhost).

## Installation

*Run these at the mono-repo root. Not this package directory*

```bash
# Install mono-repo dependencies
npm install

# Bootstrap the packages
npm run bootstrap

# Build the library and the web app
npm run build
```

## Usage

As of right now, the web app is not hosted anywhere. You can run it locally by following the instructions below. You can also serve it yourself. The web app has been built so that it can be served by anyone as a static website. 

*Run these in this package directory*

```bash
# Serve the web app
npm run preview
# or
npm run preview -- --port 8080 
```

## Deploy

TODO: Instructions on how to deploy the web app.
