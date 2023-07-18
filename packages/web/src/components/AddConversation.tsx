import {
    Center,
    Container,
    Stack,
    Title,
    Card,
    createStyles,
    Button,
    Text,
    Box,
} from "@mantine/core";
import React from "react";
import { ConversationFormValues } from "../contexts/ConversationFormContext";
import { addConversation } from "../store/actions/conversations/addConversation";
import { setActiveConversation } from "../store/actions/conversations/setActiveConversation";
import ConversationForm from "./forms/ConversationForm/ConversationForm";
import { BiImport } from "react-icons/bi";
import ConversationDropzone, {
    ConversationNavbarDropzoneProps,
} from "./inputs/ConversationDropzone";
import { importConversations } from "../store/actions/conversations/importConversations";

const useStyles = createStyles((theme) => ({
    card: {
        width: "100%",
        height: "100%",

        [theme.fn.largerThan("sm")]: {
            width: 620,
            maxWidth: "100%",
            height: "unset",
        },
    },
}));

const AddConversation = () => {
    const { classes } = useStyles();
    const dropzoneOpenRef = React.useRef<() => void>(null);

    const onSubmit = React.useCallback(
        ({
            save,
            headers,
            proxy,
            functionIds,
            ...values
        }: ConversationFormValues) => {
            const newConversation = addConversation(
                values,
                { headers, proxy },
                functionIds,
                save
            );
            setActiveConversation(newConversation.id, true);
        },
        []
    );

    const onDrop = React.useCallback<ConversationNavbarDropzoneProps["onDrop"]>(
        async (importedConversations) => {
            const conversations = await importConversations(
                importedConversations
            );

            if (conversations.length) {
                setActiveConversation(conversations[0].id);
            }
        },
        []
    );

    return (
        <Container h="100%" p={0} m={0} fluid>
            <Center h="100%">
                <Stack>
                    <Card
                        className={classes.card}
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                    >
                        <Stack w="100%" h="100%">
                            <Title order={4} align="center">
                                New Conversation
                            </Title>
                            <ConversationForm
                                onSubmit={onSubmit}
                                hideAppSettings
                            />
                        </Stack>
                    </Card>
                    <Card
                        className={classes.card}
                        shadow="sm"
                        padding={0}
                        radius="md"
                        withBorder
                    >
                        <ConversationDropzone
                            onDrop={onDrop}
                            openRef={dropzoneOpenRef}
                        >
                            <Box p="lg">
                                <Button
                                    variant="light"
                                    fullWidth
                                    leftIcon={<BiImport />}
                                    onClick={() => dropzoneOpenRef.current?.()}
                                >
                                    Import Conversation
                                </Button>
                                <Text size="xs" italic align="center">
                                    Tip: You can also drag and drop the
                                    conversation files in the sidebar!
                                </Text>
                            </Box>
                        </ConversationDropzone>
                    </Card>
                </Stack>
            </Center>
        </Container>
    );
};

export default AddConversation;
