import { CallableFunction, CallableFunctionNumber } from "gpt-turbo";
import type { FunctionTemplate } from ".";
import getFunctionBody from "../getFunctionBody";

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

export default {
    ...asyncTemplate.toJSON(),
    template: "async",
    displayName: "Async",
    code: getFunctionBody((ms: number) => {
        return (async () => {
            await new Promise((res) => setTimeout(res, ms));
            return ms;
        })();
    }),
} satisfies FunctionTemplate;
