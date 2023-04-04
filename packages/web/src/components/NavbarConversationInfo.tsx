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

const SIZE = 14;

export default ({ conversation }: NavbarConversationInfoProps) => {
    const { model, dry, disableModeration, stream } = conversation.getConfig();
    const { persistedConversationIds } = usePersistence();

    const persisted = persistedConversationIds.includes(conversation.id);

    const Model = (() => {
        if (model.startsWith("gpt-3.5")) return <Bs3CircleFill size={SIZE} />;
        if (model.startsWith("gpt-4-32k")) return <Bs4SquareFill size={SIZE} />;
        if (model.startsWith("gpt-4")) return <Bs4CircleFill size={SIZE} />;
        return <BsQuestionCircleFill size={SIZE} />;
    })();

    const Dry = (() => {
        if (dry) return <BiTestTube />;
        return <BsBroadcast />;
    })();

    const DisableModeration = (() => {
        if (disableModeration === "soft") return <BsShieldShaded size={SIZE} />;
        if (disableModeration) return <BsShieldSlash size={SIZE} />;
        return <BsShieldFill size={SIZE} />;
    })();

    const Stream = (() => {
        if (stream) return <BsFastForwardFill size={SIZE} />;
        return <BsPlayFill size={SIZE} />;
    })();

    const Persisted = (() => {
        if (persisted) return <BiSave size={SIZE} />;
        return <TbCircleDashed size={SIZE} />;
    })();

    return (
        <Group spacing="xs" align="center">
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
