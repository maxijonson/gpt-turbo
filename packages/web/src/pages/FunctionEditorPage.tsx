import { Container, Button } from "@mantine/core";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import FunctionsWarning from "../components/FunctionsWarning";
import CallableFunctionForm from "../components/CallableFunctionForm";

const FunctionEditorPage = () => {
    return (
        <Container w="100%" mt="xl">
            <Button
                component={Link}
                to="/functions"
                leftIcon={<BiArrowBack />}
                variant="subtle"
            >
                Back to library
            </Button>
            <FunctionsWarning>
                <CallableFunctionForm />
            </FunctionsWarning>
        </Container>
    );
};

export default FunctionEditorPage;
