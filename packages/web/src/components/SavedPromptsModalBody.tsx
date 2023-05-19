import { Accordion, Box, Stack } from "@mantine/core";
import usePersistence from "../hooks/usePersistence";
import TippedActionIcon from "./TippedActionIcon";
import { BiImport, BiTrash } from "react-icons/bi";
import React from "react";

interface SavedContextsModalBodyProps {
    onSelect: (value: string) => void;
    close: () => void;
    mode: "context" | "prompt";
}

export default ({ close, onSelect, mode }: SavedContextsModalBodyProps) => {
    const {
        removeContext,
        removePrompt,
        persistence: { contexts, prompts },
    } = usePersistence();

    const remove = mode === "context" ? removeContext : removePrompt;
    const items = mode === "context" ? contexts : prompts;

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
                                position="left"
                                tip="Delete"
                                color="red"
                                onClick={() => remove(item.name)}
                            >
                                <BiTrash />
                            </TippedActionIcon>
                            <TippedActionIcon
                                position="left"
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
