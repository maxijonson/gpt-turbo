# GPT Turbo - Implementation - Nest

<div align="center">

  [![GPT Turbo - Nest](https://img.shields.io/github/package-json/v/maxijonson/gpt-turbo?color=brightgreen&filename=packages%2Fnest%2Fpackage.json&label=gpt-turbo-nest&logo=nestjs)](https://github.com/maxijonson/gpt-turbo/tree/develop/packages/implementations/nest)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

> ⚠⚠⚠ Since v5, this implementation is only maintained to make the build pass. Some cases may not work as expected. ⚠⚠⚠
> 
> The Nest implementation was more of a proof of concept when GPT Turbo started, rather than an actual useable project like the other implementations.
> For this reason, not much effort will be put into maintaining it. It's kept here for historical purposes, and may be reworked in the future or removed entirely.
> You're welcome to contribute to it if you want to keep it alive!
>
> *Note: this implementation has been tested thoroughly for the last time on v5.0.0 and seemed to work fine, apart from not using new features beyond v1.4, such as callable functions and plugins*

A NestJS app that interacts with the gpt-turbo library.

## Disclaimer

This implementation of GPT Turbo is only a **proof of concept**. It is only intended to show GPT Turbo's ability to be used in backend applications. A lot of features are intentionally left unsecured for the sake of simplicity. **This implementation is not intended for production use.** 

Furthermore, still in the pursuit of simplicity and minimal setup requirements, this implementation does not use a database. Instead, it uses [`lowdb`](https://www.npmjs.com/package/lowdb), a lightweight JSON database. This means that all of your data will be kept in a JSON file, which is definitely not ideal for production use and would actually be lost everytime it is deployed to some cloud services with an ephermeral file-system, such as Heroku or Render.

## Installation

*Run these at the mono-repo root. Not this package directory*

```bash
# Installs mono-repo dependencies, bootstraps packages, and builds packages
npm install
```

## Running the app

*Run these in this package directory*

```bash
# development
npm run start

# watch mode
npm run dev

# production mode
npm run prod
```

## Configuration

The following sections describe how you can configure the app. Note that these steps are optional and the app will run with default settings.

### SSL

This app can be run with or without SSL. By default, it will run without SSL. To run with SSL, you must first generate a `key.pem` and `server.crt` file. You can do this by running the following command:

```bash
# Generate SSL key and certificate in this directory
openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
```

Then, you can run the app with SSL by setting the `SSL_PRIVATE_KEY_PATH` and `SSL_CERTIFICATE_PATH` environment variables. These may also be specified in a `.env` file.

```bash
# Run the app with SSL by setting the "SSL_PRIVATE_KEY_PATH" and "SSL_CERTIFICATE_PATH" environment variables
SSL_PRIVATE_KEY_PATH=./key.pem SSL_CERTIFICATE_PATH=./server.crt npm start
```

### CORS

By default, CORS is not enabled. To enable it, simply specify the `USE_CORS=true` environment variable. This may also be specified in a `.env` file.

```bash
USE_CORS=true npm start
```

### Swagger

Swagger is enabled by default at the `/swagger` endpoint. To disable it, simply specify the `USE_SWAGGER=false` environment variable. This may also be specified in a `.env` file.

```bash
USE_SWAGGER=false npm start
```

For streamed conversation prompts (`POST /conversations/{id}`), Swagger will only show the data stream after the stream has ended. It's recommended to use a tool like [Postman](https://www.postman.com/) to test this endpoint.

## Postman Collection

While Swagger is the most up-to-date way of testing the API, since it is generated at runtime, you can also use the Postman collection/environment included this directory: 
- `GPT Turbo - Nest.postman_collection.json`
- `GPT Turbo - Nest.postman_environment.json`

Bear in mind that this collection is not automatically updated, so it may be out of date. To use it, simply import it into Postman.

The Postman collection includes automated scripts to assign variables so testing is relatively easier than Swagger. For example, after creating a conversation in Postman, the `conversationId` variable will be automatically assigned to the ID of the conversation. This means that you can then use the `conversationId` variable in subsequent requests, such as sending a prompt to the conversation.

Postman is also a great way to test streamed conversation prompts, since Swagger will only show the data stream after the stream has ended.
