import { Injectable, NotFoundException } from "@nestjs/common";
import { Conversation, ConversationConfigModel } from "gpt-turbo";

@Injectable()
export class ConversationsService {
    private conversations: Conversation[] = [];

    createConversation(config: ConversationConfigModel) {
        const conversation = new Conversation({ config });
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

    prompt(id: string, message: string) {
        const conversation = this.getConversation(id);
        if (!conversation) {
            throw new NotFoundException("Conversation not found");
        }
        return conversation.prompt(message);
    }

    reprompt(id: string, messageId: string, prompt?: string) {
        const conversation = this.getConversation(id);
        if (!conversation) {
            throw new NotFoundException("Conversation not found");
        }

        const message = conversation.history
            .getMessages()
            .find((m) => m.id === messageId);

        if (!message) {
            throw new NotFoundException("Message not found");
        }

        return conversation.reprompt(message, prompt);
    }
}
