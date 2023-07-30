import React from "react";
import {
    ConversationFormContext,
    ConversationFormValues,
} from "../ConversationFormContext";
import { useAppStore } from "../../store";
import { shallow } from "zustand/shallow";

export interface ConversationFormProviderProps {
    children?: React.ReactNode;
    onSubmit: (values: ConversationFormValues) => void | Promise<void>;
    conversationId?: string;
}

const ConversationFormProvider = ({
    children,
    onSubmit,
    conversationId,
}: ConversationFormProviderProps) => {
    const [settings, persistedConversationIds, conversation] = useAppStore(
        (state) => [
            state.defaultSettings,
            state.persistedConversationIds,
            conversationId
                ? state.conversations.find((c) => c.id === conversationId)
                : undefined,
        ],
        shallow
    );

    const form = ConversationFormContext.useForm({
        initialValues: {
            save: settings.save,

            // Config
            apiKey: settings.apiKey,
            model: settings.model,
            context: settings.context,
            dry: settings.dry,
            disableModeration: settings.disableModeration,
            stream: settings.stream,
            temperature: settings.temperature,
            top_p: settings.top_p,
            frequency_penalty: settings.frequency_penalty,
            presence_penalty: settings.presence_penalty,
            stop: settings.stop,
            max_tokens: settings.max_tokens,
            logit_bias: settings.logit_bias,
            user: settings.user,

            // Request options
            headers: settings.headers,
            proxy: settings.proxy,

            // Callable functions
            functionIds: settings.functionIds,
        },
        transformValues: (values) => ({
            ...values,
            user: values.user === "" ? undefined : values.user,
            dry: !values.apiKey || values.dry,
        }),
    });

    const handleSubmit = form.onSubmit(async (values) => {
        await onSubmit(values);
    });

    const hasEditInit = React.useRef(false);
    React.useEffect(() => {
        if (!conversation || form.isDirty() || hasEditInit.current) return;
        hasEditInit.current = true;
        const {
            config = {},
            callableFunctions: { functions = [] } = {},
            requestOptions = {},
        } = conversation.toJSON();

        form.setValues({
            save: persistedConversationIds.includes(conversation.id),

            // Config
            apiKey: config.apiKey,
            model: config.model,
            context: config.context,
            dry: config.dry,
            disableModeration: config.disableModeration,
            stream: config.stream,
            temperature: config.temperature,
            top_p: config.top_p,
            frequency_penalty: config.frequency_penalty,
            presence_penalty: config.presence_penalty,
            stop: config.stop,
            max_tokens: config.max_tokens,
            logit_bias: config.logit_bias,
            user: config.user,

            // Request options
            headers: requestOptions.headers,
            proxy: requestOptions.proxy,

            // Callable functions
            functionIds: functions
                .map((f) => f.id)
                .filter((id): id is string => !!id),
        });
    }, [conversation, form, persistedConversationIds]);

    return (
        <ConversationFormContext.Provider form={form}>
            <form onSubmit={handleSubmit} style={{ height: "100%" }}>
                {children}
            </form>
        </ConversationFormContext.Provider>
    );
};

export default ConversationFormProvider;
