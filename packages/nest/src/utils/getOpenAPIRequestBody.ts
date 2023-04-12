import { RequestBodyObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface.js";
import { zodToOpenAPI } from "nestjs-zod";
import { ZodType } from "nestjs-zod/z";

export default (
    schema: ZodType,
    description?: string,
    required = true,
    contentType = "application/json"
): RequestBodyObject => ({
    description,
    required,
    content: {
        [contentType]: {
            schema: zodToOpenAPI(schema),
        },
    },
});
