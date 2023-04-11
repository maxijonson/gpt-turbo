import { Injectable, NotFoundException } from "@nestjs/common";
import { Conversation, ConversationConfigParameters } from "gpt-turbo";

@Injectable()
export class ConversationsService {
    private conversations: Conversation[] = [];

    createConversation(config: ConversationConfigParameters) {
        const conversation = new Conversation(config);
        this.addConversation(conversation);
        return conversation;
    }

    addConversation(conversation: Conversation) {
        this.conversations.push(conversation);
    }

    getConversations() {
        return this.conversations.slice();
    }

    getConversation(id: string) {
        return this.conversations.find((c) => c.id === id);
    }

    deleteConversation(id: string) {
        this.conversations = this.conversations.filter((c) => c.id !== id);
    }

    async prompt(id: string, message: string) {
        const conversation = this.getConversation(id);
        if (!conversation) {
            throw new NotFoundException("Conversation not found");
        }
        return conversation.prompt(message);
    }
}