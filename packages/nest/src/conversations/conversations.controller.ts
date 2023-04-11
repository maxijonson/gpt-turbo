import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ConversationsService } from "./conversations.service.js";
import {
    CreateConversationDto,
    createConversationDtoSchema,
} from "./dtos/createConversation.dto.js";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import getRequestBody from "../utils/getRequestBody.js";
import { PromptDto, promptDtoSchema } from "./dtos/prompt.dto.js";
import { ZodValidationPipe } from "nestjs-zod";
import { uuidSchema } from "../schemas/uuidSchema.js";

@Controller("conversations")
@ApiTags("conversations")
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) {}

    @Post()
    @ApiOperation({
        description: "Create a new conversation",
        requestBody: getRequestBody(
            createConversationDtoSchema,
            "Conversation configuration"
        ),
    })
    createConversation(
        @Body(new ZodValidationPipe(createConversationDtoSchema))
        createConversationDto: CreateConversationDto
    ) {
        return this.conversationsService.createConversation(
            createConversationDto
        );
    }

    @Post(":id")
    @ApiOperation({
        description: "Add a prompt to the conversation",
        requestBody: getRequestBody(
            promptDtoSchema,
            "The prompt to send to the conversation"
        ),
    })
    prompt(
        @Body(new ZodValidationPipe(promptDtoSchema)) { prompt }: PromptDto,
        @Param("id", new ZodValidationPipe(uuidSchema)) id: string
    ) {
        return this.conversationsService.prompt(id, prompt);
    }

    @Get()
    @ApiOperation({
        description: "Get all conversations",
    })
    getConversations() {
        return this.conversationsService.getConversations();
    }
}
