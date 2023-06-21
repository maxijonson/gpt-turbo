import { Alert, List, Anchor, Center, Button } from "@mantine/core";
import { FaExclamationTriangle } from "react-icons/fa";
import usePersistence from "../hooks/usePersistence";

// const f = new Function("a", "b", "return a - b");
// console.log(f(2, 1));

const FunctionsWarning = () => {
    const { dismissFunctionsWarning, persistence } = usePersistence();

    if (persistence.functionsWarning === false) return null;

    return (
        <Alert
            color="yellow"
            icon={<FaExclamationTriangle />}
            title="Functions Risks"
        >
            <List type="ordered">
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
            </List>
            <Center mt="xs">
                <Button onClick={dismissFunctionsWarning}>
                    I understand the risks
                </Button>
            </Center>
        </Alert>
    );
};

export default FunctionsWarning;
