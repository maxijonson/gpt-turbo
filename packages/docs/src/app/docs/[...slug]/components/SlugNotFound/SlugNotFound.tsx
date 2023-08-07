"use client";

import { Container, Text, Title } from "@mantine/core";

const SlugNotFound = () => {
    return (
        <Container size="md" mt="xl">
            <Title>Page Not Found</Title>
            <Text>
                The page you are looking for does not exist. It may have been
                moved, or removed altogether. Let&apos;s try and get you back to
                somewhere useful!
            </Text>
        </Container>
    );
};

export default SlugNotFound;
