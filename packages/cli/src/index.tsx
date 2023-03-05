#!/usr/bin/env node

import {
    GPTTURBO_APIKEY,
    GPTTURBO_CONTEXT,
    GPTTURBO_DRY,
    GPTTURBO_MODEL,
    GPTTURBO_SHOWSIZE,
} from "./config/env";
import { ChatCompletionModel } from "@maxijonson/gpt-turbo";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import React from "react";
import { render } from "ink";
import App from "./components/App";
import Providers from "./contexts/providers";

const argv = yargs(hideBin(process.argv))
    .options({
        apiKey: {
            type: "string",
            description: "Your OpenAI API key.",
            alias: "k",
            demandOption: !GPTTURBO_APIKEY,
        },
        dry: {
            type: "boolean",
            description: "Dry run. Don't send any requests to OpenAI.",
            alias: "d",
            default: GPTTURBO_DRY,
        },
        model: {
            type: "string",
            description: "Chat completion model to use.",
            alias: "m",
            choices: ["gpt-3.5-turbo", "gpt-3.5-turbo-0301"] as const,
            default: GPTTURBO_MODEL as ChatCompletionModel | undefined,
        },
        context: {
            type: "string",
            description:
                "The first system message to set the context for the GPT model.",
            alias: "c",
            default: GPTTURBO_CONTEXT,
        },
        size: {
            type: "boolean",
            description:
                "Show the size of the conversation in tokens as well as the usage cost.",
            alias: "s",
            default: GPTTURBO_SHOWSIZE,
        },
    })
    .parseSync();

const {
    apiKey = GPTTURBO_APIKEY!,
    model,
    dry,
    context,
    size: showUsage,
} = argv;

render(
    <Providers>
        <App
            apiKey={apiKey}
            model={model}
            dry={dry}
            context={context}
            showUsage={showUsage}
        />
    </Providers>
);
