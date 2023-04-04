import { Tooltip, Stack, Group, Button, Text } from "@mantine/core";
import { getMessageSize, getMessageCost, Conversation } from "gpt-turbo";
import getPriceString from "../utils/getPriceString";
import React from "react";

interface PromptUsageProps {
    prompt: string;
    conversation: Conversation;
    mode: "size" | "value";
    onUsageClick: () => void;
}

export default ({
    prompt,
    conversation,
    mode,
    onUsageClick,
}: PromptUsageProps) => {
    const usageDisplay =
        mode === "size"
            ? getMessageSize(prompt)
            : getPriceString(
                  getMessageCost(
                      prompt,
                      conversation.getConfig().model,
                      "prompt"
                  )
              );

    return (
        <Tooltip
            withArrow
            label={
                <Stack spacing="xs">
                    <Group noWrap>
                        <Text sx={{ flexGrow: 1 }}>Message size:</Text>
                        <Text>{getMessageSize(prompt)} tkns</Text>
                    </Group>
                    <Group noWrap>
                        <Text sx={{ flexGrow: 1 }}>Message cost:</Text>
                        <Text>
                            {getPriceString(
                                getMessageCost(
                                    prompt,
                                    conversation.getConfig().model,
                                    "prompt"
                                )
                            )}
                        </Text>
                    </Group>
                </Stack>
            }
        >
            <Button variant="subtle" p="xs" onClick={onUsageClick}>
                {usageDisplay}
            </Button>
        </Tooltip>
    );
};
