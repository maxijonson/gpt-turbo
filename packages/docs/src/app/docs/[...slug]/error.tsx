"use client";

import { Container, Text, Title } from "@mantine/core";

const DocsSlugError = () => {
    return (
        <Container size="md" mt="xl">
            <Title>Aww Snap! Something went wrong... 🥺</Title>
            <Text>
                An error occurred while trying to load this page. Let&apos;s try
                and get you back to somewhere useful!
            </Text>
        </Container>
    );
};

export default DocsSlugError;
