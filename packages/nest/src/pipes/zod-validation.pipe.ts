import { PipeTransform, Injectable } from "@nestjs/common";
import { z } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private readonly schema: z.ZodTypeAny) {}

    async transform(value: any) {
        const parsedValue = this.schema.parse(value);
        return parsedValue;
    }
}
