import { RequestBodyObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface.js";
import { zodToOpenAPI } from "nestjs-zod";
import { ZodType } from "nestjs-zod/z";

export default (
    schema: ZodType,
    description?: string,
    required = true
): RequestBodyObject => ({
    description,
    required,
    content: {
        "application/json": {
            schema: zodToOpenAPI(schema),
        },
    },
});
