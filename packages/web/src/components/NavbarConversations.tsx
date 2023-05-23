import { Divider, ScrollArea, Stack, Text, createStyles } from "@mantine/core";
import NavbarConversation from "./NavbarConversation";
import useConversationManager from "../hooks/useConversationManager";
import React from "react";

interface NavbarConversationsProps {
    onConversationSelect?: () => void;
}

const useStyles = createStyles(() => ({
    scrollArea: {
        "& > div": {
            display: "block !important",
        },
    },
}));

const getRelativeDate = (target: number) => {
    const currentDate = new Date();
    const targetDate = new Date(target);

    // Get the start of today
    const todayStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
    );

    // Get the start of yesterday
    const yesterdayStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 1
    );

    // Get the start of this week
    const thisWeekStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay()
    );

    // Get the start of this month
    const thisMonthStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );

    if (targetDate >= todayStart) {
        return "Today";
    } else if (targetDate >= yesterdayStart) {
        return "Yesterday";
    } else if (targetDate >= thisWeekStart) {
        return "This Week";
    } else if (targetDate >= thisMonthStart) {
        return "This Month";
    } else {
        return "Older";
    }
};

export default ({
    onConversationSelect = () => {},
}: NavbarConversationsProps) => {
    const { classes } = useStyles();
    const { conversations: allConversations, getConversationLastEdit } =
        useConversationManager();

    const conversationGroups = React.useMemo(() => {
        return allConversations
            .map((c) => ({
                conversation: c,
                lastEdit: getConversationLastEdit(c.id),
            }))
            .sort((a, b) => b.lastEdit - a.lastEdit)
            .reduce((acc, { conversation, lastEdit }) => {
                const relativeDate = getRelativeDate(lastEdit);
                if (!acc[relativeDate]) {
                    acc[relativeDate] = [];
                }
                acc[relativeDate].push(conversation);
                return acc;
            }, {} as Record<string, typeof allConversations>);
    }, [allConversations, getConversationLastEdit]);

    return (
        <ScrollArea
            h="100%"
            classNames={{
                viewport: classes.scrollArea,
            }}
        >
            <Stack spacing="xs">
                {Object.entries(conversationGroups).map(
                    ([relativeDate, conversations]) => (
                        <Stack key={relativeDate} spacing="xs">
                            <Divider
                                labelPosition="center"
                                label={
                                    <Text size="xs" weight={700} opacity={0.7}>
                                        {relativeDate}
                                    </Text>
                                }
                            />
                            {conversations.map((conversation) => (
                                <NavbarConversation
                                    key={conversation.id}
                                    conversation={conversation}
                                    onClick={onConversationSelect}
                                />
                            ))}
                        </Stack>
                    )
                )}
            </Stack>
        </ScrollArea>
    );
};
