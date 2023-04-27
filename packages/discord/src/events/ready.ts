import { Events } from "discord.js";
import createDiscordEvent from "../utils/createDiscordEvent.js";

export default createDiscordEvent(
    Events.ClientReady,
    async (client) => {
        console.info(
            [
                "________________________   ________             ______        ",
                "__  ____/__  __ \\__  __/   ___  __/___  ___________  /_______ ",
                "_  / __ __  /_/ /_  /      __  /  _  / / /_  ___/_  __ \\  __ \\",
                "/ /_/ / _  ____/_  /       _  /   / /_/ /_  /   _  /_/ / /_/ /",
                "\\____/  /_/     /_/        /_/    \\__,_/ /_/    /_.___/\\____/ ",
                "                                                              ",
            ].join("\n")
        );
        console.info(`Ready! Logged in as ${client.user.tag}`);
    },
    true
);
