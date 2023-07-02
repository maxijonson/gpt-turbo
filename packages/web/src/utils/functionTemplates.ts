import { CallableFunction, CallableFunctionNumber } from "gpt-turbo";
import { CallableFunctionFormValues } from "../contexts/CallableFunctionFormContext";

// ---------- Template - Async
const asyncTemplate = new CallableFunction(
    "wait",
    "Wait for an amount of time, then return the amount of time waited in milliseconds."
);
asyncTemplate.addParameter(
    new CallableFunctionNumber("ms", {
        description: "The amount of time to wait, in milliseconds.",
        minimum: 0,
    }),
    true
);

export default [
    {
        template: "async",
        displayName: "Async",
        code: "return (async () => {\n    await new Promise((res) => setTimeout(res, ms))\n    return ms;\n})();",
        ...asyncTemplate.toJSON(),
    },
] satisfies (CallableFunctionFormValues & {
    template: string;
})[];
