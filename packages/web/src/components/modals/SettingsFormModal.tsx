import { Container, Modal, ModalProps, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import { ConversationFormValues } from "../../contexts/ConversationFormContext";
import ConversationForm from "../forms/ConversationForm/ConversationForm";
import { useAppStore } from "../../store";
import { setDefaultSettings } from "../../store/actions/defaultConversationSettings/setDefaultSettings";

type SettingsFormModalProps = ModalProps;

const SettingsFormModal = ({
    onClose,
    ...modalProps
}: SettingsFormModalProps) => {
    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
    const settings = useAppStore((state) => state.defaultSettings);

    const onSubmit = React.useCallback(
        (values: ConversationFormValues) => {
            setDefaultSettings({
                ...settings,
                ...values,
            });
            onClose();
        },
        [onClose, settings]
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
