import { Group, Tooltip } from "@mantine/core";
import { Conversation } from "gpt-turbo";
import React from "react";
import { BiSave, BiTestTube } from "react-icons/bi";
import {
    Bs3CircleFill,
    Bs4CircleFill,
    Bs4SquareFill,
    BsBroadcast,
    BsFastForwardFill,
    BsPlayFill,
    BsQuestionCircleFill,
    BsShieldFill,
    BsShieldShaded,
    BsShieldSlash,
} from "react-icons/bs";
import { TbCircleDashed } from "react-icons/tb";
import usePersistence from "../hooks/usePersistence";

interface NavbarConversationInfoProps {
    conversation: Conversation;
}

const Icon = ({
    IconType,
    label,
}: {
    IconType: React.ReactNode;
    label: string;
}) => {
    if (IconType === null) return null;
    return (
        <Tooltip label={label} withArrow>
            <div>{IconType}</div>
        </Tooltip>
    );
};

export default ({ conversation }: NavbarConversationInfoProps) => {
    const { model, dry, disableModeration, stream } = conversation.getConfig();
    const { persistedConversationIds } = usePersistence();

    const persisted = persistedConversationIds.includes(conversation.id);

    const Model = (() => {
        if (model.startsWith("gpt-3.5")) return <Bs3CircleFill size={15} />;
        if (model.startsWith("gpt-4-32k")) return <Bs4SquareFill />;
        if (model.startsWith("gpt-4")) return <Bs4CircleFill />;
        return <BsQuestionCircleFill />;
    })();

    const Dry = (() => {
        if (dry) return <BiTestTube />;
        return <BsBroadcast />;
    })();

    const DisableModeration = (() => {
        if (disableModeration === "soft") return <BsShieldShaded />;
        if (disableModeration) return <BsShieldSlash />;
        return <BsShieldFill />;
    })();

    const Stream = (() => {
        if (stream) return <BsFastForwardFill />;
        return <BsPlayFill />;
    })();

    const Persisted = (() => {
        if (persisted) return <BiSave />;
        return <TbCircleDashed />;
    })();

    return (
        <Group spacing="xs">
            <Icon IconType={Model} label={model} />
            <Icon IconType={Dry} label={dry ? "Dry run" : "Live"} />
            <Icon
                IconType={DisableModeration}
                label={
                    disableModeration === "soft"
                        ? "Soft moderation"
                        : disableModeration
                        ? "Moderation disabled"
                        : "Moderation enabled"
                }
            />
            <Icon IconType={Stream} label={stream ? "Stream" : "No stream"} />
            <Icon
                IconType={Persisted}
                label={persisted ? "Saved" : "Not Saved"}
            />
        </Group>
    );
};
