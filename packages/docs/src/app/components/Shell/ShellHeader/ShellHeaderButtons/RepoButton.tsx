import { ActionIcon } from "@mantine/core";
import { BiLogoGithub } from "react-icons/bi";

const RepoButton = () => {
    return (
        <ActionIcon
            component="a"
            target="_blank"
            href="https://github.com/maxijonson/gpt-turbo"
            size="lg"
            radius="xl"
            variant="default"
        >
            <BiLogoGithub size={20} />
        </ActionIcon>
    );
};

export default RepoButton;
