import { v4 as uuid } from "uuid";
import { Conversation } from "../../src/classes/Conversation.js";
import { ZodError } from "zod";
import {
    ConversationConfigModel,
    ConversationRequestOptionsModel,
    Message,
    PromptOptions,
} from "../../src/index.js";

const defaultConfig: ConversationConfigModel = {
    dry: true,
};

describe("Conversation", () => {
    describe("constructor", () => {
        it("should create a new Conversation instance with default options", () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });

            expect(conversation).toBeInstanceOf(Conversation);
            expect(conversation.id).toBeDefined();
            expect(conversation.config).toBeDefined();
            expect(conversation.requestOptions).toBeDefined();
            expect(conversation.history).toBeDefined();
            expect(conversation.callableFunctions).toBeDefined();
            expect(conversation.plugins).toBeDefined();
        });

        it("should warn if the Conversation is created without an API key and without dry mode", () => {
            const spy = jest.spyOn(console, "warn").mockImplementation();

            const conversation = new Conversation();

            expect(spy).toHaveBeenCalledWith(
                "[gpt-turbo] No OpenAI API key was provided. Conversation will run on dry mode. If this was intentional, you should explicitly set the 'dry' parameter to 'true'."
            );
            expect(conversation.config.dry).toBe(true);

            spy.mockRestore();
        });

        it("should have the id passed in the options", () => {
            const id = uuid();
            const conversation = new Conversation({
                id,
                config: defaultConfig,
            });

            expect(conversation.id).toBe(id);
        });
    });

    describe("fromJSON", () => {
        it("should create a new Conversation instance from a JSON object", () => {
            const id = uuid();
            const conversation = Conversation.fromJSON({
                id,
                config: defaultConfig,
            });

            expect(conversation).toBeInstanceOf(Conversation);
            expect(conversation.id).toBe(id);
        });

        it("should fail if the JSON has invalid properties", () => {
            expect(() => {
                Conversation.fromJSON({
                    id: "invalid-id",
                    config: defaultConfig,
                });
            }).toThrow(ZodError);
        });
    });

    describe("toJSON", () => {
        it("should return a JSON object with the Conversation properties", () => {
            const id = uuid();
            const conversation = new Conversation({
                id,
                config: defaultConfig,
            });
            const json = conversation.toJSON();

            const expectedKeys = [
                "id",
                "config",
                "requestOptions",
                "history",
                "callableFunctions",
                "pluginsData",
            ];
            for (const expectedKey of expectedKeys) {
                expect(json).toHaveProperty(expectedKey);
            }

            expect(json.id).toBe(id);
            expect(Object.keys(json)).toHaveLength(expectedKeys.length);
        });
    });

    describe("prompt", () => {
        it("should add the user prompt to the history", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });
            const prompt = "This is a prompt";
            const spy = jest.spyOn(conversation.history, "addUserMessage");

            await conversation.prompt(prompt);

            expect(spy).toHaveBeenCalledWith(prompt);

            const userMessage = conversation.history.getMessages()[0];
            expect(userMessage.content).toBe(prompt);
            expect(userMessage.role).toBe("user");
        });

        it("should add the assistant response to the history", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });
            const spy = jest.spyOn(conversation.history, "addMessage");

            const response = await conversation.prompt("This is a prompt");

            expect(spy).toHaveBeenCalledWith(response);

            const assistantMessage = conversation.history.getMessages()[1];
            expect(assistantMessage.content).toBe(response.content);
            expect(assistantMessage.role).toBe("assistant");
        });

        it("should remove the user prompt from the history if an error occurs while getting the assistant response", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });
            const error = new Error("Test error");
            const spy = jest.spyOn(conversation.history, "removeMessage");

            jest.spyOn(
                conversation["chatCompletionService"],
                "getAssistantResponse"
            ).mockImplementation(() => {
                throw error;
            });

            await expect(
                conversation.prompt("This is a prompt")
            ).rejects.toThrow(error);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(conversation.history.getMessages()).toHaveLength(0);
        });

        it.each([
            [undefined, undefined],
            [{ user: "lib-test" }, undefined],
            [undefined, { headers: { "User-Agent": "lib-test" } }],
        ] as [
            PromptOptions | undefined,
            ConversationRequestOptionsModel | undefined,
        ][])(
            "should pass overrides to the chat completion (%#)",
            async (options, requestOptions) => {
                const conversation = new Conversation({
                    config: defaultConfig,
                });
                const spy = jest.spyOn(
                    conversation["chatCompletionService"],
                    "getAssistantResponse"
                );

                await conversation.prompt(
                    "This is a prompt",
                    options,
                    requestOptions
                );

                expect(spy).toHaveBeenCalledWith(options, requestOptions);
            }
        );

        it.each([[undefined], [{ headers: { "User-Agent": "lib-test" } }]] as [
            ConversationRequestOptionsModel | undefined,
        ][])(
            "should pass overrides to the moderation (%#)",
            async (requestOptions) => {
                const conversation = new Conversation({
                    config: defaultConfig,
                });
                const spy = jest.spyOn(
                    conversation["chatCompletionService"],
                    "moderateMessage"
                );

                await conversation.prompt(
                    "This is a prompt",
                    undefined,
                    requestOptions
                );

                expect(spy).toHaveBeenCalledWith(
                    expect.anything(),
                    requestOptions
                );
            }
        );
    });

    describe("reprompt", () => {
        it("should reprompt the message, given a user message id", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });

            await conversation.prompt("This is a prompt");
            const userMessage = conversation.history.getMessages()[0];

            await conversation.reprompt(userMessage.id);
            const repromptUserMessage = conversation.history.getMessages()[0];

            expect(conversation.history.getMessages()).toHaveLength(2);
            expect(repromptUserMessage.content).toBe(userMessage.content);
            expect(repromptUserMessage.id).not.toBe(userMessage.id);
        });

        it("should reprompt the message, given a user message", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });

            await conversation.prompt("This is a prompt");
            const userMessage = conversation.history.getMessages()[0];

            await conversation.reprompt(userMessage);
            const repromptUserMessage = conversation.history.getMessages()[0];

            expect(conversation.history.getMessages()).toHaveLength(2);
            expect(repromptUserMessage.content).toBe(userMessage.content);
            expect(repromptUserMessage.id).not.toBe(userMessage.id);
        });

        it("should reprompt the message, given an assistant message id", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });

            await conversation.prompt("This is a prompt");
            const userMessage = conversation.history.getMessages()[0];
            const assistantMessage = conversation.history.getMessages()[1];

            await conversation.reprompt(assistantMessage.id);
            const repromptUserMessage = conversation.history.getMessages()[0];
            const repromptAssistantMessage =
                conversation.history.getMessages()[1];

            expect(conversation.history.getMessages()).toHaveLength(2);
            expect(repromptUserMessage.content).toBe(userMessage.content);
            expect(repromptUserMessage.id).not.toBe(userMessage.id);
            expect(repromptAssistantMessage.content).toBe(
                assistantMessage.content
            );
            expect(repromptAssistantMessage.id).not.toBe(assistantMessage.id);
        });

        it("should reprompt the message, given an assistant message", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });

            await conversation.prompt("This is a prompt");
            const userMessage = conversation.history.getMessages()[0];
            const assistantMessage = conversation.history.getMessages()[1];

            await conversation.reprompt(assistantMessage);
            const repromptUserMessage = conversation.history.getMessages()[0];
            const repromptAssistantMessage =
                conversation.history.getMessages()[1];

            expect(conversation.history.getMessages()).toHaveLength(2);
            expect(repromptUserMessage.content).toBe(userMessage.content);
            expect(repromptUserMessage.id).not.toBe(userMessage.id);
            expect(repromptAssistantMessage.content).toBe(
                assistantMessage.content
            );
            expect(repromptAssistantMessage.id).not.toBe(assistantMessage.id);
        });

        it("should reprompt the message with a new prompt", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });
            const newPrompt = "This is a new prompt";

            await conversation.prompt("This is a prompt");
            const userMessage = conversation.history.getMessages()[0];

            await conversation.reprompt(userMessage.id, newPrompt);
            const repromptUserMessage = conversation.history.getMessages()[0];

            expect(conversation.history.getMessages()).toHaveLength(2);
            expect(repromptUserMessage.content).toBe(newPrompt);
        });

        it("should throw an error if the reprompt message is not found", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });
            const id = uuid();

            await conversation.prompt("This is a prompt");

            await expect(conversation.reprompt(id)).rejects.toThrow(
                `Message with ID "${id}" not found.`
            );
        });

        it("should throw an error if it fails to find the previous user message", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });

            await conversation.prompt("This is a prompt");
            const userMessage = conversation.history.getMessages()[0];
            userMessage["role"] = "assistant";
            const assistantMessage = conversation.history.getMessages()[1];

            await expect(
                conversation.reprompt(assistantMessage)
            ).rejects.toThrow(
                `Could not find a previous user message to reprompt from (${assistantMessage.id}).`
            );
        });

        it("should throw an error if the reprompted message is empty", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });

            await conversation.prompt("This is a prompt");
            const userMessage = conversation.history.getMessages()[0];
            userMessage.content = null;

            await expect(conversation.reprompt(userMessage)).rejects.toThrow();
        });
    });

    describe("functionPrompt", () => {
        it("should add the function prompt to the history (string result)", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });
            const name = "name";
            const result = "result";
            const spy = jest.spyOn(conversation.history, "addFunctionMessage");

            await conversation.functionPrompt(name, result);

            expect(spy).toHaveBeenCalledWith(result, name);

            const functionMessage = conversation.history.getMessages()[0];
            expect(functionMessage.content).toBe(result);
            expect(functionMessage.name).toBe(name);
        });

        it("should add the function prompt to the history (object result)", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });
            const name = "name";
            const result = { test: 1 };
            const resultStr = JSON.stringify(result);
            const spy = jest.spyOn(conversation.history, "addFunctionMessage");

            await conversation.functionPrompt(name, result);

            expect(spy).toHaveBeenCalledWith(resultStr, name);

            const functionMessage = conversation.history.getMessages()[0];
            expect(functionMessage.content).toBe(resultStr);
            expect(functionMessage.name).toBe(name);
        });

        it("should add the assistant response to the history", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });
            const spy = jest.spyOn(conversation.history, "addMessage");

            const response = await conversation.functionPrompt(
                "name",
                "result"
            );

            expect(spy).toHaveBeenCalledWith(response);

            const assistantMessage = conversation.history.getMessages()[1];
            expect(assistantMessage.content).toBe(response.content);
            expect(assistantMessage.role).toBe("assistant");
        });

        it("should remove the function prompt from the history if an error occurs while getting the assistant response", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });
            const error = new Error("Test error");
            const spy = jest.spyOn(conversation.history, "removeMessage");

            jest.spyOn(
                conversation["chatCompletionService"],
                "getAssistantResponse"
            ).mockImplementation(() => {
                throw error;
            });

            await expect(
                conversation.functionPrompt("name", "result")
            ).rejects.toThrow(error);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(conversation.history.getMessages()).toHaveLength(0);
        });

        it.each([
            [undefined, undefined],
            [{ user: "lib-test" }, undefined],
            [undefined, { headers: { "User-Agent": "lib-test" } }],
        ] as [
            PromptOptions | undefined,
            ConversationRequestOptionsModel | undefined,
        ][])(
            "should pass overrides to the chat completion (%#)",
            async (options, requestOptions) => {
                const conversation = new Conversation({
                    config: defaultConfig,
                });
                const spy = jest.spyOn(
                    conversation["chatCompletionService"],
                    "getAssistantResponse"
                );

                await conversation.functionPrompt(
                    "name",
                    "result",
                    options,
                    requestOptions
                );

                expect(spy).toHaveBeenCalledWith(options, requestOptions);
            }
        );

        it.each([[undefined], [{ headers: { "User-Agent": "lib-test" } }]] as [
            ConversationRequestOptionsModel | undefined,
        ][])(
            "should pass overrides to the moderation (%#)",
            async (requestOptions) => {
                const conversation = new Conversation({
                    config: defaultConfig,
                });
                const spy = jest.spyOn(
                    conversation["chatCompletionService"],
                    "moderateMessage"
                );

                await conversation.functionPrompt(
                    "name",
                    "result",
                    undefined,
                    requestOptions
                );

                expect(spy).toHaveBeenCalledWith(
                    expect.anything(),
                    requestOptions
                );
            }
        );
    });

    describe("getChatCompletionResponse", () => {
        it("should pass the arguments back to the chat completion service", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });
            const spy = jest.spyOn(
                conversation["chatCompletionService"],
                "getChatCompletionResponse"
            );

            await conversation.getChatCompletionResponse();

            expect(spy).toHaveBeenCalledWith();
        });

        it("should return the chat completion response", async () => {
            const conversation = new Conversation({
                config: defaultConfig,
            });

            const response = await conversation.getChatCompletionResponse();

            expect(response).toBeDefined();
            expect(response).toBeInstanceOf(Message);
        });
    });
});
