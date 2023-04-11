import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ConversationsService } from "./conversations.service.js";
import {
    CreateConversationDtoEntity,
    createConversationDtoSchema,
    createConversationResponseDtoSchema,
} from "./dtos/createConversation.dto.js";
import { ApiTags } from "@nestjs/swagger";
import {
    PromptDtoEntity,
    promptDtoSchema,
    promptResponseDtoSchema,
} from "./dtos/prompt.dto.js";
import { ZodValidationPipe } from "nestjs-zod";
import { uuidSchema } from "../schemas/uuidSchema.js";
import { UseZodApiOperation } from "../decorators/zod-api-operation.decorator.js";
import { getConversationsResponseDtoSchema } from "./dtos/getConversations.dto.js";

@Controller("conversations")
@ApiTags("conversations")
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) {}

    @Post()
    @UseZodApiOperation(
        "Create a new conversation",
        {
            description: "Conversation configuration",
            schema: createConversationDtoSchema,
        },
        {
            status: 201,
            body: {
                description: "The ID of the created conversation",
                schema: createConversationResponseDtoSchema,
            },
        }
    )
    public createConversation(
        @Body()
        createConversationDto: CreateConversationDtoEntity
    ) {
        return this.conversationsService.createConversation(
            createConversationDto
        );
    }

    @Post(":id")
    @UseZodApiOperation(
        "Add a prompt to the conversation",
        {
            description: "The prompt to send to the conversation",
            schema: promptDtoSchema,
        },
        {
            status: 201,
            body: {
                description: "The message returned by the assistant",
                schema: promptResponseDtoSchema,
            },
        }
    )
    public prompt(
        @Body() { prompt }: PromptDtoEntity,
        @Param("id", new ZodValidationPipe(uuidSchema)) id: string
    ) {
        return this.conversationsService.prompt(id, prompt);
    }

    @Get()
    @UseZodApiOperation("Get all conversations", undefined, {
        status: 200,
        body: {
            description: "The list of conversations",
            schema: getConversationsResponseDtoSchema,
        },
    })
    getConversations() {
        return this.conversationsService.getConversations();
    }
}
