import useConversationManager from "../hooks/useConversationManager";
import React from "react";
import usePersistence from "../hooks/usePersistence";
import ConversationForm from "./ConversationForm";
import { ConversationFormValues } from "../contexts/ConversationFormContext";
import useCallableFunctions from "../hooks/useCallableFunctions";

const AddConversationForm = () => {
    const { addConversation, setActiveConversation } = useConversationManager();
    const { getCallableFunction } = useCallableFunctions();
    const { addPersistedConversationId } = usePersistence();

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
                const callableFunction = getCallableFunction(id);
                newConversation.addFunction(callableFunction);
            });

            if (save) {
                addPersistedConversationId(newConversation.id);
            }
        },
        [
            addConversation,
            addPersistedConversationId,
            getCallableFunction,
            setActiveConversation,
        ]
    );

    return <ConversationForm onSubmit={onSubmit} hideAppSettings />;
};

export default AddConversationForm;
