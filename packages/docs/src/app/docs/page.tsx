import {
    Container,
    Text,
    Title,
    TypographyStylesProvider,
} from "@mantine/core";
import { getGroupIndexes } from "@mdx/docs";
import DocsGrid from "../../components/DocsGrid/DocsGrid";

const DocsPage = () => {
    const groups = getGroupIndexes();

    return (
        <TypographyStylesProvider pl={0}>
            <Container size="md">
                <Title>Welcome to the GPT Turbo Docs!</Title>
                <Text>
                    Explore the docs using the sidebar on the left, searching
                    for a specific topic using the search bar at the top, or
                    check out the section groups below!
                </Text>
                <DocsGrid docs={groups} />
            </Container>
        </TypographyStylesProvider>
    );
};

export default DocsPage;
