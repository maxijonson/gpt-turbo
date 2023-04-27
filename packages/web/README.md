# GPT Turbo - Web

<div align="center">

  [![https://gpt-turbo-web.chintristan.io/](https://img.shields.io/github/package-json/v/maxijonson/gpt-turbo?color=brightgreen&filename=packages%2Fweb%2Fpackage.json&label=gpt-turbo-web&logo=react)](https://gpt-turbo-web.chintristan.io/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

A Web app, very similar to ChatGPT, that interacts with the gpt-turbo library. The main difference between this and the official ChatGPT website is that you can decide which GPT model to use, just like the OpenAI playground.

## Conversation and Settings Storage

Just like ChatGPT, conversations and their messages can be saved. You can also set some default settings, such as your API key, so you don't need to re-enter it every time. This is possible through the use of the browser's local storage. This web app does not use any hosted cloud service. Everything is done locally in your browser.

Since this feature could require that your API key be saved for each conversation that uses it, and due to the security implications of that, the web app will only save your conversations if you explicitly allow it during the conversation's initial setup page.

Due to the nature of local storage, your conversations and settings will be lost if you clear your browser's local storage, switch browsers, or use a different device. This also applies if you run the web app on a different port (on localhost).

## Installation

*Run these at the mono-repo root. Not this package directory*

```bash
# Installs mono-repo dependencies, bootstraps packages, and builds packages
npm install
```

## Usage

You can view an example of the deployed web app [here](https://gpt-turbo-web.chintristan.io/), or you can run it locally by following the instructions below and serve it yourself. The web app has been built so that it can be served by anyone as a static website. 

*Run these in this package directory*

```bash
# Serve the web app
npm run preview
# or
npm run preview -- --port 8080 
```

## Deploy

You can see the latest version of the deployed web app [here](https://gpt-turbo-web.chintristan.io/).

The following instructions are for deploying the web app to [Render](https://render.com/), as they offer free hosting for static websites. However, these steps can generally be applied to any hosting service that allows you to serve a static website. As such, these instructions assume you already have a Render account connected with you GitHub account. You can sign up [here](https://dashboard.render.com/register).

1. On Render's dashboard, click "New" and select "Static Site".
2. Link the GitHub repository
   1. Option 1 (Recommended): Fork this repository on your GitHub account and connect it to Render. This will allow you to make your own changes to the web app, if you want to.
   2. Option 2: Link this repository: https://github.com/maxijonson/gpt-turbo .
3. Give the site a name, for example `gpt-turbo-web`.
4. Select the `master` branch as the branch to deploy.
5. Set the root directory to `packages/web`.
6. Set the build command to `npm run build`.
7. Set the publish directory to `dist`. (`packages/web/dist`)
8. (Optional) If you chose to link this repository (option 2), you may want to disable the "Auto-Deploy" option under the "Advanced" tab. This will prevent Render from automatically deploying the web app every time a change is made to it. You can then manually deploy the web app later.
9. Click "Create Static Site".

## Attributions

Thanks to these authors for providing some assets used in this web app:

<a href="https://www.flaticon.com/free-icons/quick" title="quick icons">Quick icons created by Cuputo - Flaticon</a>