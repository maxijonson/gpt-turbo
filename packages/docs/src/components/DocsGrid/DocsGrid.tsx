import { SimpleGrid, Card, Text } from "@mantine/core";
import Link from "next/link";
import { PartialDoc } from "@mdx/docs";

interface DocGridProps {
    docs: PartialDoc[];
}

const DocsGrid = ({ docs }: DocGridProps) => {
    return (
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
            {docs.map((doc) => (
                <Card
                    component={Link}
                    key={doc.slug}
                    withBorder
                    href={`/docs/${doc.slug}`}
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    <Text fw="bold">{doc.title}</Text>
                    <Text c="dimmed" fz="xs" mb={0}>
                        {doc.description}
                    </Text>
                </Card>
            ))}
        </SimpleGrid>
    );
};

export default DocsGrid;
