import useConversationManager from "../hooks/useConversationManager";
import React from "react";
import usePersistence from "../hooks/usePersistence";
import ConversationForm from "./ConversationForm";
import { ConversationFormValues } from "../contexts/ConversationFormContext";

const AddConversationForm = () => {
    const { addConversation, setActiveConversation } = useConversationManager();
    const { addPersistedConversationId, persistence } = usePersistence();

    const onSubmit = React.useCallback(
        ({
            save,
            headers,
            proxy,
            functionIds,
            ...values
        }: ConversationFormValues) => {
            const newConversation = addConversation(values, { headers, proxy });
            setActiveConversation(newConversation.id, true);

            functionIds.forEach((id) => {
                const callableFunction = persistence.functions.find(
                    (fn) => fn.id === id
                );
                if (!callableFunction) {
                    console.warn("Function not found", id);
                    return;
                }
                newConversation.addFunction(callableFunction);
            });

            if (save) {
                addPersistedConversationId(newConversation.id);
            }
        },
        [
            addConversation,
            addPersistedConversationId,
            persistence.functions,
            setActiveConversation,
        ]
    );

    return <ConversationForm onSubmit={onSubmit} hideAppSettings />;
};

export default AddConversationForm;
