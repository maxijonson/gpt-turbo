import { Container, Button } from "@mantine/core";
import { BiArrowBack } from "react-icons/bi";
import { Link, useNavigate, useParams } from "react-router-dom";
import FunctionsWarning from "../components/FunctionsWarning";
import CallableFunctionForm from "../components/CallableFunctionForm";
import React from "react";
import { CallableFunctionFormProviderProps } from "../contexts/providers/CallableFunctionFormProvider";
import usePersistence from "../hooks/usePersistence";
import getErrorInfo from "../utils/getErrorInfo";

const FunctionEditorPage = () => {
    const { saveCallableFunction } = usePersistence();
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);

    const onSubmit = React.useCallback<
        CallableFunctionFormProviderProps["onSubmit"]
    >(
        (values) => {
            try {
                saveCallableFunction(values);
                navigate("/functions");
            } catch (e) {
                setError(getErrorInfo(e).message);
            }
        },
        [navigate, saveCallableFunction]
    );

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
                <CallableFunctionForm
                    onSubmit={onSubmit}
                    error={error}
                    id={id}
                />
            </FunctionsWarning>
        </Container>
    );
};

export default FunctionEditorPage;
