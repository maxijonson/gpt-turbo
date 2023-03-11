#!/usr/bin/env node

import {
    GPTTURBO_APIKEY,
    GPTTURBO_CONTEXT,
    GPTTURBO_SHOWDEBUG,
    GPTTURBO_DRY,
    GPTTURBO_MODEL,
    GPTTURBO_SHOWUSAGE,
} from "./config/env.js";
import {
    ChatCompletionModel,
    DEFAULT_CONTEXT,
    DEFAULT_DRY,
    DEFAULT_MODEL,
} from "gpt-turbo";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import React from "react";
import { render } from "ink";
import App from "./components/App.js";
import Providers from "./contexts/providers/index.js";

const argv = yargs(hideBin(process.argv))
    .options({
        apiKey: {
            type: "string",
            description: "Your OpenAI API key.",
            alias: "k",
            default: GPTTURBO_APIKEY ?? "",
        },
        dry: {
            type: "boolean",
            description: "Dry run. Don't send any requests to OpenAI.",
            alias: "d",
            default: GPTTURBO_DRY ?? DEFAULT_DRY,
        },
        model: {
            type: "string",
            description: "Chat completion model to use.",
            alias: "m",
            choices: [
                "gpt-3.5-turbo",
                "gpt-3.5-turbo-0301",
            ] as ChatCompletionModel[],
            default: (GPTTURBO_MODEL ?? DEFAULT_MODEL) as ChatCompletionModel,
        },
        context: {
            type: "string",
            description:
                "The first system message to set the context for the GPT model.",
            alias: "c",
            default: GPTTURBO_CONTEXT ?? DEFAULT_CONTEXT,
        },
        showUsage: {
            type: "boolean",
            description: "Initially show the usage box.",
            alias: "u",
            default: GPTTURBO_SHOWUSAGE ?? true,
        },
        showDebug: {
            type: "boolean",
            description: "Initially show the debug box.",
            alias: "D",
            default: GPTTURBO_SHOWDEBUG ?? false,
        },
    })
    .parseSync();

const { apiKey, model, dry, context, showUsage, showDebug } = argv;

render(
    <Providers>
        <App
            apiKey={apiKey}
            model={model}
            dry={dry}
            context={context}
            showUsage={showUsage}
            showDebug={showDebug}
        />
    </Providers>
);
