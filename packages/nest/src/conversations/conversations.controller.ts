import { Body, Controller, Post } from "@nestjs/common";
import { ConversationsService } from "./conversations.service.js";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe.js";
import {
    CreateConversationDto,
    createConversationDtoSchema,
} from "./dtos/createConversation.dto.js";

@Controller("conversations")
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) {}

    @Post()
    createConversation(
        @Body(new ZodValidationPipe(createConversationDtoSchema))
        createConversationDto: CreateConversationDto
    ) {
        return this.conversationsService.createConversation(
            createConversationDto
        );
    }
}
