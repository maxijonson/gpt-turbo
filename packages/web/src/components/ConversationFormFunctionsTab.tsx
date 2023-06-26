import { Button, Center, Chip, Divider, Group, Stack } from "@mantine/core";
import FunctionsWarning from "./FunctionsWarning";
import usePersistence from "../hooks/usePersistence";
import useConversationForm from "../hooks/useConversationForm";
import { AiOutlineFunction } from "react-icons/ai";
import { Link } from "react-router-dom";

const ConversationFormFunctionsTab = () => {
    const {
        persistence: { functions },
    } = usePersistence();
    const form = useConversationForm();

    return (
        <FunctionsWarning>
            <Stack>
                <Center>
                    <Button
                        component={Link}
                        to="/functions"
                        variant="default"
                        leftIcon={<AiOutlineFunction />}
                    >
                        Go to functions library
                    </Button>
                </Center>
                {functions.length > 0 && (
                    <>
                        <Divider
                            label="Select Conversation Functions"
                            labelPosition="center"
                        />
                        <Chip.Group
                            {...form.getInputProps("functionIds")}
                            multiple
                        >
                            <Group position="center">
                                {functions.map((fn) => (
                                    <Chip key={fn.id} value={fn.id}>
                                        {fn.displayName}
                                    </Chip>
                                ))}
                            </Group>
                        </Chip.Group>
                    </>
                )}
            </Stack>
        </FunctionsWarning>
    );
};

export default ConversationFormFunctionsTab;
