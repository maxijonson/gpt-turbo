import { SimpleGrid } from "@mantine/core";
import CallableFunctionCard from "./CallableFunctionCard";
import { useNavigate } from "react-router-dom";
import useCallableFunctions from "../hooks/useCallableFunctions";

const CallableFunctionsList = () => {
    const { callableFunctions } = useCallableFunctions();
    const navigate = useNavigate();

    return (
        <SimpleGrid cols={2}>
            {callableFunctions.map((fn) => (
                <CallableFunctionCard
                    key={fn.id}
                    fn={fn}
                    onClick={() => navigate(`/functions/edit/${fn.id}`)}
                />
            ))}
        </SimpleGrid>
    );
};

export default CallableFunctionsList;
