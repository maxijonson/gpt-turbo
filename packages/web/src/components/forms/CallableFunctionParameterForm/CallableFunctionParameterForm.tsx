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
import OptionalTextInput from "../../inputs/OptionalTextInput";
import OptionalBooleanInput from "../../inputs/OptionalBooleanInput";
import { BiInfoCircle } from "react-icons/bi";
import getErrorInfo from "../../../utils/getErrorInfo";

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
    onClose?: () => void;
    parameter?: z.infer<typeof callableFunctionParameterFormSchema> | null;
}

const callableFunctionParameterFormSchema = jsonSchemaBaseSchema.extend({
    name: z
        .string()
        .nonempty("Name is required")
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
    onClose = () => {},
    parameter = null,
}: CallableFunctionParameterFormProps) => {
    const form = useForm<z.infer<typeof callableFunctionParameterFormSchema>>({
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

            const nextJson = (() => {
                switch (type) {
                    case "string":
                        return { type: "string" };
                    case "number":
                        return { type: "number" };
                    case "boolean":
                        return { type: "boolean" };
                    case "null":
                        return { type: "null" };
                    case "enum":
                        return { enum: [] };
                    case "const":
                        return { const: null };
                    case "object":
                        return { type: "object" };
                    case "array":
                        return { type: "array" };
                }
            })();

            if (nextJson) {
                form.setFieldValue(
                    "jsonSchema",
                    JSON.stringify(nextJson, null, 2)
                );
            }
        },
        [form]
    );

    const handleSubmit = form.onSubmit(
        ({ name, jsonSchema, required, ...jsonSchemaBase }) => {
            let parsedJsonSchema: any;
            try {
                parsedJsonSchema = JSON.parse(jsonSchema);
                parameterTypeSchema.parse(parsedJsonSchema);
            } catch (e) {
                form.setFieldError("jsonSchema", getErrorInfo(e).message);
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

    // Update form values with the props.parameter
    React.useEffect(() => {
        if (form.isDirty() || !parameter) return;
        form.setFieldValue("name", parameter.name);
        form.setFieldValue("required", parameter.required);

        const json = JSON.parse(parameter.jsonSchema);
        const type = (() => {
            if (json.type) {
                return json.type;
            } else if (json.enum) {
                return "enum";
            } else if (json.const) {
                return "const";
            }
            return "unknown";
        })();
        setParameterType(type);

        form.setFieldValue("title", json.title);
        json.title = undefined;

        form.setFieldValue("description", json.description);
        json.description = undefined;

        form.setFieldValue("default", json.default);
        json.default = undefined;

        form.setFieldValue("readOnly", json.readOnly);
        json.readOnly = undefined;

        form.setFieldValue("writeOnly", json.writeOnly);
        json.writeOnly = undefined;

        form.setFieldValue("deprecated", json.deprecated);
        json.deprecated = undefined;

        form.setFieldValue("$comment", json.$comment);
        json.$comment = undefined;

        form.setFieldValue("jsonSchema", JSON.stringify(json, null, 2));
    }, [form, parameter]);

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
                        {...form.getInputProps("name")}
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
                            {...form.getInputProps("required", {
                                type: "checkbox",
                            })}
                        />
                    </Input.Wrapper>
                </Group>
                <Divider label="Base" labelPosition="center" />
                <OptionalTextInput
                    {...form.getInputProps("description")}
                    label="Description"
                    description="This is where you should describe to the AI what this parameter is for."
                />
                <Group noWrap grow>
                    <OptionalTextInput
                        {...form.getInputProps("title")}
                        label="Title"
                    />
                    <OptionalTextInput
                        {...form.getInputProps("default")}
                        label="Default"
                    />
                </Group>
                <Group noWrap grow>
                    <OptionalBooleanInput
                        {...form.getInputProps("readOnly")}
                        label="Read Only"
                    />
                    <OptionalBooleanInput
                        {...form.getInputProps("writeOnly")}
                        label="Write Only"
                    />
                    <OptionalBooleanInput
                        {...form.getInputProps("deprecated")}
                        label="Deprecated"
                    />
                </Group>
                <OptionalTextInput
                    {...form.getInputProps("$comment")}
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
                    {...form.getInputProps("jsonSchema")}
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
                <Group position="right">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </Group>
            </Stack>
        </form>
    );
};

export default CallableFunctionParameterForm;
