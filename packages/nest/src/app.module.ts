import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ConversationsModule } from "./conversations/conversations.module.js";
import { DbModule } from "./db/db.module.js";
import { ZodValidationPipe } from "nestjs-zod";
import { APP_PIPE } from "@nestjs/core";

@Module({
    imports: [ConversationsModule, DbModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule {}
