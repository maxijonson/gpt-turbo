import { Button, Modal } from "@mantine/core";
import { BiCheck, BiImport, BiX } from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import CallableFunctionImport from "./CallableFunctionImport";
import FunctionsImportWarning from "./FunctionsImportWarning";
import React from "react";
import { CallableFunctionExport } from "../entities/callableFunctionExport";
import useCallableFunctions from "../hooks/useCallableFunctions";
import { notifications } from "@mantine/notifications";
import getErrorInfo from "../utils/getErrorInfo";

const CallableFunctionImportButton = () => {
    const {
        callableFunctions,
        addCallableFunction,
        getCallableFunctionDisplayName,
    } = useCallableFunctions();
    const [
        showImportModal,
        { open: openImportModal, close: closeImportModal },
    ] = useDisclosure();

    const onImport = React.useCallback(
        (fns: CallableFunctionExport[]) => {
            const usedDisplayNames = callableFunctions.map((fn) =>
                getCallableFunctionDisplayName(fn.id)
            );
            const usedNames = callableFunctions.map((fn) => fn.name);

            for (const fn of fns) {
                const importDisplayName = (() => {
                    let i = 1;
                    let copy = fn.displayName;
                    while (
                        usedDisplayNames.some(
                            (displayName) => displayName === copy
                        )
                    ) {
                        copy = `${fn.displayName} (${i++})`;
                    }
                    return copy;
                })();
                usedDisplayNames.push(importDisplayName);

                const importName = (() => {
                    let i = 1;
                    let copy = fn.callableFunction.name;
                    while (usedNames.some((name) => name === copy)) {
                        copy = `${fn.callableFunction.name}${i++}`;
                    }
                    return copy;
                })();
                usedNames.push(importName);

                try {
                    addCallableFunction(
                        { ...fn.callableFunction, name: importName },
                        importDisplayName,
                        fn.code
                    );

                    notifications.show({
                        title: "Function imported",
                        message: `"${importDisplayName}" imported successfully!`,
                        color: "green",
                        icon: <BiCheck />,
                    });
                } catch (e) {
                    notifications.show({
                        title: `Failed to import "${importDisplayName}"`,
                        message: getErrorInfo(e).message,
                        color: "red",
                        icon: <BiX />,
                    });
                }
            }

            closeImportModal();
        },
        [
            addCallableFunction,
            callableFunctions,
            closeImportModal,
            getCallableFunctionDisplayName,
        ]
    );

    return (
        <>
            <Button
                onClick={openImportModal}
                variant="gradient"
                gradient={{ from: "orange", to: "red" }}
                leftIcon={<BiImport />}
            >
                Import
            </Button>
            <Modal
                opened={showImportModal}
                onClose={closeImportModal}
                title="Import Function"
                size="xl"
                centered
            >
                <FunctionsImportWarning>
                    <CallableFunctionImport onImport={onImport} />
                </FunctionsImportWarning>
            </Modal>
        </>
    );
};

export default CallableFunctionImportButton;
