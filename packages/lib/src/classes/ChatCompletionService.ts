import { Message } from "./Message.js";
import { ConversationConfig } from "./ConversationConfig.js";
import { ConversationRequestOptions } from "./ConversationRequestOptions.js";
import { ConversationHistory } from "./ConversationHistory.js";
import { ConversationCallableFunctions } from "./ConversationCallableFunctions.js";
import { ConversationRequestOptionsModel } from "../schemas/conversationRequestOptions.schema.js";
import { ModerationException } from "../exceptions/ModerationException.js";
import createDryChatCompletion from "../utils/createDryChatCompletion.js";
import createChatCompletion from "../utils/createChatCompletion.js";
import {
    HandleChatCompletionOptions,
    PromptOptions,
} from "../utils/types/index.js";
import { ConversationPluginService } from "./ConversationPluginService.js";

/**
 * Encapsulates the logic for sending requests to the OpenAI API for the Create Chat Completion endpoint.
 *
 * @internal
 * This class is used internally by the library and is not meant to be **instantiated** by consumers of the library.
 */
export class ChatCompletionService {
    constructor(
        private readonly pluginService: ConversationPluginService,
        private readonly config: ConversationConfig,
        private readonly requestOptions: ConversationRequestOptions,
        private readonly history: ConversationHistory,
        private readonly callableFunctions: ConversationCallableFunctions
    ) {}

    /**
     * @internal
     * Should not be used directly by library consumers. Use `getChatCompletionResponse` from the `Conversation` class instead.
     */
    public async getChatCompletionResponse(
        options: PromptOptions = {},
        requestOptions: ConversationRequestOptionsModel = {}
    ): Promise<Message> {
        const stream = options.stream ?? this.config.stream;
        const message = stream
            ? this.handleStreamedResponse(options, requestOptions)
            : await this.handleNonStreamedResponse(options, requestOptions);
        await this.pluginService.onChatCompletion(message);
        return message;
    }

    /**
     * Gets the assistant's response given the current messages stored in the conversation's history, moderates it if moderation is enabled, and adds it to the conversation's history.
     *
     * @param options Additional options to pass to the Create Chat Completion API endpoint. This overrides the config passed to the constructor.
     * @param requestOptions Additional options to pass for the HTTP request. This overrides the config passed to the constructor.
     * @returns The assistant's response as a [`Message`](./Message.js) instance.
     */
    public async getAssistantResponse(
        options?: PromptOptions,
        requestOptions?: ConversationRequestOptionsModel
    ) {
        const response = await this.getChatCompletionResponse(
            options,
            requestOptions
        );
        await this.moderateMessage(response, requestOptions);
        return this.history.addMessage(response);
    }

    /**
     * @internal
     * Should not be used directly by library consumers. Use `moderate` from the `Message` class instead.
     */
    public async moderateMessage(
        message: Message,
        requestOptions?: ConversationRequestOptionsModel
    ) {
        if (!this.config.isModerationEnabled) return;

        await message.moderate(this.config.apiKey, {
            ...this.requestOptions.getRequestOptions(),
            ...requestOptions,
        });
        await this.pluginService.onModeration(message);

        const flags = message.flags ?? [];

        if (this.config.isModerationStrict && flags.length > 0) {
            throw new ModerationException(flags);
        }
    }

    public handleStreamedResponse(
        options: HandleChatCompletionOptions = {},
        requestOptions: ConversationRequestOptionsModel = {}
    ) {
        const message = new Message("assistant", "", this.config.model);
        const messages = this.history.getCreateChatCompletionMessages();

        if (this.config.dry) {
            const historyMessages = this.history.getMessages();
            const response = createDryChatCompletion(
                historyMessages[historyMessages.length - 1]?.content ?? "",
                {
                    model: this.config.model,
                }
            );
            message.readContentFromStream(response);
        } else {
            createChatCompletion(
                {
                    ...this.config.getChatCompletionConfig(),
                    ...options,
                    stream: true,
                    messages,
                    functions:
                        this.callableFunctions.getCreateChatCompletionFunctions(),
                },
                {
                    ...this.requestOptions.getRequestOptions(),
                    ...requestOptions,
                }
            ).then((response) => {
                // Using .then() to get the message out as soon as possible, since the content is known to be empty at first.
                // This gives time for client code to subscribe to the streaming events.
                message.readContentFromStream(response);
            });
        }

        return message;
    }

    public async handleNonStreamedResponse(
        options: HandleChatCompletionOptions = {},
        requestOptions: ConversationRequestOptionsModel = {}
    ) {
        const message = new Message("assistant", "", this.config.model);
        const messages = this.history.getCreateChatCompletionMessages();

        if (this.config.dry) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            message.content = messages[messages.length - 1]?.content ?? null;
        } else {
            const response = await createChatCompletion(
                {
                    ...this.config.getChatCompletionConfig(),
                    ...options,
                    stream: false,
                    messages,
                    functions:
                        this.callableFunctions.getCreateChatCompletionFunctions(),
                },
                {
                    ...this.requestOptions.getRequestOptions(),
                    ...requestOptions,
                }
            );
            const responseMessage = response.choices[0].message;
            message.content = responseMessage.content;
            if (responseMessage.function_call) {
                try {
                    message.functionCall = {
                        name: responseMessage.function_call.name,
                        arguments: JSON.parse(
                            responseMessage.function_call.arguments
                        ),
                    };
                } catch {
                    throw new Error(
                        "Assistant did not generate valid JSON arguments."
                    );
                }
            }
        }

        return message;
    }
}
