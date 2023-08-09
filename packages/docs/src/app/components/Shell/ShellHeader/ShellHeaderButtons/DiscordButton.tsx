import { ActionIcon } from "@mantine/core";
import { BiLogoDiscordAlt } from "react-icons/bi";

const DiscordButton = () => {
    return (
        <ActionIcon
            component="a"
            target="_blank"
            href="https://discord.gg/Aa77KCmwRx"
            size="lg"
            radius="xl"
            variant="default"
        >
            <BiLogoDiscordAlt size={20} />
        </ActionIcon>
    );
};

export default DiscordButton;
