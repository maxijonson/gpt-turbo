import {
    Autocomplete,
    Button,
    Container,
    Group,
    SimpleGrid,
    Title,
    Transition,
    useMantineTheme,
} from "@mantine/core";
import { BiArrowBack, BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import FunctionsWarning from "../components/warnings/FunctionsWarning";
import { useInputState, useMediaQuery } from "@mantine/hooks";
import React from "react";
import CallableFunctionCard from "../components/CallableFunctionCard/CallableFunctionCard";
import CallableFunctionImportButton from "../components/CallableFunctionImport/CallableFunctionImportButton";
import CallableFunctionCreateButton from "../components/CallableFunctionCreateButton";
import { useAppStore } from "../store";
import { useGetFunctionDisplayName } from "../store/hooks/callableFunctions/useGetFunctionDisplayName";

const FunctionsPage = () => {
    const callableFunctions = useAppStore((state) => state.callableFunctions);
    const getFunctionDisplayName = useGetFunctionDisplayName();
    const [search, setSearch] = useInputState("");
    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    const detailedFunctions = React.useMemo(
        () =>
            callableFunctions.map((fn) => ({
                fn,
                displayName: getFunctionDisplayName(fn.id),
                name: fn.name,
            })),
        [callableFunctions, getFunctionDisplayName]
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
        () =>
            filteredFunctions
                .map(({ displayName }) => displayName)
                .filter((displayName): displayName is string => !!displayName),
        [filteredFunctions]
    );

    const filteredCallableFunctions = React.useMemo(
        () => filteredFunctions.map(({ fn }) => fn),
        [filteredFunctions]
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
                    <Group w="100%" position="apart">
                        <Autocomplete
                            value={search}
                            onChange={setSearch}
                            placeholder="Search"
                            icon={<BiSearch />}
                            data={filteredDisplayNames}
                            w={isSm ? "100%" : undefined}
                        />
                        <Group noWrap grow={isSm} w={isSm ? "100%" : undefined}>
                            <CallableFunctionImportButton />
                            <CallableFunctionCreateButton />
                        </Group>
                    </Group>
                </Group>
                <SimpleGrid
                    cols={1}
                    breakpoints={[{ minWidth: "md", cols: 2 }]}
                >
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
