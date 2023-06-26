import { SimpleGrid } from "@mantine/core";
import usePersistence from "../hooks/usePersistence";
import CallableFunctionCard from "./CallableFunctionCard";
import { useNavigate } from "react-router-dom";

const CallableFunctionsList = () => {
    const {
        persistence: { functions },
    } = usePersistence();
    const navigate = useNavigate();

    return (
        <SimpleGrid cols={2}>
            {functions.map((fn) => (
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
