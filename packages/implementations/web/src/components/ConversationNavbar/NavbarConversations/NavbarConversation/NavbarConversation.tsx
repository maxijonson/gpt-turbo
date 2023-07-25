import { Anchor, Box, Group, Stack, Text, createStyles } from "@mantine/core";
import { Conversation } from "gpt-turbo";
import React from "react";
import NavbarConversationInfo from "../NavbarConversationInfo";
import { setActiveConversation } from "../../../../store/actions/conversations/setActiveConversation";
import { useActiveConversation } from "../../../../store/hooks/conversations/useActiveConversation";
import { useGetConversationName } from "../../../../store/hooks/conversations/useGetConversationName";
import { DEFAULT_CONVERSATION_NAME } from "../../../../config/constants";
import NavbarConversationMenu from "./NavbarConversationMenu";

interface NavbarConversationProps {
    conversation: Conversation;
    onClick?: () => void;
}

const useStyles = createStyles((theme, { isActive }: { isActive: boolean }) => {
    const dark = theme.colorScheme === "dark";
    let backgroundColor: string | undefined;
    let hoverBackgroundColor: string | undefined;
    let color: string | undefined;

    if (dark && isActive) {
        backgroundColor = theme.colors.blue[7];
        hoverBackgroundColor = theme.colors.blue[8];
        color = theme.white;
    } else if (dark && !isActive) {
        backgroundColor = undefined;
        hoverBackgroundColor = theme.colors.dark[6];
        color = theme.white;
    } else if (isActive) {
        backgroundColor = theme.colors.blue[1];
        hoverBackgroundColor = theme.colors.blue[2];
        color = theme.colors.blue[7];
    } else {
        backgroundColor = undefined;
        hoverBackgroundColor = theme.colors.gray[1];
        color = theme.colors.gray[8];
    }

    return {
        root: {
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            fontWeight: 600,
            borderRadius: theme.radius.sm,
            backgroundColor,
            color,

            "&:hover": {
                textDecoration: "none",
                backgroundColor: hoverBackgroundColor,
            },
        },
    };
});

const NavbarConversation = ({
    conversation,
    onClick,
}: NavbarConversationProps) => {
    const activeConversation = useActiveConversation();
    const getConversationName = useGetConversationName();
    const isActive = conversation.id === activeConversation?.id;
    const { classes } = useStyles({ isActive });

    const name = React.useMemo(() => {
        return (
            getConversationName(conversation.id) ?? DEFAULT_CONVERSATION_NAME
        );
    }, [conversation.id, getConversationName]);

    return (
        <Anchor
            className={classes.root}
            px="xs"
            py="xs"
            onClick={() => {
                setActiveConversation(conversation.id);
                onClick?.();
            }}
        >
            <Group noWrap w="100%">
                {/* FIXME: max-width: 83% is fine in most cases, but not perfect on mobile */}
                <Stack spacing={0} sx={{ flexGrow: 1 }} maw="83%">
                    <Text size="sm" truncate="end">
                        {name}
                    </Text>
                    <NavbarConversationInfo conversation={conversation} />
                </Stack>
                <Box onClick={(e) => e.stopPropagation()}>
                    <NavbarConversationMenu conversationId={conversation.id} />
                </Box>
            </Group>
        </Anchor>
    );
};

export default NavbarConversation;
