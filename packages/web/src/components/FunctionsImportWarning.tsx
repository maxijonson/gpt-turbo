import { Alert, List, Center, Button, Text } from "@mantine/core";
import { FaExclamationTriangle } from "react-icons/fa";
import useCallableFunctions from "../hooks/useCallableFunctions";

interface FunctionsImportWarningProps {
    children?: React.ReactNode;
}

const FunctionsImportWarning = ({ children }: FunctionsImportWarningProps) => {
    const { dismissFunctionsImportWarning, showFunctionsImportWarning } =
        useCallableFunctions();

    if (!showFunctionsImportWarning) return <>{children}</>;

    return (
        <Alert
            color="yellow"
            icon={<FaExclamationTriangle />}
            title="Importing Functions Risks"
        >
            <Text>
                Heads up! You're about to import a function (possibly from the
                internet). Functions in general are already risky if you don't
                know what they do, but importing them from the outside is even
                riskier! Please review the following risks before continuing:
            </Text>
            <List type="ordered" pr="md">
                <List.Item>
                    <Text span weight="bold">
                        If you don't know what each statement in the function
                        code does (or don't even know what code is!), you should
                        probably not import it
                    </Text>
                    . Malicious actors may try to trick you into importing a
                    function that does work in the way you'd expect, but also
                    does something else that you don't want, such as stealing
                    your browser's data.
                </List.Item>
                <List.Item>
                    The functions feature does not scan for malicious code. It
                    actually doesn't even check if the code is valid JavaScript
                    all!
                </List.Item>
            </List>
            <Center mt="xs">
                <Button onClick={dismissFunctionsImportWarning} color="red">
                    I understand the risks. Unlock imports.
                </Button>
            </Center>
        </Alert>
    );
};

export default FunctionsImportWarning;
