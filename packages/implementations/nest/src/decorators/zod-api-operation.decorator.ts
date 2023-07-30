import { UseInterceptors, applyDecorators } from "@nestjs/common";
import { ZodType } from "nestjs-zod/z";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import getOpenAPIRequestBody from "../utils/getOpenAPIRequestBody.js";
import { zodToOpenAPI } from "nestjs-zod";
import { UseZodResponseValidation } from "./zod-response-validation.decorator.js";
import { ClassTransformInterceptor } from "../interceptors/class-transform.interceptor.js";

export interface ZodApiOperationBody<T> {
    schema: ZodType<T>;
    description?: string;
    contentType?: string;
}

export const UseZodApiOperation = <REQ, RES>(
    descriptionOrOptions:
        | string
        | { description?: string; skipClassTransform?: boolean } = "",
    request?: ZodApiOperationBody<REQ> & { required?: boolean },
    ...responses: {
        status?: number;
        body: ZodApiOperationBody<RES>;
    }[]
) => {
    const description =
        typeof descriptionOrOptions === "string"
            ? descriptionOrOptions
            : descriptionOrOptions.description;
    const skipClassTransform =
        typeof descriptionOrOptions === "string"
            ? false
            : descriptionOrOptions.skipClassTransform;
    const decorators: Array<
        ClassDecorator | MethodDecorator | PropertyDecorator
    > = [];

    if (request) {
        decorators.push(
            ApiOperation({
                description,
                requestBody: getOpenAPIRequestBody(
                    request.schema,
                    request.description,
                    request.required,
                    request.contentType
                ),
            })
        );
    } else if (description) {
        decorators.push(ApiOperation({ description }));
    }

    if (responses.length) {
        responses.forEach(({ body: responseBody, status }) => {
            const {
                contentType = "application/json",
                schema,
                description,
            } = responseBody;

            decorators.push(
                ApiResponse({
                    status,
                    description,
                    content: {
                        [contentType]: {
                            schema: zodToOpenAPI(schema),
                        },
                    },
                })
            );

            if (contentType === "application/json") {
                decorators.push(UseZodResponseValidation(schema, status));
            }
        });
    }

    if (!skipClassTransform) {
        decorators.push(UseInterceptors(ClassTransformInterceptor));
    }

    return applyDecorators(...decorators);
};
