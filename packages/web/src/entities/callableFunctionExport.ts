import { callableFunctionSchema } from "gpt-turbo";
import { z } from "zod";
import { persistenceCallableFunctionSchema } from "./persistenceCallableFunction";

export const callableFunctionExportschema = z.object({
    callableFunction: callableFunctionSchema.omit({
        id: true,
    }),
    displayName: persistenceCallableFunctionSchema.shape.displayName,
    code: persistenceCallableFunctionSchema.shape.code,
});

export type CallableFunctionExport = z.infer<
    typeof callableFunctionExportschema
>;
