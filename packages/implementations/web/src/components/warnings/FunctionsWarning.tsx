import { Alert, List, Anchor, Center, Button } from "@mantine/core";
import { FaExclamationTriangle } from "react-icons/fa";
import { useAppStore } from "../../store";
import { dismissFunctionsWarning } from "../../store/actions/callableFunctions/dismissFunctionsWarning";

interface FunctionsWarningProps {
    children?: React.ReactNode;
}

const FunctionsWarning = ({ children }: FunctionsWarningProps) => {
    const showFunctionsWarning = useAppStore(
        (state) => state.showFunctionsWarning
    );

    if (!showFunctionsWarning) return <>{children}</>;

    return (
        <Alert
            color="yellow"
            icon={<FaExclamationTriangle />}
            title="Functions Risks"
        >
            <List type="ordered" pr="md">
                <List.Item>
                    Functions usage costs are not currently calculated.
                </List.Item>
                <List.Item>
                    If you specify a function's code to run, it will executed
                    using a JavaScript{" "}
                    <Anchor href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">
                        Function
                    </Anchor>{" "}
                    object, which is safer than "eval" but still has security
                    risks if you copy and paste code from the internet or your
                    device is compromised.
                </List.Item>
                <List.Item>
                    Just like the rest of your data, functions are saved in your
                    browser's local storage. Although it's pretty big, local
                    storage has limited space allocated to each website. you
                    should not store too many functions or write functions that
                    are very long.
                </List.Item>
            </List>
            <Center mt="xs">
                <Button onClick={dismissFunctionsWarning}>
                    I understand the risks. Unlock functions.
                </Button>
            </Center>
        </Alert>
    );
};

export default FunctionsWarning;
