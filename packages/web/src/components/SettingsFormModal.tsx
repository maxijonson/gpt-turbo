import { Container, Modal, ModalProps, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useSettings from "../hooks/useSettings";
import React from "react";
import { ConversationFormValues } from "../contexts/ConversationFormContext";
import ConversationForm from "./ConversationForm";

type SettingsFormModalProps = ModalProps;

const SettingsFormModal = ({
    onClose,
    ...modalProps
}: SettingsFormModalProps) => {
    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    const { setSettings } = useSettings();

    const onSubmit = React.useCallback(
        (values: ConversationFormValues) => {
            setSettings(values);
            onClose();
        },
        [onClose, setSettings]
    );

    return (
        <Modal
            fullScreen={isSm}
            centered
            size="lg"
            title="Default Conversation Settings"
            {...modalProps}
            onClose={onClose}
        >
            <Container>
                <ConversationForm onSubmit={onSubmit} />
            </Container>
        </Modal>
    );
};

export default SettingsFormModal;
