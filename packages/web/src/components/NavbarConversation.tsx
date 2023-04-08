import {
    Anchor,
    Group,
    Stack,
    Text,
    TextInput,
    createStyles,
} from "@mantine/core";
import { Conversation } from "gpt-turbo";
import useConversationManager from "../hooks/useConversationManager";
import { BiCheck, BiPencil, BiTrash, BiX } from "react-icons/bi";
import React from "react";
import { useForm } from "@mantine/form";
import TippedActionIcon from "./TippedActionIcon";
import NavbarConversationInfo from "./NavbarConversationInfo";

interface NavbarConversationProps {
    conversation: Conversation;
    onClick?: () => void;
}

const useStyles = createStyles((theme, { isActive }: { isActive: boolean }) => {
    const dark = theme.colorScheme === "dark";
    let backgroundColor: string | undefined;
    let hoverBackgroundColor: string | undefined;
    let color: string | undefined;

    if (dark && isActive) {
        backgroundColor = theme.colors.blue[7];
        hoverBackgroundColor = theme.colors.blue[8];
        color = theme.white;
    } else if (dark && !isActive) {
        backgroundColor = undefined;
        hoverBackgroundColor = theme.colors.dark[6];
        color = theme.white;
    } else if (isActive) {
        backgroundColor = theme.colors.blue[1];
        hoverBackgroundColor = theme.colors.blue[2];
        color = theme.colors.blue[7];
    } else {
        backgroundColor = undefined;
        hoverBackgroundColor = theme.colors.gray[1];
        color = theme.colors.gray[8];
    }

    return {
        root: {
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            fontWeight: 600,
            borderRadius: theme.radius.sm,
            backgroundColor,
            color,

            "&:hover": {
                textDecoration: "none",
                backgroundColor: hoverBackgroundColor,
            },
        },
    };
});

export default ({ conversation, onClick }: NavbarConversationProps) => {
    const {
        activeConversation,
        setActiveConversation,
        removeConversation,
        getConversationName,
        setConversationName,
    } = useConversationManager();
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const isActive = conversation.id === activeConversation?.id;
    const { classes } = useStyles({ isActive });

    const editFormRef = React.useRef<HTMLFormElement>(null);
    const editForm = useForm({
        initialValues: {
            name: getConversationName(conversation.id),
        },
    });

    const name = React.useMemo(() => {
        return getConversationName(conversation.id);
    }, [conversation.id, getConversationName]);

    const onEdit = editForm.onSubmit((values) => {
        if (values.name && values.name !== name) {
            setConversationName(conversation.id, values.name);
        }
        setIsEditing(false);
    });

    const onDelete = React.useCallback(() => {
        removeConversation(conversation.id);
        setIsDeleting(false);
    }, [conversation.id, removeConversation]);

    const onCancel = React.useCallback(() => {
        setIsDeleting(false);
        setIsEditing(false);
    }, []);

    React.useEffect(() => {
        if (!isActive) {
            setIsDeleting(false);
            setIsEditing(false);
        }
    }, [isActive]);

    const CancelAction = React.useMemo(
        () => (
            <TippedActionIcon
                tip="Cancel"
                onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                }}
            >
                <BiX />
            </TippedActionIcon>
        ),
        [onCancel]
    );

    const Actions = React.useMemo(() => {
        if (isDeleting) {
            return (
                <>
                    <TippedActionIcon
                        tip="Confirm Delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <BiCheck />
                    </TippedActionIcon>
                    {CancelAction}
                </>
            );
        }

        if (isEditing) {
            return (
                <>
                    <TippedActionIcon
                        tip="Confirm Edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            editFormRef.current?.requestSubmit();
                        }}
                    >
                        <BiCheck />
                    </TippedActionIcon>
                    {CancelAction}
                </>
            );
        }

        return (
            <>
                <TippedActionIcon
                    tip="Edit"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                >
                    <BiPencil />
                </TippedActionIcon>
                <TippedActionIcon
                    tip="Delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleting(true);
                    }}
                >
                    <BiTrash />
                </TippedActionIcon>
            </>
        );
    }, [CancelAction, isDeleting, isEditing, onDelete]);

    return (
        <Anchor
            className={classes.root}
            px="xs"
            py="xs"
            onClick={() => {
                setActiveConversation(conversation.id);
                onClick?.();
            }}
        >
            <Group noWrap w="100%">
                <Stack spacing={0} sx={{ flexGrow: 1 }}>
                    {isEditing ? (
                        <form onSubmit={onEdit} ref={editFormRef}>
                            <TextInput
                                {...editForm.getInputProps("name")}
                                w="100%"
                            />
                        </form>
                    ) : (
                        <Text size="sm" truncate="end">
                            {name}
                        </Text>
                    )}
                    {!isEditing && (
                        <NavbarConversationInfo conversation={conversation} />
                    )}
                </Stack>
                {isActive && (
                    <Group noWrap spacing={2}>
                        {Actions}
                    </Group>
                )}
            </Group>
        </Anchor>
    );
};
