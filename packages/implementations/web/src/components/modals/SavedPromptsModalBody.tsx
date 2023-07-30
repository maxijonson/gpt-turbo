import { Accordion, Box, Stack } from "@mantine/core";
import TippedActionIcon from "../common/TippedActionIcon";
import { BiImport, BiTrash } from "react-icons/bi";
import React from "react";
import { useAppStore } from "../../store";
import { removeSavedContext } from "../../store/actions/savedContexts/removeSavedContext";
import { removeSavedPrompt } from "../../store/actions/savedPrompts/removeSavedPrompt";

interface SavedContextsModalBodyProps {
    onSelect: (value: string) => void;
    close: () => void;
    mode: "context" | "prompt";
}

const SavedPromptsModalBody = ({
    close,
    onSelect,
    mode,
}: SavedContextsModalBodyProps) => {
    const savedContexts = useAppStore((state) => state.savedContexts);
    const savedPrompts = useAppStore((state) => state.savedPrompts);

    const remove = mode === "context" ? removeSavedContext : removeSavedPrompt;
    const items = mode === "context" ? savedContexts : savedPrompts;

    React.useEffect(() => {
        if (items.length === 0) {
            close();
        }
    }, [close, items.length]);

    return (
        <Stack>
            <Accordion chevronPosition="left" variant="contained">
                {items.map((item) => (
                    <Accordion.Item key={item.name} value={item.name}>
                        <Box
                            sx={{ display: "flex", alignItems: "center" }}
                            pr="xs"
                        >
                            <Accordion.Control>{item.name}</Accordion.Control>
                            <TippedActionIcon
                                tipPosition="left"
                                tip="Delete"
                                color="red"
                                onClick={() => remove(item.name)}
                            >
                                <BiTrash />
                            </TippedActionIcon>
                            <TippedActionIcon
                                tipPosition="left"
                                tip="Use"
                                onClick={() => {
                                    onSelect(item.value);
                                    close();
                                }}
                            >
                                <BiImport />
                            </TippedActionIcon>
                        </Box>
                        <Accordion.Panel>{item.value}</Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Stack>
    );
};

export default SavedPromptsModalBody;
