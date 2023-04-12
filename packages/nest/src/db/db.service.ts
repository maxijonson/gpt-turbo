import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Persistence, persistenceSchema } from "./schemas/persistence.js";
import { Conversation, DEFAULT_DISABLEMODERATION } from "gpt-turbo";
import {
    PersistenceConversation,
    persistenceConversationSchema,
} from "./schemas/persistenceConversation.js";
import { ConversationsService } from "../conversations/conversations.service.js";
import { PersistenceMessage } from "./schemas/persistenceMessage.js";

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    private readonly db!: Low<Persistence>;

    constructor(private readonly conversationsService: ConversationsService) {}

    async onModuleInit() {
        const adapter = new JSONFile<Persistence>("db.json");
        // @ts-ignore
        this.db = new Low(adapter);
        await this.db.read();
        this.db.data ||= { conversations: [] };
        const conversations = await Promise.all(
            this.db.data.conversations.map((c) => this.loadConversation(c))
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

        const persistedConversations: Persistence = {
            conversations: conversations.map((conversation) => ({
                ...conversation.getConfig(),
                messages: conversation.getMessages().map(
                    (message): PersistenceMessage => ({
                        content: message.content,
                        role: message.role,
                    })
                ),
            })),
        };
        const parsed = persistenceSchema.parse(persistedConversations);

        this.db.data = parsed;
        await this.db.write();
    }

    private async loadConversation(dbConversation: PersistenceConversation) {
        const persistedConversation =
            persistenceConversationSchema.parse(dbConversation);
        const {
            messages,
            disableModeration = DEFAULT_DISABLEMODERATION,
            ...config
        } = persistedConversation;
        const newConversation = new Conversation({
            ...config,
            disableModeration: true,
        });

        for (const message of messages) {
            try {
                switch (message.role) {
                    case "user":
                        await newConversation.addUserMessage(message.content);
                        break;
                    case "assistant":
                        await newConversation.addAssistantMessage(
                            message.content
                        );
                        break;
                    case "system":
                        newConversation.setContext(message.content);
                }
            } catch (e) {
                console.error(
                    "Error while loading message",
                    (e as Error).message
                );
            }
        }

        newConversation.setConfig(
            {
                disableModeration,
            },
            true
        );
        return newConversation;
    }
}
