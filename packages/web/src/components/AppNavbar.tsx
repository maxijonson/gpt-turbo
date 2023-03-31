import { Button, Navbar, Stack, Text } from "@mantine/core";
import useConversationManager from "../hooks/useConversationManager";
import { BiPlus } from "react-icons/bi";

export default () => {
    const { conversations, setActiveConversation, activeConversation } =
        useConversationManager();

    return (
        <Navbar width={{ base: 300 }} p="xs">
            <Navbar.Section>
                <Button
                    fullWidth
                    variant="outline"
                    color="gray"
                    leftIcon={<BiPlus />}
                    onClick={() => setActiveConversation(null)}
                >
                    New Conversation
                </Button>
            </Navbar.Section>
            <Navbar.Section grow mt="md">
                <Stack spacing="xs">
                    {conversations.map((conversation) => (
                        <Button
                            key={conversation.id}
                            fullWidth
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
            </Navbar.Section>
        </Navbar>
    );
};
