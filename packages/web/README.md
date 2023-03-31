# GPT Turbo - Web

A Web app, very similar to ChatGPT, that interacts with the gpt-turbo library. The main difference between this and the official ChatGPT website is that you can decide which GPT model to use, just like the OpenAI playground. It doesn't require any server-side code or storage mechanism, since all of the configuration and saved information is stored in the browser's local storage.

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
