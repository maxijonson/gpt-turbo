import { Avatar, Card, Group, Text } from "@mantine/core";
import { Message } from "gpt-turbo";
import { SiOpenai } from "react-icons/si";
import { BiCog, BiUser } from "react-icons/bi";
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
                    <Prism key={i} language={language ?? "markdown"}>
                        {codeLines.join("\n")}
                    </Prism>
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
                    <Prism key={i} language={language ?? "markdown"}>
                        {codeLines.join("\n")}
                    </Prism>
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
