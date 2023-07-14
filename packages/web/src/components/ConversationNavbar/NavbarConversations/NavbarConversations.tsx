import {
    Divider,
    Group,
    ScrollArea,
    Stack,
    Text,
    createStyles,
} from "@mantine/core";
import NavbarConversation from "./NavbarConversation";
import React from "react";
import TippedActionIcon from "../../common/TippedActionIcon";
import { BiTrash } from "react-icons/bi";
import { useTimeout } from "@mantine/hooks";
import { useAppStore } from "../../../store";
import { removeConversation } from "../../../store/actions/conversations/removeConversation";
import { useGetConversationLastEdit } from "../../../store/hooks/conversations/useGetConversationLastEdit";

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

const NavbarConversations = ({
    onConversationSelect = () => {},
}: NavbarConversationsProps) => {
    const { classes } = useStyles();
    const conversations = useAppStore((state) => state.conversations);
    const getConversationLastEdit = useGetConversationLastEdit();
    const [deleteConfirmation, setdeleteConfirmation] = React.useState<
        string | null
    >(null);
    const { start: startUnconfirmDelete, clear: clearUnconfirmDelete } =
        useTimeout(() => setdeleteConfirmation(null), 3000);

    const conversationGroups = React.useMemo(() => {
        return conversations
            .map((c) => ({
                conversation: c,
                lastEdit: getConversationLastEdit(c.id) ?? Date.now(),
            }))
            .sort((a, b) => b.lastEdit - a.lastEdit)
            .reduce((acc, { conversation, lastEdit }) => {
                const relativeDate = getRelativeDate(lastEdit);
                if (!acc[relativeDate]) {
                    acc[relativeDate] = [];
                }
                acc[relativeDate].push(conversation);
                return acc;
            }, {} as Record<string, typeof conversations>);
    }, [conversations, getConversationLastEdit]);

    const makeDeleteGroup = React.useCallback(
        (group: string) => () => {
            if (deleteConfirmation === group) {
                conversationGroups[group].forEach((c) =>
                    removeConversation(c.id)
                );
            } else {
                clearUnconfirmDelete();
                setdeleteConfirmation(group);
                startUnconfirmDelete();
            }
        },
        [
            clearUnconfirmDelete,
            conversationGroups,
            deleteConfirmation,
            startUnconfirmDelete,
        ]
    );

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
                            <Group>
                                <Divider
                                    sx={{ flexGrow: 1 }}
                                    label={
                                        <Text
                                            size="xs"
                                            weight={700}
                                            opacity={0.7}
                                        >
                                            {relativeDate}
                                        </Text>
                                    }
                                />
                                <TippedActionIcon
                                    onClick={makeDeleteGroup(relativeDate)}
                                    variant={
                                        deleteConfirmation === relativeDate
                                            ? "filled"
                                            : undefined
                                    }
                                    color={
                                        deleteConfirmation === relativeDate
                                            ? "red"
                                            : undefined
                                    }
                                    tip={
                                        relativeDate === "Older"
                                            ? "Delete all older conversations"
                                            : `Delete all conversations from ${relativeDate.toLowerCase()}`
                                    }
                                >
                                    <BiTrash />
                                </TippedActionIcon>
                            </Group>
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

export default NavbarConversations;
