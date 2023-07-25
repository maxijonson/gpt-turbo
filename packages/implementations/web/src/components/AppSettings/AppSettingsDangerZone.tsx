import { Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { removeAllCallableFunctions } from "../../store/actions/callableFunctions/removeAllCallableFunctions";
import { removeAllConversations } from "../../store/actions/conversations/removeAllConversations";
import InlineConfirmButton from "../common/InlineConfirmButton";
import React from "react";
import { resetCallableFunctionWarnings } from "../../store/actions/callableFunctions/resetCallableFunctionWarnings";
import { resetDefaultSettings } from "../../store/actions/defaultConversationSettings/resetDefaultSettings";
import { removeAllSavedContexts } from "../../store/actions/savedContexts/removeAllSavedContexts";
import { removeAllSavedPrompts } from "../../store/actions/savedPrompts/removeAllSavedPrompts";
import { useAppStore } from "../../store";
import { shallow } from "zustand/shallow";

const AppSettingsDangerZone = () => {
    const [conversations, functions, contexts, prompts] = useAppStore(
        (state) => [
            state.conversations,
            state.callableFunctions,
            state.savedContexts,
            state.savedPrompts,
        ],
        shallow
    );

    const actions = React.useMemo(
        () => [
            {
                label: `Delete all conversations (${conversations.length})`,
                unconfirmedLabel: "Delete",
                action: removeAllConversations,
            },
            {
                label: `Delete all functions (${functions.length})`,
                unconfirmedLabel: "Delete",
                action: removeAllCallableFunctions,
            },
            {
                label: `Delete all saved contexts (${contexts.length})`,
                unconfirmedLabel: "Delete",
                action: removeAllSavedContexts,
            },
            {
                label: `Delete all saved prompts (${prompts.length})`,
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
        [
            contexts.length,
            conversations.length,
            functions.length,
            prompts.length,
        ]
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
