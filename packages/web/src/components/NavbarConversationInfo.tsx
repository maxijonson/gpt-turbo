import { Group } from "@mantine/core";
import { Conversation } from "gpt-turbo";
import React from "react";
import { BiSave, BiTestTube } from "react-icons/bi";
import {
    Bs3CircleFill,
    Bs3SquareFill,
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
import NavbarConverationInfoIcon from "./NavbarConverationInfoIcon";

interface NavbarConversationInfoProps {
    conversation: Conversation;
}

const SIZE = 14;

const NavbarConversationInfo = ({
    conversation,
}: NavbarConversationInfoProps) => {
    const { model, dry, disableModeration, stream } = conversation.getConfig();
    const { persistedConversationIds } = usePersistence();

    const persisted = persistedConversationIds.includes(conversation.id);

    const Model = (() => {
        if (model.startsWith("gpt-3.5-turbo-16k"))
            return <Bs3SquareFill size={SIZE} />;
        if (model.startsWith("gpt-3.5-turbo"))
            return <Bs3CircleFill size={SIZE} />;
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
            <NavbarConverationInfoIcon IconType={Model} label={model} />
            <NavbarConverationInfoIcon
                IconType={Dry}
                label={dry ? "Dry run" : "Live"}
            />
            <NavbarConverationInfoIcon
                IconType={DisableModeration}
                label={
                    disableModeration === "soft"
                        ? "Soft moderation"
                        : disableModeration
                        ? "Moderation disabled"
                        : "Moderation enabled"
                }
            />
            <NavbarConverationInfoIcon
                IconType={Stream}
                label={stream ? "Stream" : "No stream"}
            />
            <NavbarConverationInfoIcon
                IconType={Persisted}
                label={persisted ? "Saved" : "Not Saved"}
            />
        </Group>
    );
};

export default NavbarConversationInfo;
