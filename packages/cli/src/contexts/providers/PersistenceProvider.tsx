import React from "react";
import fs from "fs";
import { Persistence, persistenceSchema } from "../../entities/persistence.js";
import { PersistenceMessage } from "../../entities/persistenceMessage.js";
import useConversationManager from "../../hooks/useConversationManager.js";
import {
    PersistenceContext,
    PersistenceContextValue,
} from "../PersistenceContext.js";
import { Conversation, Message } from "gpt-turbo";

interface PersistenceProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: PersistenceProviderProps) => {
    const { conversation, setConversation } = useConversationManager();
    const [saveFile, setSaveFile] = React.useState<string | null>(null);
    const [loadFile, setLoadFile] = React.useState<string | null>(null);

    const save = React.useCallback(() => {
        if (!conversation || !saveFile) return;
        const persistedConversations: Persistence = {
            conversation: {
                ...conversation.getConfig(),
                messages: conversation.getMessages().map(
                    (message): PersistenceMessage => ({
                        content: message.content,
                        role: message.role,
                    })
                ),
            },
        };
        const parsed = persistenceSchema.parse(persistedConversations);
        const json = JSON.stringify(parsed);
        fs.writeFileSync(saveFile, json);
    }, [conversation, saveFile]);

    const handleSetSaveFile = React.useCallback((file: string) => {
        setSaveFile(file);
    }, []);

    const handleSetLoadFile = React.useCallback((file: string) => {
        setLoadFile(file);
    }, []);

    const providerValue = React.useMemo<PersistenceContextValue>(
        () => ({
            setSaveFile: handleSetSaveFile,
            setLoadFile: handleSetLoadFile,
        }),
        [handleSetSaveFile, handleSetLoadFile]
    );

    React.useEffect(() => {
        if (conversation || !loadFile) return;
        const load = async () => {
            try {
                const data = fs.readFileSync(loadFile, "utf8");
                const json = JSON.parse(data);
                const { conversation: persistedConversation } =
                    persistenceSchema.parse(json);
                const { messages, disableModeration, ...config } =
                    persistedConversation;
                const newConversation = new Conversation({
                    ...config,
                    disableModeration: true,
                });

                for (const message of messages) {
                    try {
                        switch (message.role) {
                            case "user":
                                await newConversation.addUserMessage(
                                    message.content
                                );
                                break;
                            case "assistant":
                                await newConversation.addAssistantMessage(
                                    message.content
                                );
                                break;
                            case "system":
                                newConversation.setContext(message.content);
                        }
                    } catch (e) {
                        console.error(
                            "Error while loading message",
                            (e as Error).message
                        );
                    }
                }

                newConversation.setConfig(
                    {
                        disableModeration,
                    },
                    true
                );
                setConversation(newConversation);
            } catch (e) {
                console.error(e);
            }
        };
        load();
    }, [conversation, loadFile, setConversation]);

    // Save conversations on change
    React.useEffect(() => {
        if (!conversation) return;

        save();

        const messageOffs: (() => void)[] = [];

        const attachMessageListeners = () => (message: Message) => {
            messageOffs.push(
                message.onMessageStreamingStop(() => {
                    save();
                })
            );

            messageOffs.push(
                message.onMessageUpdate((_, m) => {
                    if (m.isStreaming) return;
                    save();
                })
            );
        };

        conversation.getMessages().forEach(attachMessageListeners());

        const offMessageAdded = conversation.onMessageAdded((message) => {
            save();
            attachMessageListeners()(message);
        });

        const offMessageRemoved = conversation.onMessageRemoved(() => {
            save();
        });

        return () => {
            offMessageAdded();
            offMessageRemoved();
            messageOffs.forEach((off) => off());
        };
    }, [conversation, save]);

    return (
        <PersistenceContext.Provider value={providerValue}>
            {children}
        </PersistenceContext.Provider>
    );
};
