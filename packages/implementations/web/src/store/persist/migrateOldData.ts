import { notifications } from "@mantine/notifications";
import { CallableFunction, Conversation } from "gpt-turbo";

const notify = (
    title: string,
    message: string,
    color = "blue",
    autoClose = true
) => {
    setTimeout(() => {
        notifications.show({
            color,
            autoClose,
            title,
            message,
        });
    }, 100);
};

// TODO: Remove this after a while. This is to migrate users from the old persistence system to the new one.
// Not EVERYTHING is migrated, but the most important things are.
export const migrateOldData = async () => {
    // Wait a second to make sure the store is initialized
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { addConversation } = await import(
        "../actions/conversations/addConversation"
    );
    const { setConversationName } = await import(
        "../actions/conversations/setConversationName"
    );
    const { setConversationLastEdit } = await import(
        "../actions/conversations/setConversationLastEdit"
    );
    const { addCallableFunction } = await import(
        "../actions/callableFunctions/addCallableFunction"
    );
    const { saveContext } = await import(
        "../actions/savedContexts/saveContext"
    );
    const { savePrompt } = await import("../actions/savedPrompts/savePrompt");
    const { setDefaultSettings } = await import(
        "../actions/defaultConversationSettings/setDefaultSettings"
    );
    const { addPersistedConversationId } = await import(
        "../actions/persistence/addPersistedConversationId"
    );

    const oldPersistence = localStorage.getItem("gpt-turbo-persistence");
    const oldSettings = localStorage.getItem("gpt-turbo-settings");

    if (oldPersistence) {
        let deleteAfter = true;
        try {
            const { conversations, functions, contexts, prompts } =
                JSON.parse(oldPersistence);
            for (const { name, lastEdited, ...conversation } of conversations) {
                try {
                    const c = Conversation.fromJSON(conversation);
                    addConversation(c);
                    setConversationName(c.id, name);
                    setConversationLastEdit(c.id, lastEdited);
                    addPersistedConversationId(c.id);
                } catch (e) {
                    deleteAfter = false;
                    console.error(e);
                    notify(
                        "Conversation Migration Failed",
                        "Failed to migrate one of your conversations to the new storage system.",
                        "red",
                        false
                    );
                }
            }

            for (const { displayName, code, ...fn } of functions) {
                try {
                    const f = CallableFunction.fromJSON(fn);
                    addCallableFunction(f, displayName, code);
                } catch (e) {
                    deleteAfter = false;
                    console.error(e);
                    notify(
                        "Callable Function Migration Failed",
                        "Failed to migrate one of your callable functions to the new storage system.",
                        "red",
                        false
                    );
                }
            }

            for (const { name, value } of contexts) {
                saveContext(name, value);
            }

            for (const { name, value } of prompts) {
                savePrompt(name, value);
            }

            if (deleteAfter) {
                localStorage.removeItem("gpt-turbo-persistence");
                notify(
                    "Persistence Migration Complete",
                    "Your old saved data has been migrated to the new storage system!",
                    "green"
                );
            } else {
                notify(
                    "Persistence Migration Partially Complete",
                    "Only some of your old saved data has been migrated to the new storage system. Please check the console for more details.",
                    "yellow"
                );
            }
        } catch (e) {
            console.error(e);
            notify(
                "Persistence Migration Failed",
                "Failed to migrate your old saved data to the new storage system.",
                "red",
                false
            );
        }
    }

    if (oldSettings) {
        try {
            setDefaultSettings(JSON.parse(oldSettings));
            localStorage.removeItem("gpt-turbo-settings");
            notify(
                "Settings Migration Complete",
                "Your old settings have been migrated to the new storage system!",
                "green"
            );
        } catch (e) {
            console.error(e);
            notify(
                "Settings Migration Failed",
                "Failed to migrate your old settings to the new storage system.",
                "red",
                false
            );
        }
    }
};
