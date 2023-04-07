#!/usr/bin/env node

import {
    GPTTURBO_APIKEY,
    GPTTURBO_CONTEXT,
    GPTTURBO_SHOWDEBUG,
    GPTTURBO_DRY,
    GPTTURBO_MODEL,
    GPTTURBO_SHOWUSAGE,
    GPTTURBO_DISABLEMODERATION,
    GPTTURBO_STREAM,
    GPTTURBO_SAVE,
    GPTTURBO_LOAD,
} from "./config/env.js";
import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
    DEFAULT_STREAM,
} from "gpt-turbo";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import React from "react";
import { render } from "ink";
import path from "path";
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
            default: GPTTURBO_MODEL ?? DEFAULT_MODEL,
        },
        context: {
            type: "string",
            description:
                "The first system message to set the context for the GPT model.",
            alias: "c",
            default: GPTTURBO_CONTEXT || DEFAULT_CONTEXT,
        },
        disableModeration: {
            type: "boolean",
            description:
                "Disable message moderation. When left enabled, if 'dry' is true and 'apiKey' is specified, message will still be moderated, since the Moderation API is free.",
            alias: "M",
            default:
                (GPTTURBO_DISABLEMODERATION === "soft"
                    ? null
                    : GPTTURBO_DISABLEMODERATION) ?? DEFAULT_DISABLEMODERATION,
        },
        stream: {
            type: "boolean",
            description:
                "Streams the message instead of waiting for the complete result",
            alias: "s",
            default: GPTTURBO_STREAM ?? DEFAULT_STREAM,
        },
        soft: {
            type: "boolean",
            description:
                "Moderates the messages without throwing an error when the message is flagged. Ignored if disableModeration is true.",
            alias: "S",
            default: GPTTURBO_DISABLEMODERATION === "soft" ?? false,
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
        save: {
            description:
                "Save the conversation to a file. If no file is specified, the conversation will be saved to a file with the current timestamp.",
            coerce: (value) => {
                if (!value) {
                    return undefined;
                }
                return value;
            },
        },
        load: {
            type: "string",
            description: "Load a conversation from a file.",
            default: GPTTURBO_LOAD,
        },
    })
    .parseSync();

const {
    apiKey,
    model,
    dry,
    context,
    disableModeration,
    stream,
    soft: softModeration,
    showUsage,
    showDebug,
    save = GPTTURBO_SAVE,
    load,
} = argv;

const moderation = disableModeration || (softModeration && "soft");

const saveFile = (() => {
    if (!save) {
        return undefined;
    }
    const savePath = path.normalize(
        typeof save === "string"
            ? save
            : `gptturbo-conversation-${new Date().toISOString()}`
    );
    return savePath.endsWith(".json") ? savePath : `${savePath}.json`;
})();

const loadFile = (() => {
    if (!load) {
        return undefined;
    }
    const loadPath = path.normalize(load);
    return loadPath.endsWith(".json") ? loadPath : `${loadPath}.json`;
})();

if (loadFile && !fs.existsSync(loadFile)) {
    console.error(`File not found: ${loadFile}`);
    process.exit(1);
}

render(
    <Providers
        initialApiKey={apiKey}
        initialModel={model}
        initialDry={dry}
        initialContext={context}
        initialDisableModeration={moderation}
        initialStream={stream}
    >
        <App
            showUsage={showUsage}
            showDebug={showDebug}
            saveFile={saveFile}
            loadFile={loadFile}
        />
    </Providers>
);
