import {
    Container,
    Group,
    Loader,
    Modal,
    ScrollArea,
    Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import useConversationManager from "../../../hooks/useConversationManager";
import { notifications } from "@mantine/notifications";
import React from "react";
import PromptUsage from "./PromptUsage";
import {
    useClickOutside,
    useDisclosure,
    useFocusReturn,
    useFocusWithin,
    useMergedRef,
    useOs,
} from "@mantine/hooks";
import { BiFolder, BiPaperPlane } from "react-icons/bi";
import TippedActionIcon from "../../common/TippedActionIcon";
import SavedPromptsModalBody from "../../modals/SavedPromptsModalBody";
import getErrorInfo from "../../../utils/getErrorInfo";
import { useAppStore } from "../../../store";
import { setConversationLastEdit } from "../../../store/actions/conversations/setConversationLastEdit";

const Prompt = () => {
    const showUsage = useAppStore((state) => state.showUsage);
    const { activeConversation: conversation } = useConversationManager();
    const form = useForm({
        initialValues: {
            prompt: "",
        },
    });
    const [isStreaming, setIsStreaming] = React.useState(false);

    const savedPrompts = useAppStore((state) => state.savedPrompts);
    const [
        showSavedPromptsModal,
        { open: openSavedPromptsModal, close: closeSavedPromptsModal },
    ] = useDisclosure(false);
    const actionsRef = React.useRef<HTMLDivElement>(null);

    const [shouldReturnFocus, setShouldReturnFocus] = React.useState(false);
    const { ref: focusWithinRef, focused } = useFocusWithin({
        onFocus: () => setShouldReturnFocus(true),
    });
    const clickOutsideRef = useClickOutside(() => setShouldReturnFocus(false));
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const textAreaRefs = useMergedRef(
        focusWithinRef,
        clickOutsideRef,
        textAreaRef
    );
    const returnFocus = useFocusReturn({
        opened: focused,
        shouldReturnFocus,
    });
    const isMobile = ["ios", "android"].includes(useOs());
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleSubmit = form.onSubmit(async (values) => {
        if (!conversation || !values.prompt) return;

        if (isMobile) {
            textAreaRef.current?.blur();
        }

        form.reset();
        try {
            const message = await conversation.prompt(values.prompt);
            setConversationLastEdit(conversation.id);
            if (message) {
                message.onMessageStreamingUpdate((isStreaming) => {
                    setIsStreaming(isStreaming);
                });
                if (message.isStreaming) {
                    setIsStreaming(true);
                }
            }
        } catch (e) {
            console.error(e);
            const { title, message } = getErrorInfo(e);
            notifications.show({
                title: `Prompt error - ${title}`,
                message,
                color: "red",
            });
        }
    });

    React.useEffect(() => {
        if (shouldReturnFocus && !isMobile) {
            returnFocus();
        }
    }, [isMobile, returnFocus, shouldReturnFocus]);

    if (!conversation) return <Loader />;

    return (
        <>
            <Container w="100%">
                <Group>
                    <form
                        onSubmit={handleSubmit}
                        style={{ flexGrow: 1 }}
                        ref={formRef}
                    >
                        <Textarea
                            {...form.getInputProps("prompt")}
                            ref={textAreaRefs}
                            disabled={isStreaming}
                            autosize
                            minRows={1}
                            maxRows={8}
                            w="100%"
                            placeholder="Ask away..."
                            rightSection={
                                <Group
                                    ref={actionsRef}
                                    noWrap
                                    spacing="xs"
                                    pr="xs"
                                >
                                    {savedPrompts.length > 0 && (
                                        <TippedActionIcon
                                            variant="transparent"
                                            tip="Saved Prompts"
                                            onClick={openSavedPromptsModal}
                                        >
                                            <BiFolder />
                                        </TippedActionIcon>
                                    )}
                                    <TippedActionIcon
                                        variant="transparent"
                                        tip="Send"
                                        onClick={() =>
                                            formRef.current?.requestSubmit()
                                        }
                                    >
                                        <BiPaperPlane />
                                    </TippedActionIcon>
                                </Group>
                            }
                            rightSectionWidth={actionsRef.current?.clientWidth}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    formRef.current?.requestSubmit();
                                }
                            }}
                        />
                    </form>
                    {showUsage && (
                        <PromptUsage
                            conversation={conversation}
                            prompt={form.values.prompt}
                        />
                    )}
                </Group>
            </Container>
            <Modal
                opened={showSavedPromptsModal}
                onClose={closeSavedPromptsModal}
                title="Saved Prompts"
                centered
                scrollAreaComponent={ScrollArea.Autosize}
                size="lg"
            >
                <SavedPromptsModalBody
                    mode="prompt"
                    close={closeSavedPromptsModal}
                    onSelect={(value) => {
                        form.setFieldValue("prompt", value);
                    }}
                />
            </Modal>
        </>
    );
};

export default Prompt;
