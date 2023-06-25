import { zodResolver } from "@mantine/form";
import { v4 as uuid } from "uuid";
import {
    CallableFunctionFormContext,
    CallableFunctionFormValues,
} from "../CallableFunctionFormContext";
import { persistenceCallableFunctionSchema } from "../../entities/persistenceCallableFunction";

export interface CallableFunctionFormProviderProps {
    children?: React.ReactNode;
    onSubmit: (values: CallableFunctionFormValues) => void | Promise<void>;
}

const CallableFunctionFormProvider = ({
    children,
    onSubmit,
}: CallableFunctionFormProviderProps) => {
    const form = CallableFunctionFormContext.useForm({
        initialValues: {
            id: uuid(),
            displayName: "Untitled Function",
            name: "",
        },
        validate: zodResolver(persistenceCallableFunctionSchema),
        transformValues: persistenceCallableFunctionSchema.parse,
    });

    const handleSubmit = form.onSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <CallableFunctionFormContext.Provider form={form}>
            <form onSubmit={handleSubmit}>{children}</form>
        </CallableFunctionFormContext.Provider>
    );
};

export default CallableFunctionFormProvider;
