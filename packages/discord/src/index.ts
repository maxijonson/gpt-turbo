import { GatewayIntentBits, Partials } from "discord.js";
import GPTTurboClient from "./GPTTurboClient.js";
import { USE_MESSAGE_CONTENT_INTENT } from "./config/env.js";

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
];

if (USE_MESSAGE_CONTENT_INTENT) {
    intents.push(GatewayIntentBits.MessageContent);
}

new GPTTurboClient({
    intents,
    partials: [Partials.Channel],
}).login();
