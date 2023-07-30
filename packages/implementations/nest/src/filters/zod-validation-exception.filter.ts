import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
} from "@nestjs/common";
import { Response } from "express";
import { ZodValidationException } from "nestjs-zod";

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ZodValidationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const messages = exception
            .getZodError()
            .errors.map(({ path, message }) => `${path.join(".")}: ${message}`);

        const badRequest = new BadRequestException(messages.join(". "));
        const badRequestResponse = badRequest.getResponse();
        const badRequestJson =
            typeof badRequestResponse === "string"
                ? { message: badRequestResponse }
                : badRequestResponse;

        response.status(badRequest.getStatus()).json({
            ...badRequestJson,
            messages,
            errors: exception.getZodError().errors,
        });
    }
}
