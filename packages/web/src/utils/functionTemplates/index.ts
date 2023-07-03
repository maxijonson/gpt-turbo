import { CallableFunctionFormValues } from "../../contexts/CallableFunctionFormContext";
import asyncTemplate from "./asyncTemplate";
import fetchTemplate from "./fetchTemplate";

export type FunctionTemplate = CallableFunctionFormValues & {
    template: string;
};

const functionTemplates: FunctionTemplate[] = [asyncTemplate, fetchTemplate];

export default functionTemplates;
