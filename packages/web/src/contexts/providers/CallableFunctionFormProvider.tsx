import { zodResolver } from "@mantine/form";
import { v4 as uuid } from "uuid";
import {
    CallableFunctionFormContext,
    CallableFunctionFormValues,
} from "../CallableFunctionFormContext";
import { persistenceCallableFunctionSchema } from "../../entities/persistenceCallableFunction";
import React from "react";
import { useSearchParams } from "react-router-dom";
import functionTemplates from "../../utils/functionTemplates";
import { useAppStore } from "../../store";
import { useGetFunctionDisplayName } from "../../store/hooks/callableFunctions/useGetFunctionDisplayName";
import { useGetFunctionCode } from "../../store/hooks/callableFunctions/useGetFunctionCode";

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
    const callableFunctions = useAppStore((state) => state.callableFunctions);
    const getFunctionDisplayName = useGetFunctionDisplayName();
    const getFunctionCode = useGetFunctionCode();
    const form = CallableFunctionFormContext.useForm({
        initialValues: {
            id: uuid(),
            displayName: "",
            name: "",
        },
        validate: zodResolver(persistenceCallableFunctionSchema),
        transformValues: persistenceCallableFunctionSchema.parse,
    });
    const [query] = useSearchParams();

    const handleSubmit = form.onSubmit(async (values) => {
        const existingName = callableFunctions.find(
            (f) => f.id !== values.id && f.name === values.name
        );
        const existingDisplayName = callableFunctions.find(
            (f) =>
                f.id !== values.id &&
                getFunctionDisplayName(f.id) === values.displayName
        );

        if (existingName) {
            form.setFieldError("name", "This name is already used");
        }

        if (existingDisplayName) {
            form.setFieldError(
                "displayName",
                "This display name is already used"
            );
        }

        if (existingName || existingDisplayName) return;
        await onSubmit(values);
    });

    React.useEffect(() => {
        if (id === form.values.id) return;
        const callableFunction = callableFunctions.find((f) => f.id === id);
        if (!callableFunction) return;
        form.setValues({
            ...callableFunction.toJSON(),
            displayName: getFunctionDisplayName(callableFunction.id),
            code: getFunctionCode(callableFunction.id),
        });
    }, [callableFunctions, form, getFunctionCode, getFunctionDisplayName, id]);

    React.useEffect(() => {
        if (form.isDirty() || !query.has("template")) return;
        const templateName = query.get("template");
        const template = functionTemplates.find(
            (t) => t.template === templateName
        );
        if (!template) return;
        const { template: _, ...formValues } = template;

        form.setValues(formValues);
    }, [form, query]);

    return (
        <CallableFunctionFormContext.Provider form={form}>
            <form onSubmit={handleSubmit}>{children}</form>
        </CallableFunctionFormContext.Provider>
    );
};

export default CallableFunctionFormProvider;
