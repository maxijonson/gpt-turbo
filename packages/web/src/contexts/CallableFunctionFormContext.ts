import { createFormContext } from "@mantine/form";
import { z } from "zod";
import { persistenceCallableFunctionSchema } from "../entities/persistenceCallableFunction";

const callableFunctionFormValuesSchema = persistenceCallableFunctionSchema;

export type CallableFunctionFormValues = z.infer<
    typeof callableFunctionFormValuesSchema
>;

const [FormProvider, useFormContext, useForm] =
    createFormContext<CallableFunctionFormValues>();

export const CallableFunctionFormContext = {
    Provider: FormProvider,
    useContext: useFormContext,
    useForm,
};
