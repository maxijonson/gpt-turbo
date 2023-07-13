import React from "react";
import ConversationForm from "./ConversationForm";
import { ConversationFormValues } from "../contexts/ConversationFormContext";
import useCallableFunctions from "../hooks/useCallableFunctions";
import { addConversation } from "../store/actions/conversations/addConversation";
import { setActiveConversation } from "../store/actions/conversations/setActiveConversation";
import { addPersistedConversationId } from "../store/actions/persistence/addPersistedConversationId";

const AddConversationForm = () => {
    const { getCallableFunction } = useCallableFunctions();

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

            for (const functionId of functionIds) {
                const callableFunction = getCallableFunction(functionId);
                newConversation.addFunction(callableFunction);
            }

            if (save) {
                addPersistedConversationId(newConversation.id);
            }
        },
        [getCallableFunction]
    );

    return <ConversationForm onSubmit={onSubmit} hideAppSettings />;
};

export default AddConversationForm;
