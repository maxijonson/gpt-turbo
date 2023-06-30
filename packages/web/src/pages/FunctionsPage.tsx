import {
    Autocomplete,
    Button,
    Container,
    FileButton,
    Group,
    SimpleGrid,
    Title,
    Transition,
} from "@mantine/core";
import {
    BiArrowBack,
    BiCheck,
    BiImport,
    BiPlus,
    BiSearch,
    BiX,
} from "react-icons/bi";
import { Link } from "react-router-dom";
import FunctionsWarning from "../components/FunctionsWarning";
import { useInputState } from "@mantine/hooks";
import React from "react";
import useCallableFunctions from "../hooks/useCallableFunctions";
import CallableFunctionCard from "../components/CallableFunctionCard";
import { callableFunctionExportschema } from "../entities/callableFunctionExport";
import { notifications } from "@mantine/notifications";
import getErrorInfo from "../utils/getErrorInfo";

const FunctionsPage = () => {
    const {
        callableFunctions,
        getCallableFunctionDisplayName,
        addCallableFunction,
    } = useCallableFunctions();
    const [search, setSearch] = useInputState("");

    const detailedFunctions = React.useMemo(
        () =>
            callableFunctions.map((fn) => ({
                fn,
                displayName: getCallableFunctionDisplayName(fn.id),
                name: fn.name,
            })),
        [callableFunctions, getCallableFunctionDisplayName]
    );

    const filteredFunctions = React.useMemo(() => {
        if (!search) return detailedFunctions;
        return detailedFunctions.filter((fn) =>
            `${fn.displayName}${fn.name}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [detailedFunctions, search]);

    const filteredDisplayNames = React.useMemo(
        () => filteredFunctions.map(({ displayName }) => displayName),
        [filteredFunctions]
    );

    const filteredCallableFunctions = React.useMemo(
        () => filteredFunctions.map(({ fn }) => fn),
        [filteredFunctions]
    );

    const onImport = React.useCallback(
        (file: File) => {
            const reader = new FileReader();
            reader.readAsText(file, "utf-8");
            reader.onload = () => {
                try {
                    const data = reader.result as string;
                    const importedFunction = JSON.parse(data);
                    const fn =
                        callableFunctionExportschema.parse(importedFunction);

                    const importDisplayName = (() => {
                        let i = 1;
                        let copy = fn.displayName;
                        while (
                            callableFunctions.some(
                                (fn) =>
                                    getCallableFunctionDisplayName(fn.id) ===
                                    copy
                            )
                        ) {
                            copy = `${fn.displayName} (${i++})`;
                        }
                        return copy;
                    })();

                    const importName = (() => {
                        let i = 1;
                        let copy = fn.callableFunction.name;
                        while (
                            callableFunctions.some((fn) => fn.name === copy)
                        ) {
                            copy = `${fn.callableFunction.name}${i++}`;
                        }
                        return copy;
                    })();

                    addCallableFunction(
                        { ...fn.callableFunction, name: importName },
                        importDisplayName,
                        fn.code
                    );

                    notifications.show({
                        title: "Function imported",
                        message: `Function ${importDisplayName} imported successfully`,
                        color: "green",
                        icon: <BiCheck />,
                    });
                } catch (e) {
                    notifications.show({
                        title: "Failed to import function",
                        message: getErrorInfo(e).message,
                        color: "red",
                        icon: <BiX />,
                    });
                }
            };
        },
        [addCallableFunction, callableFunctions, getCallableFunctionDisplayName]
    );

    return (
        <Container w="100%" mt="xl">
            <Button
                component={Link}
                to="/"
                leftIcon={<BiArrowBack />}
                variant="subtle"
            >
                Back to conversations
            </Button>
            <FunctionsWarning>
                <Group position="apart" mb="md">
                    <Title>Functions Library</Title>
                    <Group>
                        <Autocomplete
                            value={search}
                            onChange={setSearch}
                            placeholder="Search"
                            icon={<BiSearch />}
                            data={filteredDisplayNames}
                        />
                        <Group noWrap>
                            <FileButton
                                onChange={onImport}
                                accept="application/json"
                            >
                                {(props) => (
                                    <Button
                                        {...props}
                                        variant="gradient"
                                        gradient={{ from: "orange", to: "red" }}
                                        leftIcon={<BiImport />}
                                    >
                                        Import
                                    </Button>
                                )}
                            </FileButton>
                            <Button
                                component={Link}
                                to="/functions/create"
                                leftIcon={<BiPlus />}
                                variant="gradient"
                            >
                                Create
                            </Button>
                        </Group>
                    </Group>
                </Group>
                <SimpleGrid cols={2}>
                    {callableFunctions.map((fn) => (
                        <Transition
                            key={fn.id}
                            transition="pop"
                            mounted={filteredCallableFunctions.includes(fn)}
                        >
                            {(styles) => (
                                <CallableFunctionCard fn={fn} style={styles} />
                            )}
                        </Transition>
                    ))}
                </SimpleGrid>
            </FunctionsWarning>
        </Container>
    );
};

export default FunctionsPage;
