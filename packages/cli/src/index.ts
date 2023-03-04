#!/usr/bin/env node

import {
    GPTTURBO_APIKEY,
    GPTTURBO_CONTEXT,
    GPTTURBO_DRY,
    GPTTURBO_MODEL,
} from "./config/env";
import { ChatCompletionModel, Conversation } from "@maxijonson/gpt-turbo";
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
    }).argv;

    const { apiKey = GPTTURBO_APIKEY!, model, dry, context } = argv;

    if (dry) {
        console.info("Dry run. No requests will be sent to OpenAI.\n");
    }

    const conversation = new Conversation({
        apiKey,
        model,
        context,
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let prompt = "";
    do {
        prompt = await rl.question("You : ");
        const response = dry ? prompt : await conversation.prompt(prompt);
        if (response) {
            console.info(`\nGPT : ${response}\n`);
        }
    } while (prompt);
    rl.close();
})();
