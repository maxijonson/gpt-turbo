import { Body, Controller, Post } from "@nestjs/common";
import { ConversationsService } from "./conversations.service.js";
import {
    CreateConversationDto,
    createConversationDtoSchema,
} from "./dtos/createConversation.dto.js";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import getRequestBody from "../utils/getRequestBody.js";

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
        @Body()
        createConversationDto: CreateConversationDto
    ) {
        return this.conversationsService.createConversation(
            createConversationDto
        );
    }
}
