import {
    Alert,
    Anchor,
    Button,
    Divider,
    Group,
    Input,
    JsonInput,
    Select,
    Stack,
    Switch,
    Text,
    TextInput,
} from "@mantine/core";
import React from "react";
import {
    jsonSchemaArraySchema,
    jsonSchemaBaseSchema,
    jsonSchemaBooleanSchema,
    jsonSchemaConstSchema,
    jsonSchemaEnumSchema,
    jsonSchemaNullSchema,
    jsonSchemaNumberSchema,
    jsonSchemaObjectSchema,
    jsonSchemaStringSchema,
} from "gpt-turbo";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import OptionalTextInput from "./OptionalTextInput";
import OptionalBooleanInput from "./OptionalBooleanInput";
import { BiInfoCircle } from "react-icons/bi";
import getErrorInfo from "../utils/getErrorInfo";

type CallableFunctionParameterType =
    | "string"
    | "number"
    | "boolean"
    | "null"
    | "enum"
    | "const"
    | "object"
    | "array";

export interface CallableFunctionParameterFormProps {
    onSubmit: (values: {
        name: string;
        jsonSchema: any;
        required: boolean;
    }) => void;
}

const callableFunctionParameterFormSchema = jsonSchemaBaseSchema.extend({
    name: z
        .string()
        .min(1)
        .regex(/^[a-zA-Z0-9_$]+$/, "Must be a valid JavaScript identifier"),
    jsonSchema: z.string().refine((v) => {
        try {
            JSON.parse(v);
            return true;
        } catch (e) {
            return "Invalid JSON format";
        }
    }),
    required: z.boolean(),
});

