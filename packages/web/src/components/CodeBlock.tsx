import {
    Card,
    Group,
    CopyButton,
    Tooltip,
    ActionIcon,
    Text,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import { BiCheck } from "react-icons/bi";
import { RxClipboard } from "react-icons/rx";

export const LANGUAGES = [
    "markup",
    "bash",
    "clike",
    "c",
    "cpp",
    "css",
    "javascript",
    "jsx",
    "coffeescript",
    "actionscript",
    "css-extr",
    "diff",
    "git",
    "go",
    "graphql",
    "handlebars",
    "json",
    "less",
    "makefile",
    "markdown",
    "objectivec",
    "ocaml",
    "python",
    "reason",
    "sass",
    "scss",
    "sql",
    "stylus",
    "tsx",
    "typescript",
    "wasm",
    "yaml",
] as const;

export type Language = (typeof LANGUAGES)[number];

export default ({
    language,
    children,
}: {
    language: Language | null;
    children: string;
}) => {
    return language ? (
        <Prism language={language}>{children}</Prism>
    ) : (
        <Card
            sx={(theme) => ({
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[8]
                        : theme.colors.gray[0],
            })}
            py={0}
            px="sm"
        >
            <Group noWrap>
                <Text
                    ff="ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace"
                    lh={1.7}
                    fs="0.8125rem"
                    size={13}
                    sx={{ flexGrow: 1 }}
                    component="pre"
                >
                    {children}
                </Text>
                <CopyButton value={children} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip
                            label={copied ? "Copied" : "Copy code"}
                            withArrow
                            position="right"
                            color={copied ? "teal" : undefined}
                        >
                            <ActionIcon
                                onClick={copy}
                                mt="sm"
                                sx={{ alignSelf: "start" }}
                            >
                                {copied ? <BiCheck /> : <RxClipboard />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            </Group>
        </Card>
    );
};
