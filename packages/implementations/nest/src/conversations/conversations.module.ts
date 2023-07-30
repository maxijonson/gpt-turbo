import { Module } from "@nestjs/common";
import { ConversationsService } from "./conversations.service.js";
import { ConversationsController } from "./conversations.controller.js";

@Module({
    controllers: [ConversationsController],
    providers: [ConversationsService],
    exports: [ConversationsService],
})
export class ConversationsModule {}
