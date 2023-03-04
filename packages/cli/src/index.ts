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

const getCost = (usage: number) => "$" + ((usage / 1000) * 0.002).toFixed(5);

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
        console.info("Dry run. No requests will be sent to OpenAI.\n");
    }

    const conversation = new Conversation({
        apiKey,
        model,
        context,
    });

    if (size) {
        console.info(`Context Size: ${conversation.getSize()} tokens\n`);
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let prompt = "";
    let usage = 0; // Total amount of tokens sent to/from OpenAI since the beginning of the conversation.
    while (true) {
        if (size) {
            console.info(`\nUsage: ${usage} tokens (${getCost(usage)})`);
        }

        prompt = await rl.question("\nYou : ");
        if (!prompt) break;

        if (size) {
            const promptSize = getMessageSize(prompt);
            console.info(
                `(${promptSize} / ${conversation.getSize() + promptSize})`
            );
        }

        let response: string | null = null;
        if (dry) {
            response = prompt;
            conversation.addUserMessage(response);
            conversation.addAssistantMessage(prompt);
        } else {
            response = await conversation.prompt(prompt);
        }

        if (!response) continue;

        console.info(`\nGPT : ${response}`);
        if (size) {
            const responseSize = getMessageSize(response);
            console.info(`(${responseSize} / ${conversation.getSize()})`);
            usage += conversation.getSize();
        }
    }
    rl.close();
})();
