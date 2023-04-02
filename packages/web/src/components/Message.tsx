import {
    ActionIcon,
    Avatar,
    Card,
    CopyButton,
    Group,
    Text,
    Tooltip,
} from "@mantine/core";
import { Message } from "gpt-turbo";
import { SiOpenai } from "react-icons/si";
import { BiCheck, BiCog, BiUser } from "react-icons/bi";
import { RxClipboard } from "react-icons/rx";
import React from "react";
import { Prism } from "@mantine/prism";

interface MessageProps {
    message: Message;
}

const LANGUAGES = [
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

type Language = (typeof LANGUAGES)[number];

const CodeBlock = ({
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
                        ? theme.colors.dark[6]
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
                            <ActionIcon onClick={copy}>
                                {copied ? <BiCheck /> : <RxClipboard />}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            </Group>
        </Card>
    );
};

export default ({ message }: MessageProps) => {
    const Sender = (() => {
        switch (message.role) {
            case "assistant":
                return SiOpenai;
            case "user":
                return BiUser;
            case "system":
            default:
                return BiCog;
        }
    })();

    const color = (() => {
        switch (message.role) {
            case "assistant":
                return "teal";
            case "user":
                return "blue";
            case "system":
            default:
                return "gray";
        }
    })();

    const MessageContent = React.useMemo(() => {
        const lines = message.content.split("\n");
        const output: JSX.Element[] = [];

        let isCode = false;
        let language: Language | null = null;
        let codeLines: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (!isCode && line.startsWith("```")) {
                isCode = true;
                language =
                    LANGUAGES.find((l) =>
                        line.slice(3).toLocaleLowerCase().includes(l)
                    ) || null;
                output.push(
                    <CodeBlock key={i} language={language}>
                        {codeLines.join("\n")}
                    </CodeBlock>
                );
                continue;
            }

            if (isCode && line.startsWith("```")) {
                isCode = false;
                codeLines = [];
                language = null;
                continue;
            }

            if (isCode) {
                codeLines.push(line);
                output[output.length - 1] = (
                    <CodeBlock key={i} language={language}>
                        {codeLines.join("\n")}
                    </CodeBlock>
                );
                continue;
            }

            if (!line) {
                output.push(<br key={i} />);
                continue;
            }

            output.push(<Text key={i}>{line}</Text>);
        }

        return output;
    }, [message.content]);

    return (
        <Group noWrap>
            <div style={{ alignSelf: "start" }}>
                <Avatar color={color}>
                    <Sender />
                </Avatar>
            </div>
            <Card shadow="sm" style={{ flexGrow: 1 }}>
                {MessageContent}
            </Card>
        </Group>
    );
};
