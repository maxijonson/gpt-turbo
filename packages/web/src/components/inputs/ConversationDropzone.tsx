import {
    Box,
    Center,
    ScrollArea,
    Stack,
    Text,
    createStyles,
    useMantineTheme,
} from "@mantine/core";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import React from "react";
import { BiUpload, BiX } from "react-icons/bi";
import {
    ConversationExport,
    conversationExportSchema,
} from "../../entities/conversationExport";
import { notifications } from "@mantine/notifications";
import readJsonFile from "../../utils/readJsonFile";
import { useId } from "@mantine/hooks";

interface ConversationNavbarDropzoneBaseProps {
    onDrop: (conversations: ConversationExport[]) => void;
    children?: React.ReactNode;
}

export type ConversationNavbarDropzoneProps = Omit<
    DropzoneProps,
    keyof ConversationNavbarDropzoneBaseProps
> &
    ConversationNavbarDropzoneBaseProps;

const useStyles = createStyles((_, { childrenId }: { childrenId: string }) => ({
    dropzone: {
        height: "100%",
        cursor: "default",
        padding: 0,
        border: "none",

        "&[data-idle]": {
            backgroundColor: "transparent",
        },

        "&[data-accept]": {
            [`& .${childrenId}`]: {
                opacity: 0,
            },
        },

        "& .mantine-Dropzone-inner": {
            pointerEvents: "all",
        },
    },
    scrollArea: {
        height: "100%",

        "& .mantine-ScrollArea-viewport > div": {
            height: "100%",
        },
    },
}));

const ConversationDropzone = ({
    onDrop,
    children,
    ...dropzoneProps
}: ConversationNavbarDropzoneProps) => {
    const theme = useMantineTheme();
    const childrenId = useId();
    const { classes } = useStyles({ childrenId });

    const handleDrop = React.useCallback(
        async (files: File[]) => {
            const imported = await Promise.all(
                files.map(async (file) => {
                    try {
                        return await readJsonFile(
                            file,
                            conversationExportSchema
                        );
                    } catch (e) {
                        notifications.show({
                            title: "Failed to import conversation",
                            message: "Not a valid conversation file",
                            color: "red",
                            icon: <BiX />,
                        });
                    }
                })
            );
            const conversations = imported.filter(
                (fn): fn is ConversationExport => fn !== undefined
            );
            onDrop(conversations);
        },
        [onDrop]
    );

    return (
        <ScrollArea className={classes.scrollArea}>
            <Dropzone
                className={classes.dropzone}
                onDrop={handleDrop}
                activateOnClick={false}
                accept={["application/json"]}
                multiple
                data-accept="true"
                {...dropzoneProps}
            >
                <Dropzone.Accept>
                    <Center pos="absolute" h="100%" w="100%">
                        <Stack align="center" spacing="xs">
                            <BiUpload
                                size="3.2rem"
                                color={
                                    theme.colors[theme.primaryColor][
                                        theme.colorScheme === "dark" ? 4 : 6
                                    ]
                                }
                            />
                            <Text>Import Conversation(s)</Text>
                        </Stack>
                    </Center>
                </Dropzone.Accept>

                <Dropzone.Reject>
                    <Center pos="absolute" h="100%" w="100%">
                        <Stack align="center">
                            <BiX
                                size="3.2rem"
                                color={
                                    theme.colors.red[
                                        theme.colorScheme === "dark" ? 4 : 6
                                    ]
                                }
                            />
                            <Text>Not a JSON file</Text>
                        </Stack>
                    </Center>
                </Dropzone.Reject>

                <Box className={childrenId}>{children}</Box>
            </Dropzone>
        </ScrollArea>
    );
};

export default ConversationDropzone;
