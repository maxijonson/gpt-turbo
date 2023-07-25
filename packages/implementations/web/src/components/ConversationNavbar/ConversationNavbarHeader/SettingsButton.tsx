import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { BiCog } from "react-icons/bi";
import TippedActionIcon from "../../common/TippedActionIcon";
import AppSettings from "../../AppSettings/AppSettings";
import { Modal, useMantineTheme } from "@mantine/core";

const SettingsButton = () => {
    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
    const [settingsOpened, { open: openSettings, close: closeSettings }] =
        useDisclosure();

    return (
        <>
            <TippedActionIcon
                variant="outline"
                tip="Settings"
                onClick={openSettings}
            >
                <BiCog />
            </TippedActionIcon>
            <Modal
                centered
                opened={settingsOpened}
                onClose={closeSettings}
                fullScreen={isSm}
                size="xl"
                title="Settings"
            >
                <AppSettings />
            </Modal>
        </>
    );
};

export default SettingsButton;
