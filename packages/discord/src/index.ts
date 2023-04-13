import { GatewayIntentBits } from "discord.js";
import GPTTurboClient from "./classes/GPTTurboClient.js";

new GPTTurboClient({ intents: [GatewayIntentBits.Guilds] }).init();
