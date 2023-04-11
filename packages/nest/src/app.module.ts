import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ConversationsModule } from "./conversations/conversations.module.js";
import { DbModule } from "./db/db.module.js";

@Module({
    imports: [ConversationsModule, DbModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
