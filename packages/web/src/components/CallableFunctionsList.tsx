import { SimpleGrid } from "@mantine/core";
import CallableFunctionCard from "./CallableFunctionCard";
import { CallableFunction } from "gpt-turbo";

interface CallableFunctionsListProps {
    callableFunctions: CallableFunction[];
}

const CallableFunctionsList = ({
    callableFunctions,
}: CallableFunctionsListProps) => {
    return (
        <SimpleGrid cols={2}>
            {callableFunctions.map((fn) => (
                <CallableFunctionCard key={fn.id} fn={fn} />
            ))}
        </SimpleGrid>
    );
};

export default CallableFunctionsList;