const CallableFunctionParameterForm = ({
    onSubmit,
}: CallableFunctionParameterFormProps) => {
    const parameterBaseForm = useForm<
        z.infer<typeof callableFunctionParameterFormSchema>
    >({
        initialValues: {
            name: "",
            jsonSchema: JSON.stringify({ type: "string" }, null, 2),
            required: false,
        },
        validate: zodResolver(callableFunctionParameterFormSchema),
        transformValues: callableFunctionParameterFormSchema.parse,
    });
    const [parameterType, setParameterType] =
        React.useState<CallableFunctionParameterType>("string");

    const parameterTypeSchema = React.useMemo(() => {
        switch (parameterType) {
            case "string":
                return jsonSchemaStringSchema;
            case "number":
                return jsonSchemaNumberSchema;
            case "boolean":
                return jsonSchemaBooleanSchema;
            case "null":
                return jsonSchemaNullSchema;
            case "enum":
                return jsonSchemaEnumSchema;
            case "const":
                return jsonSchemaConstSchema;
            case "object":
                return jsonSchemaObjectSchema;
            case "array":
                return jsonSchemaArraySchema;
        }
    }, [parameterType]);

    const onParameterTypeChange = React.useCallback(
        (type: CallableFunctionParameterType) => {
            setParameterType(type);

            const jsonSchema = (() => {
                switch (type) {
                    case "string":
                        return JSON.stringify({ type: "string" }, null, 2);
                    case "number":
                        return JSON.stringify({ type: "number" }, null, 2);
                    case "boolean":
                        return JSON.stringify({ type: "boolean" }, null, 2);
                    case "null":
                        return JSON.stringify({ type: "null" }, null, 2);
                    case "enum":
                        return JSON.stringify({ enum: [] }, null, 2);
                    case "const":
                        return JSON.stringify({ const: null }, null, 2);
                    case "object":
                        return JSON.stringify({ type: "object" }, null, 2);
                    case "array":
                        return JSON.stringify({ type: "array" }, null, 2);
                }
            })();

            if (jsonSchema) {
                parameterBaseForm.setFieldValue("jsonSchema", jsonSchema);
            }
        },
        [parameterBaseForm]
    );

    const handleSubmit = parameterBaseForm.onSubmit(
        ({ name, jsonSchema, required, ...jsonSchemaBase }) => {
            let parsedJsonSchema: any;
            try {
                parsedJsonSchema = JSON.parse(jsonSchema);
                parameterTypeSchema.parse(parsedJsonSchema);
            } catch (e) {
                parameterBaseForm.setFieldError(
                    "jsonSchema",
                    getErrorInfo(e).message
                );
                return;
            }

            onSubmit({
                name,
                jsonSchema: {
                    ...parsedJsonSchema,
                    ...jsonSchemaBase,
                },
                required,
            });
        }
    );

    return (
        <form
            onSubmit={(e) => {
                e.stopPropagation();
                handleSubmit(e);
            }}
        >
            <Stack spacing="sm">
                <Group noWrap grow>
                    <TextInput
                        {...parameterBaseForm.getInputProps("name")}
                        label="Parameter Name"
                        withAsterisk
                    />
                    <Select
                        value={parameterType}
                        onChange={(v: CallableFunctionParameterType) =>
                            onParameterTypeChange(v)
                        }
                        label="Type"
                        placeholder="Select parameter type"
                        withinPortal
                        withAsterisk
                        data={[
                            { value: "string", label: "String" },
                            { value: "number", label: "Number" },
                            { value: "boolean", label: "Boolean" },
                            { value: "null", label: "Null" },
                            { value: "enum", label: "Enum" },
                            { value: "const", label: "Const" },
                            { value: "object", label: "Object" },
                            { value: "array", label: "Array" },
                        ]}
                    />
                    <Input.Wrapper label="Required">
                        <Switch
                            {...parameterBaseForm.getInputProps("required")}
                        />
                    </Input.Wrapper>
                </Group>
                <Divider label="Base" labelPosition="center" />
                <Group noWrap grow>
                    <OptionalTextInput
                        {...parameterBaseForm.getInputProps("title")}
                        label="Title"
                    />
                    <OptionalTextInput
                        {...parameterBaseForm.getInputProps("default")}
                        label="Default"
                    />
                </Group>
                <OptionalTextInput
                    {...parameterBaseForm.getInputProps("description")}
                    label="Description"
                />
                <Group noWrap grow>
                    <OptionalBooleanInput
                        {...parameterBaseForm.getInputProps("readOnly")}
                        label="Read Only"
                    />
                    <OptionalBooleanInput
                        {...parameterBaseForm.getInputProps("writeOnly")}
                        label="Write Only"
                    />
                    <OptionalBooleanInput
                        {...parameterBaseForm.getInputProps("deprecated")}
                        label="Deprecated"
                    />
                </Group>
                <OptionalTextInput
                    {...parameterBaseForm.getInputProps("$comment")}
                    label="Comment"
                />
                <Divider
                    label={parameterType}
                    labelPosition="center"
                    sx={{
                        textTransform: "capitalize",
                    }}
                />
                <Alert color="blue" icon={<BiInfoCircle />}>
                    Specific inputs for JSON schema properties for{" "}
                    {parameterType} parameters are not yet supported. However,
                    you can still manually input the raw{" "}
                    <Anchor
                        href={`https://json-schema.org/understanding-json-schema/reference/${parameterType}.html`}
                        target="_blank"
                    >
                        JSON schema definition
                    </Anchor>{" "}
                    and they will still be validated.
                </Alert>
                <JsonInput
                    {...parameterBaseForm.getInputProps("jsonSchema")}
                    label="JSON Schema"
                    formatOnBlur
                    autosize
                    description={
                        <Text>
                            Based on{" "}
                            <Anchor
                                href="https://json-schema.org/understanding-json-schema/"
                                target="_blank"
                            >
                                Understanding JSON Schema
                            </Anchor>
                            . Probably best to edit in a separate editor and
                            paste here.
                        </Text>
                    }
                />
                <Group grow>
                    <Button type="submit">Submit</Button>
                </Group>
            </Stack>
        </form>
    );
};

export default CallableFunctionParameterForm;
