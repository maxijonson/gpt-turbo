#!/usr/bin/env node

import { GPTTURBO_APIKEY, GPTTURBO_MODEL } from "./config/env";
import { Conversation } from "@maxijonson/gpt-turbo";
import { ChatCompletionModel } from "@maxijonson/gpt-turbo/dist/ConversationConfig";
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
        model: {
            type: "string",
            description: "Chat completion model to use.",
            alias: "m",
            choices: ["gpt-3.5-turbo", "gpt-3.5-turbo-0301"] as const,
            default: (GPTTURBO_MODEL || "gpt-3.5-turbo") as ChatCompletionModel,
        },
    }).argv;

    const { apiKey = GPTTURBO_APIKEY, model } = argv;

    const conversation = new Conversation({
        apiKey,
        model,
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let prompt = "";
    do {
        prompt = await rl.question("You      : ");
        const response = await conversation.prompt(prompt);
        if (response) {
            console.info(`Assistant: ${response}`);
        }
    } while (prompt);
    rl.close();
})();
