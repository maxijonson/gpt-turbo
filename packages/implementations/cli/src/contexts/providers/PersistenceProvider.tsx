import React from "react";
import fs from "fs";
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
        const json = JSON.stringify(conversation.toJSON());
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
                const newConversation = Conversation.fromJSON(json);
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
                message.onStreamingStop(() => {
                    save();
                }),
                message.onUpdate((_, m) => {
                    if (m.isStreaming) return;
                    save();
                })
            );
        };

        conversation.history.getMessages().forEach(attachMessageListeners());

        const offMessageAdded = conversation.history.onMessageAdded(
            (message) => {
                save();
                attachMessageListeners()(message);
            }
        );

        const offMessageRemoved = conversation.history.onMessageRemoved(() => {
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
