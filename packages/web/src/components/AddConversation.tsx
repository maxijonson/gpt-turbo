import { Center, Container, Stack, Title, Card } from "@mantine/core";
import AddConversationForm from "./AddConversationForm";

export default () => {
    return (
        <Container h="100%">
            <Center h="100%">
                <Card
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    w="100%"
                    miw={620}
                >
                    <Stack w="100%">
                        <Title align="center">New Conversation</Title>
                        <AddConversationForm />
                    </Stack>
                </Card>
            </Center>
        </Container>
    );
};
