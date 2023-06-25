import { Button, Container, Group, Title } from "@mantine/core";
import { BiArrowBack, BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import FunctionsWarning from "../components/FunctionsWarning";
import CallableFunctionsList from "../components/CallableFunctionsList";

const FunctionsPage = () => {
    return (
        <Container w="100%" mt="xl">
            <Button
                component={Link}
                to="/"
                leftIcon={<BiArrowBack />}
                variant="subtle"
            >
                Back to conversations
            </Button>
            <FunctionsWarning>
                <Group position="apart" mb="md">
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
                <CallableFunctionsList />
            </FunctionsWarning>
        </Container>
    );
};

export default FunctionsPage;
