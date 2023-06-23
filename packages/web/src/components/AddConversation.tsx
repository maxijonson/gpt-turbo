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
                        <AddConversationForm />
                    </Stack>
                </Card>
            </Center>
        </Container>
    );
};

export default AddConversation;
