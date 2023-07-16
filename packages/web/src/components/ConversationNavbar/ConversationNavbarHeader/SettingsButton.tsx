import { useDisclosure } from "@mantine/hooks";
import { BiCog } from "react-icons/bi";
import TippedActionIcon from "../../common/TippedActionIcon";
import SettingsFormModal from "../../modals/SettingsFormModal";

const SettingsButton = () => {
    const [settingsOpened, { open: openSettings, close: closeSettings }] =
        useDisclosure();

    return (
        <>
            <TippedActionIcon
                variant="outline"
                tip="Default Conversation Settings"
                onClick={openSettings}
            >
                <BiCog />
            </TippedActionIcon>
            <SettingsFormModal
                opened={settingsOpened}
                onClose={closeSettings}
            />
        </>
    );
};

export default SettingsButton;
