import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Conversation, ConversationModel } from "gpt-turbo";
import { ConversationsService } from "../conversations/conversations.service.js";

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    private readonly db!: Low<ConversationModel[]>;

    constructor(private readonly conversationsService: ConversationsService) {}

    async onModuleInit() {
        const adapter = new JSONFile<ConversationModel[]>("db.json");
        // @ts-ignore
        this.db = new Low(adapter);
        await this.db.read();
        this.db.data ||= [];
        const conversations = await Promise.all(
            this.db.data.map((c) => Conversation.fromJSON(c))
        );
        conversations.forEach((c) =>
            this.conversationsService.addConversation(c)
        );
    }

    async onModuleDestroy() {
        await this.save();
    }

    async save() {
        const conversations = this.conversationsService.getConversations();
        this.db.data = conversations.map((c) => c.toJSON());
        await this.db.write();
    }
}
