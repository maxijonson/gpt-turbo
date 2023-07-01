import React, { Suspense } from "react";
import { CallableFunctionExport } from "../entities/callableFunctionExport";
import CallableFunctionImportDropzone from "./CallableFunctionImportDropzone";
import {
    Accordion,
    Alert,
    Button,
    Code,
    Group,
    Loader,
    Stack,
    Text,
} from "@mantine/core";
import { randomId } from "@mantine/hooks";
import { BiX } from "react-icons/bi";
import TippedActionIcon from "./TippedActionIcon";
import getFunctionSignature from "../utils/getFunctionSignature";

const CodeEditor = React.lazy(() => import("./CodeEditor"));

interface CallableFunctionImportProps {
    onImport: (fns: CallableFunctionExport[]) => void;
}

type ImportedFn = CallableFunctionExport & {
    /** Temporary ID for UI */
    id: string;
};

const CallableFunctionImport = ({ onImport }: CallableFunctionImportProps) => {
    const [importedFns, setImportedFns] = React.useState<ImportedFn[]>([]);

    const removeImportedFn = React.useCallback((id: string) => {
        setImportedFns((fns) => fns.filter((fn) => fn.id !== id));
    }, []);

    if (!importedFns.length) {
        return (
            <CallableFunctionImportDropzone
                onDrop={(fns) => {
                    setImportedFns(
                        fns.map((fn) => ({ ...fn, id: randomId() }))
                    );
                }}
            />
        );
    }

    return (
        <Stack>
            <Alert color="yellow">
                Please review the imported functions' code for any malicious
                code before importing.
            </Alert>
            <Accordion
                chevronPosition="left"
                defaultValue={
                    importedFns.length === 1 ? importedFns[0].id : undefined
                }
            >
                {importedFns.map((fn) => (
                    <Accordion.Item key={fn.id} value={fn.id}>
                        <Group noWrap>
                            <Accordion.Control>
                                <Group noWrap>
                                    <Text weight="bold" sx={{ flexGrow: 1 }}>
                                        {fn.displayName}
                                    </Text>
                                    {!fn.code && (
                                        <Text size="xs" color="gray" italic>
                                            No code
                                        </Text>
                                    )}
                                </Group>
                            </Accordion.Control>
                            <TippedActionIcon
                                tip="Remove from import"
                                withinPortal
                                onClick={() => removeImportedFn(fn.id)}
                            >
                                <BiX />
                            </TippedActionIcon>
                        </Group>
                        <Accordion.Panel>
                            <Stack>
                                {fn.callableFunction.description && (
                                    <Text>
                                        {fn.callableFunction.description}
                                    </Text>
                                )}
                                <Code block>
                                    {getFunctionSignature(
                                        fn.callableFunction.name,
                                        fn.callableFunction.parameters
                                    )}
                                </Code>
                                {fn.code && (
                                    <Suspense fallback={<Loader />}>
                                        <CodeEditor
                                            value={fn.code}
                                            name={fn.callableFunction.name}
                                            parameters={
                                                fn.callableFunction.parameters
                                            }
                                        />
                                    </Suspense>
                                )}
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
            <Group position="right">
                <Button variant="outline" onClick={() => setImportedFns([])}>
                    Cancel
                </Button>
                <Button onClick={() => onImport(importedFns)}>
                    {importedFns.length === 1
                        ? "Import"
                        : `Import ${importedFns.length} functions`}
                </Button>
            </Group>
        </Stack>
    );
};

export default CallableFunctionImport;
