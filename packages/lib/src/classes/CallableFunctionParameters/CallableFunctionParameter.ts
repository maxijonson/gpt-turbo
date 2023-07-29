import { v4 as uuid } from "uuid";
import {
    JsonSchemaBase,
    jsonSchemaBaseSchema,
} from "../../schemas/jsonSchema.schema.js";

export abstract class CallableFunctionParameter<
    TModel extends JsonSchemaBase = JsonSchemaBase,
> {
    abstract readonly type: string;

    /**
     * A UUID generated for this parameter by the library.
     */
    public id = uuid();

    title?: JsonSchemaBase["title"];
    description?: JsonSchemaBase["description"];
    default?: JsonSchemaBase["default"];
    examples?: JsonSchemaBase["examples"];
    readOnly?: JsonSchemaBase["readOnly"];
    writeOnly?: JsonSchemaBase["writeOnly"];
    deprecated?: JsonSchemaBase["deprecated"];
    $comment?: JsonSchemaBase["$comment"];

    constructor(
        public name: string,
        options: JsonSchemaBase = {}
    ) {
        this.name = name;
        this.title = options.title;
        this.description = options.description;
        this.default = options.default;
        this.examples = options.examples;
        this.readOnly = options.readOnly;
        this.writeOnly = options.writeOnly;
        this.deprecated = options.deprecated;
        this.$comment = options.$comment;
    }

    /**
     * Serializes the parameter into a JSON object.
     */
    abstract toJSON(): TModel;

    protected toJSONBase(): JsonSchemaBase {
        const json: JsonSchemaBase = {
            title: this.title,
            description: this.description,
            default: this.default,
            examples: this.examples,
            readOnly: this.readOnly,
            writeOnly: this.writeOnly,
            deprecated: this.deprecated,
            $comment: this.$comment,
        };
        return jsonSchemaBaseSchema.parse(json);
    }
}
