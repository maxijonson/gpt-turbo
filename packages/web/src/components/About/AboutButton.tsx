import { Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaRegQuestionCircle } from "react-icons/fa";
import TippedActionIcon from "../common/TippedActionIcon";
import About from "./About";

const AboutButton = () => {
    const [showAbout, { open: openAbout, close: closeAbout }] = useDisclosure();

    return (
        <>
            <TippedActionIcon
                tip="About this project"
                onClick={openAbout}
                size="xs"
            >
                <FaRegQuestionCircle />
            </TippedActionIcon>
            <Modal
                opened={showAbout}
                onClose={closeAbout}
                size="lg"
                centered
                title={<Text weight="bold">About GPT Turbo Web</Text>}
            >
                <About />
            </Modal>
        </>
    );
};

export default AboutButton;
