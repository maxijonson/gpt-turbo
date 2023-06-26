import { Chip, Group, Stack } from "@mantine/core";
import FunctionsWarning from "./FunctionsWarning";
import usePersistence from "../hooks/usePersistence";

const ConversationFormFunctionsTab = () => {
    const {
        persistence: { functions },
    } = usePersistence();

    return (
        <Stack>
            <FunctionsWarning>
                <Chip.Group multiple>
                    <Group position="center">
                        {functions.map((fn) => (
                            <Chip key={fn.id} value={fn.id}>
                                {fn.displayName}
                            </Chip>
                        ))}
                    </Group>
                </Chip.Group>
            </FunctionsWarning>
        </Stack>
    );
};

export default ConversationFormFunctionsTab;
