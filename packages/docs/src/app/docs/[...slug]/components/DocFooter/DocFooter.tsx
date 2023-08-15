"use client";

import { Container, Divider, Group } from "@mantine/core";
import useDocs from "@contexts/hooks/useDocs";
import { PartialDoc } from "@utils/types";
import DocFooterPage from "./DocFooterPage";
import React from "react";
import { usePathname } from "next/navigation";

const DocFooter = () => {
    const pathname = usePathname();
    const { orderedDocs } = useDocs();

    const currentDocIndex = orderedDocs.findIndex(
        (doc) => `/docs/${doc.slug}` === pathname
    );
    if (currentDocIndex === -1) return null;

    const prevDoc: PartialDoc | null = orderedDocs[currentDocIndex - 1] ?? null;
    const nextDoc: PartialDoc | null = orderedDocs[currentDocIndex + 1] ?? null;

    return (
        <Container size="md" pb="xl">
            <Divider pb="xl" />
            <Group justify="space-between">
                <DocFooterPage direction="previous" doc={prevDoc} />
                <DocFooterPage direction="next" doc={nextDoc} />
            </Group>
        </Container>
    );
};

export default DocFooter;
