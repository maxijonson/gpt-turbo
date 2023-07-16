import { Menu, ActionIcon } from "@mantine/core";
import {
    BiCog,
    BiDotsVerticalRounded,
    BiDuplicate,
    BiEdit,
    BiExport,
    BiTrash,
} from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import ConversationNameEditModal, {
    ConversationNameEditModalProps,
} from "../../../modals/ConversationNameEditModal";
import { useAppStore } from "../../../../store";
import React from "react";
import { setConversationName } from "../../../../store/actions/conversations/setConversationName";
import { useGetConversationName } from "../../../../store/hooks/conversations/useGetConversationName";
import { DEFAULT_CONVERSATION_NAME } from "../../../../config/constants";

interface NavbarConversationMenuProps {
    conversationId: string;
}

const NavbarConversationMenu = ({
    conversationId,
}: NavbarConversationMenuProps) => {
    const conversation = useAppStore((state) =>
        state.conversations.find((c) => c.id === conversationId)
    );
    const getConversationName = useGetConversationName();
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure();

    const onEditName = React.useCallback<
        ConversationNameEditModalProps["onSubmit"]
    >((name) => setConversationName(conversationId, name), [conversationId]);

    if (!conversation) {
        return null;
    }

    return (
        <>
            <Menu withinPortal withArrow closeOnItemClick>
                <Menu.Target>
                    <ActionIcon>
                        <BiDotsVerticalRounded />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        icon={<BiEdit />}
                        color="blue"
                        onClick={openEdit}
                    >
                        Edit Name
                    </Menu.Item>
                    <Menu.Item icon={<BiCog />}>Settings</Menu.Item>
                    <Menu.Item icon={<BiExport />}>Export</Menu.Item>
                    <Menu.Item icon={<BiDuplicate />}>Duplicate</Menu.Item>
                    <Menu.Item icon={<BiTrash />} color="red">
                        Delete
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            <ConversationNameEditModal
                onSubmit={onEditName}
                initialName={
                    getConversationName(conversationId) ??
                    DEFAULT_CONVERSATION_NAME
                }
                opened={editOpened}
                onClose={closeEdit}
            />
        </>
    );
};

export default NavbarConversationMenu;
