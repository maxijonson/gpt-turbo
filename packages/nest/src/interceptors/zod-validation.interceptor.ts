import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { ZodType } from "nestjs-zod/z";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ZodValidationInterceptor implements NestInterceptor {
    constructor(
        private readonly schema: ZodType,
        private readonly status?: number
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response = context.switchToHttp().getResponse<Response>();

        if (response.statusCode !== this.status) {
            return next.handle();
        }

        return next.handle().pipe(
            map((data) => {
                return this.schema.parse(data);
            })
        );
    }
}
