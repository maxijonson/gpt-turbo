import { zodResolver } from "@mantine/form";
import { v4 as uuid } from "uuid";
import {
    CallableFunctionFormContext,
    CallableFunctionFormValues,
} from "../CallableFunctionFormContext";
import { persistenceCallableFunctionSchema } from "../../entities/persistenceCallableFunction";
import usePersistence from "../../hooks/usePersistence";
import React from "react";
import { ZodError } from "zod";
import getErrorInfo from "../../utils/getErrorInfo";

export interface CallableFunctionFormProviderProps {
    children: React.ReactNode;
    onSubmit: (values: CallableFunctionFormValues) => void | Promise<void>;
    id?: string;
}

const CallableFunctionFormProvider = ({
    children,
    onSubmit,
    id,
}: CallableFunctionFormProviderProps) => {
    const { persistence } = usePersistence();
    const form = CallableFunctionFormContext.useForm({
        initialValues: {
            id: uuid(),
            displayName: "",
            name: "",
        },
        validate: zodResolver(persistenceCallableFunctionSchema),
        transformValues: persistenceCallableFunctionSchema.parse,
    });

    const handleSubmit = form.onSubmit(async (values) => {
        try {
            await onSubmit(values);
        } catch (e) {
            if (e instanceof ZodError && (e.issues[0] as any).params?.field) {
                form.setFieldError(
                    (e.issues[0] as any).params?.field,
                    getErrorInfo(e).message
                );
                return;
            }
            throw e;
        }
    });

    React.useEffect(() => {
        if (id === form.values.id) return;
        const callableFunction = persistence.functions.find((f) => f.id === id);
        if (!callableFunction) return;
        form.setValues(callableFunction);
    }, [form, id, persistence.functions]);

    return (
        <CallableFunctionFormContext.Provider form={form}>
            <form onSubmit={handleSubmit}>{children}</form>
        </CallableFunctionFormContext.Provider>
    );
};

export default CallableFunctionFormProvider;
