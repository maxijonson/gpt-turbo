import { Modal, ScrollArea, Stack, Textarea } from "@mantine/core";
import { BiFolder, BiSave } from "react-icons/bi";
import TippedActionIcon from "./TippedActionIcon";
import { useDisclosure } from "@mantine/hooks";
import SaveContextModalBody from "./SavePromptModalBody";
import SavedContextsModalBody from "./SavedPromptsModalBody";
import usePersistence from "../hooks/usePersistence";

interface ContextInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default ({ value, onChange }: ContextInputProps) => {
    const {
        persistence: { contexts },
    } = usePersistence();
    const [
        showSaveContextModal,
        { open: openSaveContextModal, close: closeSaveContextModal },
    ] = useDisclosure(false);
    const [
        showSavedContextsModal,
        { open: openSavedContextsModal, close: closeSavedContextsModal },
    ] = useDisclosure(false);

    return (
        <>
            <Textarea
                value={value}
                onChange={(event) => onChange(event.currentTarget.value)}
                autosize
                minRows={3}
                maxRows={5}
                label="Context"
                rightSection={
                    <Stack spacing="xs">
                        {contexts.length > 0 && (
                            <TippedActionIcon
                                tip="Show Saved Contexts"
                                onClick={openSavedContextsModal}
                            >
                                <BiFolder />
                            </TippedActionIcon>
                        )}
                        <TippedActionIcon
                            tip="Save context"
                            onClick={openSaveContextModal}
                        >
                            <BiSave />
                        </TippedActionIcon>
                    </Stack>
                }
            />
            <Modal
                opened={showSaveContextModal}
                onClose={closeSaveContextModal}
                title="Save Context"
                centered
            >
                <SaveContextModalBody
                    mode="context"
                    value={value}
                    close={closeSaveContextModal}
                />
            </Modal>
            <Modal
                opened={showSavedContextsModal}
                onClose={closeSavedContextsModal}
                title="Saved Contexts"
                centered
                scrollAreaComponent={ScrollArea.Autosize}
                size="lg"
            >
                <SavedContextsModalBody
                    mode="context"
                    onSelect={onChange}
                    close={closeSavedContextsModal}
                />
            </Modal>
        </>
    );
};
