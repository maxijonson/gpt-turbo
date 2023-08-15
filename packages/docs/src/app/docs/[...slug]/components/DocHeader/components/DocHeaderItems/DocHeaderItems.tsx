import { Doc } from ".contentlayer/generated";
import { Stack, Group, Anchor } from "@mantine/core";
import { BiCodeAlt, BiLogoGithub } from "react-icons/bi";
import DocHeaderItem from "../DocHeaderItem/DocHeaderItem";
import { API_BASEURL } from "../../../../../../../config/constants";

interface DocHeaderItemsProps {
    doc: Doc;
}

const DocHeaderItems = ({ doc }: DocHeaderItemsProps) => {
    return (
        <Stack mt="md" gap="xs">
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
            {doc.api && (
                <DocHeaderItem label="API">
                    <Group>
                        <BiCodeAlt />
                        <Anchor
                            target="_blank"
                            href={`${API_BASEURL}${doc.api}`}
                        >
                            Go to API Reference
                        </Anchor>
                    </Group>
                </DocHeaderItem>
            )}
        </Stack>
    );
};

export default DocHeaderItems;
