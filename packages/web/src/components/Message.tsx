import { Avatar, Card, Group, Text } from "@mantine/core";
import { Message } from "gpt-turbo";
import { SiOpenai } from "react-icons/si";
import { BiCog, BiUser } from "react-icons/bi";

interface MessageProps {
    message: Message;
}

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

    return (
        <Group noWrap>
            <div style={{ alignSelf: "start" }}>
                <Avatar color={color}>
                    <Sender />
                </Avatar>
            </div>
            <Card shadow="sm" style={{ flexGrow: 1 }}>
                {message.content.split("\n").map((line, i) => (
                    <Text key={i}>{line}</Text>
                ))}
            </Card>
        </Group>
    );
};
