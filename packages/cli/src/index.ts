#!/usr/bin/env node

import {
    GPTTURBO_APIKEY,
    GPTTURBO_CONTEXT,
    GPTTURBO_DRY,
    GPTTURBO_MODEL,
    GPTTURBO_SHOWSIZE,
} from "./config/env";
import {
    ChatCompletionModel,
    Conversation,
    getMessageSize,
} from "@maxijonson/gpt-turbo";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as readline from "readline/promises";

(async () => {
    const argv = await yargs(hideBin(process.argv)).options({
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
    }).argv;

    const { apiKey = GPTTURBO_APIKEY!, model, dry, context, size } = argv;

    if (dry) {
        console.info("Dry run: No requests will be sent to OpenAI.\n");
    }

    const conversation = new Conversation({
        apiKey,
        model,
        context,
        dry,
    });

    if (size) {
        console.info(`Context Size: ${getMessageSize(context)} tokens`);
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let prompt = "";
    while (true) {
        prompt = await rl.question("\nYou : ");
        if (!prompt) break;

        const response = await conversation.prompt(prompt);
        if (!response) continue;

        if (size) {
            console.info(`(${getMessageSize(prompt)} tokens)`);
        }

        console.info(`\nGPT : ${response}`);

        if (size) {
            console.info(`(${getMessageSize(response)} tokens)`);
            console.info(
                `\nUsage: ${conversation.getCumulativeSize()} tokens ($${conversation
                    .getCumulativeCost()
                    .toFixed(5)})`
            );
        }
    }
    rl.close();
})();
