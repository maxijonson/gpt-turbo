import { Anchor, Box, Stack, Text } from "@mantine/core";
import { PartialDoc } from "@utils/types";
import Link from "next/link";

interface DocFooterPageProps {
    direction: "previous" | "next";
    doc: PartialDoc | null;
}

const DocFooterPage = ({ direction, doc }: DocFooterPageProps) => {
    return (
        <Box>
            {doc && (
                <Stack gap={0} ta={direction === "previous" ? "left" : "right"}>
                    <Text
                        fz="xs"
                        fw="bold"
                        c="dimmed"
                        style={{ textTransform: "uppercase" }}
                    >
                        {direction}
                    </Text>
                    <Anchor
                        component={Link}
                        href={`/docs/${doc.slug}`}
                        fz="xl"
                        c="inherit"
                        underline="never"
                    >
                        {doc.title}
                    </Anchor>
                </Stack>
            )}
        </Box>
    );
};

export default DocFooterPage;
