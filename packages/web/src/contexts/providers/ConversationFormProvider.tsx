import useSettings from "../../hooks/useSettings";
import {
    ConversationFormContext,
    ConversationFormValues,
} from "../ConversationFormContext";

export interface ConversationFormProviderProps {
    children?: React.ReactNode;
    onSubmit: (values: ConversationFormValues) => void | Promise<void>;
}

const ConversationFormProvider = ({
    children,
    onSubmit,
}: ConversationFormProviderProps) => {
    const { settings } = useSettings();
    const form = ConversationFormContext.useForm({
        initialValues: {
            save: settings.save,

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

            headers: settings.headers,
            proxy: settings.proxy,
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

    return (
        <ConversationFormContext.Provider form={form}>
            <form onSubmit={handleSubmit}>{children}</form>
        </ConversationFormContext.Provider>
    );
};

export default ConversationFormProvider;
