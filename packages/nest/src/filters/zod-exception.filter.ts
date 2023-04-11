import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { ZodError } from "zod";

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
    catch(exception: ZodError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const badRequest = new BadRequestException(
            exception.issues.map((issue) => issue.message)
        );

        response.status(badRequest.getStatus()).json(badRequest.getResponse());
    }
}
