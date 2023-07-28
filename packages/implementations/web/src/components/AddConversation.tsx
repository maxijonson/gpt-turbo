import {
    Center,
    Container,
    Stack,
    Title,
    Card,
    createStyles,
    Button,
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
import { useAppStore } from "../store";

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
    const showConversationImport = useAppStore(
        (state) => state.showConversationImport
    );
    const { classes } = useStyles();
    const dropzoneOpenRef = React.useRef<() => void>(null);

    const onSubmit = React.useCallback((values: ConversationFormValues) => {
        const newConversation = addConversation(
            {
                config: {
                    apiKey: values.apiKey,
                    model: values.model,
                    context: values.context,
                    dry: values.dry,
                    disableModeration: values.disableModeration,
                    stream: values.stream,
                    temperature: values.temperature,
                    top_p: values.top_p,
                    frequency_penalty: values.frequency_penalty,
                    presence_penalty: values.presence_penalty,
                    stop: values.stop,
                    max_tokens: values.max_tokens,
                    logit_bias: values.logit_bias,
                    user: values.user,
                },
                requestOptions: {
                    headers: values.headers,
                    proxy: values.proxy,
                },
            },
            values.functionIds,
            values.save
        );
        setActiveConversation(newConversation.id, true);
    }, []);

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
                            <ConversationForm onSubmit={onSubmit} />
                        </Stack>
                    </Card>
                    {showConversationImport && (
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
                                        onClick={() =>
                                            dropzoneOpenRef.current?.()
                                        }
                                    >
                                        Import Conversation
                                    </Button>
                                </Box>
                            </ConversationDropzone>
                        </Card>
                    )}
                </Stack>
            </Center>
        </Container>
    );
};

export default AddConversation;
