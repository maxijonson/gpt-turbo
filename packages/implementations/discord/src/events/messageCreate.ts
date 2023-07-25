import { Events } from "discord.js";
import createDiscordEvent from "../utils/createDiscordEvent.js";

export default createDiscordEvent(Events.MessageCreate, async (message) => {
    message.client.handleMessage(message);
});
