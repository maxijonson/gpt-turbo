import { Container } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import React from "react";
import useSettings from "../hooks/useSettings";
import ConversationForm from "./ConversationForm";
import { ConversationFormValues } from "../contexts/ConversationFormContext";

const SettingsForm = () => {
    const { setSettings } = useSettings();

    const onSubmit = React.useCallback(
        (values: ConversationFormValues) => {
            setSettings(values);
            closeAllModals();
        },
        [setSettings]
    );

    return (
        <Container>
            <ConversationForm onSubmit={onSubmit} />
        </Container>
    );
};

export default SettingsForm;
