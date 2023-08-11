import { Doc } from ".contentlayer/generated";
import { Container, Divider, Text, Title } from "@mantine/core";
import DocHeaderItems from "./components/DocHeaderItems/DocHeaderItems";

interface DocHeaderProps {
    doc: Doc;
}

const DocHeader = ({ doc }: DocHeaderProps) => {
    return (
        <Container size="md" mt="xl" mb="md">
            <Title fz={42}>{doc.title}</Title>
            <Text c="dimmed">{doc.description}</Text>
            <DocHeaderItems doc={doc} />
            <Divider mt="xl" />
        </Container>
    );
};

export default DocHeader;
