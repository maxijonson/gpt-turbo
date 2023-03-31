import {
    Button,
    Group,
    Navbar,
    ScrollArea,
    Stack,
    Text,
    createStyles,
} from "@mantine/core";
import useConversationManager from "../hooks/useConversationManager";
import { BiCog, BiPlus } from "react-icons/bi";
import TippedActionIcon from "./TippedActionIcon";
import { openModal } from "@mantine/modals";
import Settings from "./Settings";

const useStyles = createStyles(() => ({
    scrollArea: {
        "& > div": {
            display: "block !important",
        },
    },
}));

export default () => {
    const { conversations, setActiveConversation, activeConversation } =
        useConversationManager();
    const { classes } = useStyles();

    return (
        <Navbar width={{ base: 300 }} p="xs">
            <Navbar.Section>
                <Group position="center">
                    <TippedActionIcon
                        onClick={() => setActiveConversation(null)}
                        tip="Add conversation"
                    >
                        <BiPlus />
                    </TippedActionIcon>
                    <TippedActionIcon
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
                </Group>
            </Navbar.Section>
            <Navbar.Section grow mt="md" h={0}>
                <ScrollArea
                    h="100%"
                    classNames={{
                        viewport: classes.scrollArea,
                    }}
                >
                    <Stack spacing="xs">
                        {conversations.map((conversation) => (
                            <Button
                                key={conversation.id}
                                variant={
                                    conversation.id === activeConversation?.id
                                        ? "light"
                                        : "subtle"
                                }
                                color={
                                    conversation.id === activeConversation?.id
                                        ? "blue"
                                        : "gray"
                                }
                                onClick={() =>
                                    setActiveConversation(conversation.id)
                                }
                            >
                                <Text truncate="end">{conversation.id}</Text>
                            </Button>
                        ))}
                    </Stack>
                </ScrollArea>
            </Navbar.Section>
        </Navbar>
    );
};
