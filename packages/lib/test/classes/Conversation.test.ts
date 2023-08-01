import { Conversation } from "../../src/classes/Conversation.js";

describe("Conversation", () => {
    describe("constructor", () => {
        it("should create a new Conversation instance with default options", () => {
            const conversation = new Conversation();

            expect(conversation).toBeInstanceOf(Conversation);
            expect(conversation.id).toBeDefined();
            expect(conversation.config).toBeDefined();
            expect(conversation.requestOptions).toBeDefined();
            expect(conversation.history).toBeDefined();
            expect(conversation.callableFunctions).toBeDefined();
            expect(conversation.plugins).toBeDefined();
        });
    });
});
