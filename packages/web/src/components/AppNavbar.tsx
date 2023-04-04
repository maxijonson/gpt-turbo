import {
    Divider,
    Group,
    Navbar,
    ScrollArea,
    Stack,
    createStyles,
    useMantineColorScheme,
} from "@mantine/core";
import useConversationManager from "../hooks/useConversationManager";
import {
    BiCog,
    BiDollar,
    BiMoon,
    BiPlus,
    BiSun,
    BiTrash,
} from "react-icons/bi";
import TippedActionIcon from "./TippedActionIcon";
import { openModal } from "@mantine/modals";
import Settings from "./Settings";
import NavbarConversation from "./NavbarConversation";
import React from "react";
import Usage from "./Usage";

const useStyles = createStyles(() => ({
    scrollArea: {
        "& > div": {
            display: "block !important",
        },
    },
}));

export default () => {
    const {
        conversations,
        activeConversation,
        setActiveConversation,
        removeAllConversations,
        showUsage,
        setShowUsage,
    } = useConversationManager();
    const { classes } = useStyles();
    const [isClearingAll, setIsClearingAll] = React.useState(false);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    const onClearAllClick = React.useCallback(() => {
        if (isClearingAll) {
            removeAllConversations();
        }
        setIsClearingAll((c) => !c);

        if (!isClearingAll) {
            setTimeout(() => {
                setIsClearingAll(false);
            }, 3000);
        }
    }, [isClearingAll, removeAllConversations]);

    return (
        <Navbar width={{ base: 300 }} p="xs">
            <Navbar.Section>
                <Group position="center">
                    <TippedActionIcon
                        variant="outline"
                        tip="Settings"
                        onClick={() =>
                            openModal({
                                children: <Settings />,
                                centered: true,
                                size: "lg",
                                title: "Settings",
                            })
                        }
                    >
                        <BiCog />
                    </TippedActionIcon>
                    <TippedActionIcon
                        tip={dark ? "Light mode" : "Dark mode"}
                        variant="outline"
                        onClick={() => toggleColorScheme()}
                    >
                        {dark ? <BiSun /> : <BiMoon />}
                    </TippedActionIcon>
                    {activeConversation && (
                        <TippedActionIcon
                            variant="outline"
                            onClick={() => setActiveConversation(null)}
                            tip="Add conversation"
                        >
                            <BiPlus />
                        </TippedActionIcon>
                    )}
                    {conversations.length && (
                        <TippedActionIcon
                            variant={isClearingAll ? "filled" : "outline"}
                            color={isClearingAll ? "red" : "gray"}
                            tip={
                                isClearingAll
                                    ? "Confirm"
                                    : "Clear all conversations"
                            }
                            onClick={onClearAllClick}
                        >
                            <BiTrash />
                        </TippedActionIcon>
                    )}
                    {activeConversation && (
                        <TippedActionIcon
                            tip={showUsage ? "Hide usage" : "Show usage"}
                            variant="outline"
                            onClick={() => setShowUsage((c) => !c)}
                        >
                            <BiDollar />
                        </TippedActionIcon>
                    )}
                </Group>
                <Divider my="xs" />
            </Navbar.Section>
            <Navbar.Section grow h={0}>
                <ScrollArea
                    h="100%"
                    classNames={{
                        viewport: classes.scrollArea,
                    }}
                >
                    <Stack spacing="xs">
                        {conversations.map((conversation) => (
                            <NavbarConversation
                                key={conversation.id}
                                conversation={conversation}
                            />
                        ))}
                    </Stack>
                </ScrollArea>
            </Navbar.Section>
            {activeConversation && showUsage && (
                <Navbar.Section>
                    <Divider my="xs" />
                    <Usage conversation={activeConversation} />
                </Navbar.Section>
            )}
        </Navbar>
    );
};
