import { Container } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import React from "react";
import useSettings from "../hooks/useSettings";
import ConversationForm, { ConversationFormValues } from "./ConversationForm";

export default () => {
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
