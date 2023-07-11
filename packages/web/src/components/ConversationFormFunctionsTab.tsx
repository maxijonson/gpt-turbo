import { Button, Center, Chip, Divider, Group, Stack } from "@mantine/core";
import FunctionsWarning from "./FunctionsWarning";
import useConversationForm from "../hooks/useConversationForm";
import { AiOutlineFunction } from "react-icons/ai";
import { Link } from "react-router-dom";
import useCallableFunctions from "../hooks/useCallableFunctions";
import { useAppStore } from "../store";

const ConversationFormFunctionsTab = () => {
    const callableFunctions = useAppStore((state) => state.callableFunctions);
    const { getCallableFunctionDisplayName } = useCallableFunctions();
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
                {callableFunctions.length > 0 && (
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
                                {callableFunctions.map((fn) => (
                                    <Chip key={fn.id} value={fn.id}>
                                        {getCallableFunctionDisplayName(fn.id)}
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
