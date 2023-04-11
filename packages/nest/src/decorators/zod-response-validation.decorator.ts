import { UseInterceptors, applyDecorators } from "@nestjs/common";
import { ZodType } from "nestjs-zod/z";
import { ZodValidationInterceptor } from "../interceptors/zod-validation.interceptor.js";

export const UseZodResponseValidation = (schema: ZodType, status?: number) => {
    return applyDecorators(
        UseInterceptors(new ZodValidationInterceptor(schema, status))
    );
};
