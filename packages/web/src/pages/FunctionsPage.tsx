import {
    Autocomplete,
    Button,
    Container,
    Group,
    SimpleGrid,
    Title,
    Transition,
} from "@mantine/core";
import { BiArrowBack, BiPlus, BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import FunctionsWarning from "../components/FunctionsWarning";
import { useInputState } from "@mantine/hooks";
import React from "react";
import useCallableFunctions from "../hooks/useCallableFunctions";
import CallableFunctionCard from "../components/CallableFunctionCard";
import CallableFunctionImportButton from "../components/CallableFunctionImportButton";

const FunctionsPage = () => {
    const { callableFunctions, getCallableFunctionDisplayName } =
        useCallableFunctions();
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
                            <CallableFunctionImportButton />
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
