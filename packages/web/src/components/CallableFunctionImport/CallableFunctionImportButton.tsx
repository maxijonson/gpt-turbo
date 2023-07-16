import { Button, Modal } from "@mantine/core";
import { BiCheck, BiImport, BiX } from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import CallableFunctionImport from "./CallableFunctionImport";
import FunctionsImportWarning from "../warnings/FunctionsImportWarning";
import React from "react";
import { CallableFunctionExport } from "../../entities/callableFunctionExport";
import { notifications } from "@mantine/notifications";
import getErrorInfo from "../../utils/getErrorInfo";
import { addCallableFunction } from "../../store/actions/callableFunctions/addCallableFunction";
import { useGetUniqueFunctionDisplayName } from "../../store/hooks/callableFunctions/useGetUniqueFunctionDisplayName";
import { useGetUniqueFunctionName } from "../../store/hooks/callableFunctions/useGetUniqueFunctionName";

const CallableFunctionImportButton = () => {
    const getUniqueFunctionDisplayName = useGetUniqueFunctionDisplayName();
    const getUniqueFunctionName = useGetUniqueFunctionName();
    const [
        showImportModal,
        { open: openImportModal, close: closeImportModal },
    ] = useDisclosure();

    const onImport = React.useCallback(
        (fns: CallableFunctionExport[]) => {
            const createdDisplayNames: string[] = [];
            const createdNames: string[] = [];

            for (const fn of fns) {
                const importDisplayName = getUniqueFunctionDisplayName(
                    fn.displayName,
                    createdDisplayNames
                );
                createdDisplayNames.push(importDisplayName);

                const importName = getUniqueFunctionName(
                    fn.callableFunction.name,
                    createdNames
                );
                createdNames.push(importName);

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
        [closeImportModal, getUniqueFunctionDisplayName, getUniqueFunctionName]
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
