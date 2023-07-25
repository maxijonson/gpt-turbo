import { Module } from "@nestjs/common";
import { DbService } from "./db.service.js";
import { DbController } from "./db.controller.js";
import { ConversationsModule } from "../conversations/conversations.module.js";

@Module({
    controllers: [DbController],
    providers: [DbService],
    imports: [ConversationsModule],
})
export class DbModule {}
