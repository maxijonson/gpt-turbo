import { Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { removeAllCallableFunctions } from "../store/actions/callableFunctions/removeAllCallableFunctions";
import { removeAllConversations } from "../store/actions/conversations/removeAllConversations";
import InlineConfirmButton from "./InlineConfirmButton";
import React from "react";
import { resetCallableFunctionWarnings } from "../store/actions/callableFunctions/resetCallableFunctionWarnings";
import { resetDefaultSettings } from "../store/actions/defaultConversationSettings/resetDefaultSettings";
import { removeAllSavedContexts } from "../store/actions/savedContexts/removeAllSavedContexts";
import { removeAllSavedPrompts } from "../store/actions/savedPrompts/removeAllSavedPrompts";

const AppSettingsDangerZone = () => {
    const actions = React.useMemo(
        () => [
            {
                label: "Delete conversations",
                unconfirmedLabel: "Delete",
                action: removeAllConversations,
            },
            {
                label: "Delete Functions",
                unconfirmedLabel: "Delete",
                action: removeAllCallableFunctions,
            },
            {
                label: "Delete Saved Contexts",
                unconfirmedLabel: "Delete",
                action: removeAllSavedContexts,
            },
            {
                label: "Delete Saved Prompts",
                unconfirmedLabel: "Delete",
                action: removeAllSavedPrompts,
            },
            {
                label: "Reset Function Warnings",
                unconfirmedLabel: "Reset",
                action: resetCallableFunctionWarnings,
            },
            {
                label: "Reset Default Settings",
                unconfirmedLabel: "Reset",
                action: resetDefaultSettings,
            },
        ],
        []
    );

    return (
        <Stack>
            <SimpleGrid cols={1} breakpoints={[{ minWidth: "sm", cols: 2 }]}>
                {actions.map(({ label, unconfirmedLabel, action }) => (
                    <Group key={label} position="apart">
                        <Text size="sm">{label}</Text>
                        <InlineConfirmButton
                            color="red"
                            onConfirm={action}
                            confirm={`${unconfirmedLabel}?`}
                        >
                            {unconfirmedLabel}
                        </InlineConfirmButton>
                    </Group>
                ))}
            </SimpleGrid>
        </Stack>
    );
};

export default AppSettingsDangerZone;
