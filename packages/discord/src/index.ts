import { GatewayIntentBits, Partials } from "discord.js";
import GPTTurboClient from "./GPTTurboClient.js";

new GPTTurboClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
}).login();
