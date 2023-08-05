"use client";

import { rem } from "@mantine/core";
import {
    Spotlight,
    SpotlightActionData,
    createSpotlight,
} from "@mantine/spotlight";
import React from "react";
import { BiSearch } from "react-icons/bi";

export const [docsStore, docsSpotlight] = createSpotlight();

const DocsSpotlight = () => {
    const actions = React.useMemo<SpotlightActionData[]>(() => [], []);

    return (
        <Spotlight
            store={docsStore}
            actions={actions}
            shortcut={["mod + K", "mod + P", "/"]}
            highlightQuery
            clearQueryOnClose
            radius="md"
            limit={7}
            nothingFound="Nothing found..."
            searchProps={{
                leftSection: (
                    <BiSearch style={{ width: rem(20), height: rem(20) }} />
                ),
                placeholder: "Search documentation...",
            }}
        />
    );
};

export default DocsSpotlight;
