import { SimpleGrid } from "@mantine/core";
import usePersistence from "../hooks/usePersistence";
import CallableFunctionCard from "./CallableFunctionCard";

const CallableFunctionsList = () => {
    const {
        persistence: { functions },
    } = usePersistence();

    return (
        <SimpleGrid cols={2}>
            {functions.map((fn) => (
                <CallableFunctionCard key={fn.id} fn={fn} />
            ))}
        </SimpleGrid>
    );
};

export default CallableFunctionsList;
