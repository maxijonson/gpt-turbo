import {
    Center,
    Container,
    Stack,
    Title,
    Card,
    createStyles,
} from "@mantine/core";
import AddConversationForm from "./AddConversationForm";

const useStyles = createStyles((theme) => ({
    card: {
        width: "100%",

        [theme.fn.largerThan("sm")]: {
            width: 620,
            maxWidth: "100%",
        },
    },
}));

const AddConversation = () => {
    const { classes } = useStyles();

    return (
        <Container h="100%">
            <Center h="100%">
                <Card
                    className={classes.card}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
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

export default AddConversation;
