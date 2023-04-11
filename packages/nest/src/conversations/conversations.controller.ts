import { Body, Controller, Param, Post } from "@nestjs/common";
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
        requestBody: getRequestBody(
            promptDtoSchema,
            "Add a prompt to the conversation"
        ),
    })
    prompt(
        @Body(new ZodValidationPipe(promptDtoSchema)) { prompt }: PromptDto,
        @Param("id", new ZodValidationPipe(uuidSchema)) id: string
    ) {
        return this.conversationsService.prompt(id, prompt);
    }
}
