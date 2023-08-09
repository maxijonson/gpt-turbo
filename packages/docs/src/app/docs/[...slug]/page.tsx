import SlugNotFound from "./components/SlugNotFound/SlugNotFound";
import Mdx from "@components/mdx/Mdx/Mdx";
import {
    Container,
    Text,
    Title,
    TypographyStylesProvider,
} from "@mantine/core";
import { getDocBySlug, getGroupDocs } from "@mdx/docs";
import DocsGrid from "../../../components/DocsGrid/DocsGrid";

interface DocsSlugProps {
    params: {
        slug: string[];
    };
}

const DocsSlugPage = async ({ params: { slug } }: DocsSlugProps) => {
    const doc = getDocBySlug(...slug);
    if (!doc) return <SlugNotFound />;

    if (doc.isGroupIndex) {
        const docs = getGroupDocs(doc.slugGroup);

        return (
            <TypographyStylesProvider pl={0}>
                <Container size="md">
                    <Title>{doc.title}</Title>
                    <Text>{doc.description}</Text>
                    <DocsGrid docs={docs} />
                </Container>
            </TypographyStylesProvider>
        );
    }

    return <Mdx doc={doc} />;
};

export default DocsSlugPage;
