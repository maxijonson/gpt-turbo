import { ActionIcon, Anchor, Group, Text, createStyles } from "@mantine/core";
import { Conversation } from "gpt-turbo";
import useConversationManager from "../hooks/useConversationManager";
import { BiCheck, BiPencil, BiTrash, BiX } from "react-icons/bi";
import React from "react";

interface NavbarConversationProps {
    conversation: Conversation;
}

const useStyles = createStyles(
    (theme, { isActive }: { isActive: boolean }) => ({
        root: {
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            textDecoration: "none",
            fontWeight: 600,
            borderRadius: theme.radius.sm,
            backgroundColor: isActive ? theme.colors.blue[0] : "transparent",
            height: "2.5rem",

            "&:hover": {
                textDecoration: "none",
                backgroundColor: isActive
                    ? theme.colors.blue[0]
                    : theme.colors.gray[1],
            },
        },
    })
);

export default ({ conversation }: NavbarConversationProps) => {
    const { activeConversation, setActiveConversation, removeConversation } =
        useConversationManager();
    const [isDeleting, setIsDeleting] = React.useState(false);
    const isActive = conversation.id === activeConversation?.id;
    const { classes } = useStyles({ isActive });

    const onDelete = React.useCallback(() => {
        removeConversation(conversation.id);
        setIsDeleting(false);
    }, [conversation.id, removeConversation]);

    return (
        <Anchor
            className={classes.root}
            color={isActive ? "blue" : "gray"}
            px="xs"
            py="xs"
            onClick={() => setActiveConversation(conversation.id)}
        >
            <Text size="sm" truncate="end">
                {conversation.id}
            </Text>
            {isActive && (
                <Group noWrap spacing={2}>
                    {isDeleting ? (
                        <>
                            <ActionIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                            >
                                <BiCheck />
                            </ActionIcon>
                            <ActionIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDeleting(false);
                                }}
                            >
                                <BiX />
                            </ActionIcon>
                        </>
                    ) : (
                        <>
                            <ActionIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <BiPencil />
                            </ActionIcon>
                            <ActionIcon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDeleting(true);
                                }}
                            >
                                <BiTrash />
                            </ActionIcon>
                        </>
                    )}
                </Group>
            )}
        </Anchor>
    );
};
