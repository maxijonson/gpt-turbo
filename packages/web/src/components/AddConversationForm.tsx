import useConversationManager from "../hooks/useConversationManager";
import React from "react";
import usePersistence from "../hooks/usePersistence";
import ConversationForm, { ConversationFormValues } from "./ConversationForm";

export default () => {
    const { addConversation, setActiveConversation } = useConversationManager();
    const { addPersistedConversationId } = usePersistence();

    const onSubmit = React.useCallback(
        ({ save, headers, proxy, ...values }: ConversationFormValues) => {
            const newConversation = addConversation(values, { headers, proxy });
            setActiveConversation(newConversation.id, true);
            if (save) {
                addPersistedConversationId(newConversation.id);
            }
        },
        [addConversation, addPersistedConversationId, setActiveConversation]
    );

    return <ConversationForm onSubmit={onSubmit} />;
};
