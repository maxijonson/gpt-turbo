# GPT Turbo - Nest

<div align="center">

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

A NestJS app that interacts with the gpt-turbo library.

## Disclaimer

This implementation of GPT Turbo is only a proof of concept. It is only intended to show GPT Turbo's compatibility with the framework. A lot of features are intentionally left unsecured for the sake of simplicity. **This implementation is not intended for production use.**

## Installation

*Run these at the mono-repo root. Not this package directory*

```bash
# Install mono-repo dependencies
npm install

# Bootstrap the packages
npm run bootstrap

# Build the library and the Nest app
npm run build
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
