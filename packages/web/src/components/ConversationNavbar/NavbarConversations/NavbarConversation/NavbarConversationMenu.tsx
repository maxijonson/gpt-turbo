import { Menu, ActionIcon, Modal } from "@mantine/core";
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
import ConversationForm from "../../../forms/ConversationForm/ConversationForm";
import { ConversationFormProviderProps } from "../../../../contexts/providers/ConversationFormProvider";
import { editConversation } from "../../../../store/actions/conversations/editConversation";
import { modals } from "@mantine/modals";
import { duplicateConversation } from "../../../../store/actions/conversations/duplicateConversation";

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

    const [settingsOpened, { open: openSettings, close: closeSettings }] =
        useDisclosure();
    const onEditSettings = React.useCallback<
        ConversationFormProviderProps["onSubmit"]
    >(
        (values) => {
            editConversation(conversationId, values);
            closeSettings();
        },
        [closeSettings, conversationId]
    );

    const onDuplicate = React.useCallback(() => {
        const name = getConversationName(conversationId);
        modals.openConfirmModal({
            title: `Duplicate "${name ?? DEFAULT_CONVERSATION_NAME}"?`,
            centered: true,
            labels: {
                confirm: "Duplicate",
                cancel: "Cancel",
            },
            onConfirm: () => {
                duplicateConversation(conversationId);
            },
        });
    }, [conversationId, getConversationName]);

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
                    <Menu.Item icon={<BiCog />} onClick={openSettings}>
                        Settings
                    </Menu.Item>
                    <Menu.Item icon={<BiDuplicate />} onClick={onDuplicate}>
                        Duplicate
                    </Menu.Item>
                    <Menu.Item icon={<BiExport />}>Export</Menu.Item>
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

            <Modal
                opened={settingsOpened}
                onClose={closeSettings}
                centered
                size="lg"
                withCloseButton={false}
            >
                <ConversationForm
                    hideAppSettings
                    conversationId={conversationId}
                    onSubmit={onEditSettings}
                />
            </Modal>
        </>
    );
};

export default NavbarConversationMenu;
