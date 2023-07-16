import { useMantineTheme, Group, rem, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import React from "react";
import {
    CallableFunctionExport,
    callableFunctionExportschema,
} from "../../entities/callableFunctionExport";
import getErrorInfo from "../../utils/getErrorInfo";
import { BiX, BiUpload } from "react-icons/bi";
import { BsFiletypeJson } from "react-icons/bs";

const readImportedFile = (file: File) => {
    return new Promise<CallableFunctionExport>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const result = callableFunctionExportschema.safeParse(
                    JSON.parse(reader.result as string)
                );
                if (!result.success) {
                    reject(result.error);
                } else {
                    resolve(result.data);
                }
            } catch (e) {
                reject(e);
            }
        };
        reader.onerror = (e) => {
            reject(e);
        };
        reader.readAsText(file);
    });
};

interface CallableFunctionImportDropzoneProps {
    onDrop: (fns: CallableFunctionExport[]) => void;
}

const CallableFunctionImportDropzone = ({
    onDrop,
}: CallableFunctionImportDropzoneProps) => {
    const theme = useMantineTheme();

    const handleDrop = React.useCallback(
        async (files: File[]) => {
            const importedFns = await Promise.all(
                files.map(async (file) => {
                    try {
                        return await readImportedFile(file);
                    } catch (e) {
                        notifications.show({
                            title: "Failed to import function",
                            message: getErrorInfo(e).message,
                            color: "red",
                            icon: <BiX />,
                        });
                    }
                })
            );
            const fns = importedFns.filter(
                (fn): fn is CallableFunctionExport => fn !== undefined
            );
            onDrop(fns);
        },
        [onDrop]
    );

    return (
        <Dropzone onDrop={handleDrop} accept={["application/json"]} multiple>
            <Group
                position="center"
                spacing="xl"
                style={{ minHeight: rem(220), pointerEvents: "none" }}
            >
                <Dropzone.Accept>
                    <BiUpload
                        size="3.2rem"
                        color={
                            theme.colors[theme.primaryColor][
                                theme.colorScheme === "dark" ? 4 : 6
                            ]
                        }
                    />
                </Dropzone.Accept>
                <Dropzone.Reject>
                    <BiX
                        size="3.2rem"
                        color={
                            theme.colors.red[
                                theme.colorScheme === "dark" ? 4 : 6
                            ]
                        }
                    />
                </Dropzone.Reject>
                <Dropzone.Idle>
                    <BsFiletypeJson size="3.2rem" />
                </Dropzone.Idle>

                <div>
                    <Text size="xl" inline>
                        Drag exported function files here or click to select
                        files
                    </Text>
                </div>
            </Group>
        </Dropzone>
    );
};

export default CallableFunctionImportDropzone;
