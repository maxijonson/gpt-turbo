import { Doc } from ".contentlayer/generated";
import { Stack, Group, Anchor } from "@mantine/core";
import { BiLogoGithub } from "react-icons/bi";
import DocHeaderItem from "../DocHeaderItem/DocHeaderItem";

interface DocHeaderItemsProps {
    doc: Doc;
}

const DocHeaderItems = ({ doc }: DocHeaderItemsProps) => {
    return (
        <Stack mt="md">
            <DocHeaderItem label="Docs">
                <Group>
                    <BiLogoGithub />
                    <Anchor
                        target="_blank"
                        href={`https://github.com/maxijonson/gpt-turbo/tree/develop/packages/docs/src/mdx/docs/${doc.slug}.mdx`}
                    >
                        Edit this page on GitHub
                    </Anchor>
                </Group>
            </DocHeaderItem>
        </Stack>
    );
};

export default DocHeaderItems;
