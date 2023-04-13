import { GatewayIntentBits } from "discord.js";
import GPTTurboClient from "./classes/GPTTurboClient.js";

const client = new GPTTurboClient({ intents: [GatewayIntentBits.Guilds] });
await client.init();
