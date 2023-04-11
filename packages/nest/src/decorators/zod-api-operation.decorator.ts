import { UseInterceptors, applyDecorators } from "@nestjs/common";
import { ZodType } from "nestjs-zod/z";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import getOpenAPIRequestBody from "../utils/getOpenAPIRequestBody.js";
import { zodToOpenAPI } from "nestjs-zod";
import { UseZodResponseValidation } from "./zod-response-validation.decorator.js";
import { ClassTransformInterceptor } from "../interceptors/class-transform.interceptor.js";

export interface ZodApiOperationBody<T> {
    description?: string;
    schema: ZodType<T>;
}

export const UseZodApiOperation = <REQ, RES>(
    description = "",
    request?: ZodApiOperationBody<REQ>,
    ...responses: {
        status?: number;
        body: ZodApiOperationBody<RES>;
    }[]
) => {
    const decorators: Array<
        ClassDecorator | MethodDecorator | PropertyDecorator
    > = [];

    if (request) {
        decorators.push(
            ApiOperation({
                description,
                requestBody: getOpenAPIRequestBody(
                    request.schema,
                    request.description
                ),
            })
        );
    } else if (description) {
        decorators.push(ApiOperation({ description }));
    }

    if (responses.length) {
        responses.forEach((response) => {
            decorators.push(
                ApiResponse({
                    status: response.status,
                    schema: zodToOpenAPI(response.body.schema),
                    description: response.body.description,
                }),
                UseZodResponseValidation(response.body.schema, response.status)
            );
        });
    }

    return applyDecorators(
        ...decorators,
        UseInterceptors(ClassTransformInterceptor)
    );
};
