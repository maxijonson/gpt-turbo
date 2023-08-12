"use client";

import { rem } from "@mantine/core";
import {
    Spotlight,
    SpotlightActionData,
    createSpotlight,
} from "@mantine/spotlight";
import React from "react";
import { BiSearch } from "react-icons/bi";
import useDocs from "../../../contexts/hooks/useDocs";
import { useRouter } from "next/navigation";

export const [docsStore, docsSpotlight] = createSpotlight();

const DocsSpotlight = () => {
    const { docs } = useDocs();
    const router = useRouter();

    const actions = React.useMemo<SpotlightActionData[]>(
        () =>
            docs.reduce((acc, doc) => {
                return doc.isGroupIndex
                    ? acc
                    : acc.concat({
                          id: doc.slug,
                          label: doc.title,
                          description: doc.description,
                          onClick: () => router.push(`/docs/${doc.slug}`),
                      });
            }, [] as SpotlightActionData[]),
        [docs, router]
    );

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
