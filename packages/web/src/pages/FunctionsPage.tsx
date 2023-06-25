import { Button, Container, Group, Title } from "@mantine/core";
import { BiArrowBack, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import FunctionsWarning from "../components/FunctionsWarning";

const FunctionsPage = () => {
    return (
        <Container w="100%" mt="xl">
            <Button
                component={Link}
                to="/"
                leftIcon={<BiArrowBack />}
                variant="outline"
            >
                Back to conversations
            </Button>
            <FunctionsWarning>
                <Group position="apart">
                    <Title>Functions Library</Title>
                    <Button
                        component={Link}
                        to="/functions/create"
                        leftIcon={<BiPlus />}
                        variant="gradient"
                    >
                        Create
                    </Button>
                </Group>
            </FunctionsWarning>
        </Container>
    );
};

export default FunctionsPage;
