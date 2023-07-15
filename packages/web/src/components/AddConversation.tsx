import {
    Center,
    Container,
    Stack,
    Title,
    Card,
    createStyles,
} from "@mantine/core";
import React from "react";
import { ConversationFormValues } from "../contexts/ConversationFormContext";
import { addConversation } from "../store/actions/conversations/addConversation";
import { setActiveConversation } from "../store/actions/conversations/setActiveConversation";
import { addPersistedConversationId } from "../store/actions/persistence/addPersistedConversationId";
import ConversationForm from "./forms/ConversationForm/ConversationForm";
import { useGetFunction } from "../store/hooks/callableFunctions/useGetFunction";

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
    const getFunction = useGetFunction();

    const onSubmit = React.useCallback(
        ({
            save,
            headers,
            proxy,
            functionIds,
            ...values
        }: ConversationFormValues) => {
            const newConversation = addConversation(values, { headers, proxy });
            setActiveConversation(newConversation.id, true);

            for (const functionId of functionIds) {
                const callableFunction = getFunction(functionId);
                if (callableFunction) {
                    newConversation.addFunction(callableFunction);
                }
            }

            if (save) {
                addPersistedConversationId(newConversation.id);
            }
        },
        [getFunction]
    );

    return (
        <Container h="100%" p={0} m={0} fluid>
            <Center h="100%">
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
                        <ConversationForm onSubmit={onSubmit} hideAppSettings />
                    </Stack>
                </Card>
            </Center>
        </Container>
    );
};

export default AddConversation;
