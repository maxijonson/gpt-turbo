import useConversationManager from "../hooks/useConversationManager";
import React from "react";
import usePersistence from "../hooks/usePersistence";
import ConversationForm from "./ConversationForm";
import { ConversationFormValues } from "../contexts/ConversationFormContext";

const AddConversationForm = () => {
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

export default AddConversationForm;
