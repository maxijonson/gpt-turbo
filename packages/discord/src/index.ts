import { Events, GatewayIntentBits } from "discord.js";
import { DISCORD_TOKEN } from "./config/env.js";
import GPTTurboClient from "./classes/GPTTurboClient.js";

const client = new GPTTurboClient({ intents: [GatewayIntentBits.Guilds] });
await client.init();

client.once(Events.ClientReady, (c) => {
    console.info(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    }
});

client.login(DISCORD_TOKEN);
