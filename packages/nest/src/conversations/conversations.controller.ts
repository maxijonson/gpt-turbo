import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
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
import messageToJson from "../utils/messageToJson.js";
import { Response } from "express";
import { z } from "nestjs-zod/z";

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

    // Intentionally not using @Sse to support both streaming and non-streaming messages from the same endpoint
    @Post(":id")
    @UseZodApiOperation(
        {
            description: "Add a prompt to the conversation",
            skipClassTransform: true,
        },
        {
            description: "The prompt to send to the conversation",
            schema: promptDtoSchema,
        },
        {
            status: 201,
            body: {
                description:
                    "The message returned by the assistant in a non-streamed response.",
                schema: promptResponseDtoSchema,
            },
        },
        {
            status: 200,
            body: {
                description:
                    "The message returned by the assistant in a streamed response.",
                schema: z.any(),
                contentType: "text/event-stream",
            },
        }
    )
    public async prompt(
        @Body() { prompt }: PromptDtoEntity,
        @Param("id", new ZodValidationPipe(uuidSchema)) id: string,
        @Res() res: Response
    ) {
        const message = await this.conversationsService.prompt(id, prompt);

        // Non-streaming message
        if (!message.isStreaming && message.content) {
            res.json(messageToJson(message));
            return;
        }

        // Streaming message
        res.set({
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });
        res.status(200);

        message.onMessageUpdate((_, m) => {
            const data = JSON.stringify(
                promptResponseDtoSchema.parse(messageToJson(m))
            );
            res.write(`data: ${data}\n\n`);
        });

        message.onMessageStreamingStop(() => {
            res.end();
        });
    }

    @Get()
    @UseZodApiOperation("Get all conversations", undefined, {
        status: 200,
        body: {
            description: "The list of conversations",
            schema: getConversationsResponseDtoSchema,
        },
    })
    public getConversations() {
        return this.conversationsService.getConversations();
    }
}
