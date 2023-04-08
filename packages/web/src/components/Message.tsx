import {
    Avatar,
    Card,
    Group,
    Stack,
    Text,
    Textarea,
    createStyles,
    useMantineTheme,
} from "@mantine/core";
import { Message } from "gpt-turbo";
import { SiOpenai } from "react-icons/si";
import { BiCheck, BiCog, BiEdit, BiRefresh, BiUser, BiX } from "react-icons/bi";
import React from "react";
import TippedActionIcon from "./TippedActionIcon";
import { useForm } from "@mantine/form";
import useConversationManager from "../hooks/useConversationManager";
import { notifications } from "@mantine/notifications";
import CodeBlock, { LANGUAGES, Language } from "./CodeBlock";
import { useMediaQuery } from "@mantine/hooks";

interface MessageProps {
    message: Message;
}

const useStyles = createStyles((theme) => ({
    root: {
        "& .message-actions": {
            opacity: 0,
            display: "none",

            [theme.fn.largerThan("sm")]: {
                display: "block",
            },
        },
        "&:hover .message-actions": {
            opacity: 1,
            display: "block",
        },
    },
}));

export default ({ message }: MessageProps) => {
    const { activeConversation: conversation } = useConversationManager();
    const { classes } = useStyles();
    const [isEditing, setIsEditing] = React.useState(false);
    const form = useForm({
        initialValues: {
            content: message.content,
        },
    });
    const editFormRef = React.useRef<HTMLFormElement>(null);

    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

    const reprompt = React.useCallback(
        async (newPrompt?: string) => {
            try {
                await conversation?.reprompt(message, newPrompt);
            } catch (e) {
                console.error(e);
                notifications.show({
                    title: "Prompt error",
                    message: (e as any).message ?? "Unknown error",
                    color: "red",
                });
            }
        },
        [conversation, message]
    );

    const onSubmit = form.onSubmit((values) => {
        reprompt(values.content);
        setIsEditing(false);
    });

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

            output.push(
                <Text key={i} color={message.isFlagged ? "orange" : undefined}>
                    {line}
                </Text>
            );
        }

        return output;
    }, [message.content, message.isFlagged]);

    const Actions = React.useMemo(() => {
        if (message.role === "system") return null;

        if (message.role === "assistant") {
            return (
                <TippedActionIcon onClick={() => reprompt()}>
                    <BiRefresh />
                </TippedActionIcon>
            );
        }

        if (isEditing) {
            return (
                <>
                    <TippedActionIcon
                        onClick={() => editFormRef.current?.requestSubmit()}
                    >
                        <BiCheck />
                    </TippedActionIcon>
                    <TippedActionIcon
                        onClick={() => {
                            setIsEditing(false);
                            form.reset();
                        }}
                    >
                        <BiX />
                    </TippedActionIcon>
                </>
            );
        }

        return (
            <TippedActionIcon onClick={() => setIsEditing(true)}>
                <BiEdit />
            </TippedActionIcon>
        );
    }, [form, isEditing, message.role, reprompt]);

    return (
        <Group noWrap className={classes.root} spacing={isSm ? "xs" : "sm"}>
            <div style={{ alignSelf: "start" }}>
                <Avatar color={color} size={isSm ? "sm" : "md"}>
                    <Sender />
                </Avatar>
            </div>
            <Card shadow="sm" style={{ flexGrow: 1 }}>
                <Stack p={0}>
                    {isEditing ? (
                        <form ref={editFormRef} onSubmit={onSubmit}>
                            <Textarea
                                {...form.getInputProps("content")}
                                autosize
                                minRows={1}
                                maxRows={8}
                                w="100%"
                            />
                        </form>
                    ) : (
                        MessageContent
                    )}
                </Stack>
            </Card>
            {
                <Stack sx={{ alignSelf: "start" }} className="message-actions">
                    {Actions}
                </Stack>
            }
        </Group>
    );
};
