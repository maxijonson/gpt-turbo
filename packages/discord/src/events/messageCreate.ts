import { ChannelType, Events, userMention } from "discord.js";
import createDiscordEvent from "../utils/createDiscordEvent.js";
import { EMPTY_PROMPT_REPLIES } from "../config/constants.js";
import { Conversation } from "gpt-turbo";
import {
    GPTTURBO_APIKEY,
    GPTTURBO_CONTEXT,
    GPTTURBO_DRY,
    GPTTURBO_MODEL,
} from "../config/env.js";

export default createDiscordEvent(Events.MessageCreate, async (message) => {
    if (!message.content || message.author.id === message.client.user.id)
        return;

    const botMention = userMention(message.client.user.id);
    const isPrompt =
        message.content.startsWith(botMention) ||
        message.channel.type === ChannelType.DM;

    if (!isPrompt) return;

    const prompt = message.content
        .replace(botMention, "")
        .replace(/<@!?\d+>/g, "")
        .trim();

    if (!prompt) {
        const reply =
            EMPTY_PROMPT_REPLIES[
                Math.floor(Math.random() * EMPTY_PROMPT_REPLIES.length)
            ];
        await message.reply(reply);
        return;
    }

    try {
        const conversation = new Conversation({
            apiKey: GPTTURBO_APIKEY,
            model: GPTTURBO_MODEL,
            dry: !GPTTURBO_APIKEY || GPTTURBO_DRY,
            context: GPTTURBO_CONTEXT,
        });
        const { content } = await conversation.prompt(prompt);
        await message.reply(content);
    } catch (error) {
        console.error(error);
        await message.reply({
            content: "There was an error while generating a response.",
            options: {
                ephemeral: true,
            },
        });
    }
});
