import { CreateDryChatCompletionConfig } from "./types/index.js";

/**
 * Creates a dry chat completion and returns a `ReadableStream`. Can be used to simulate a streamed chat completion.
 *
 * @param message The message to simulate.
 * @param config The configuration for the dry chat completion.
 * @returns A `ReadableStream` that can be used to simulate a streamed chat completion.
 */
export default (
    message: string,
    config: CreateDryChatCompletionConfig = {}
) => {
    const {
        model = "gpt-3.5-turbo",
        initialDelay = 500,
        chunkDelay = 50,
    } = config;

    const tokens = message.match(/.{1,5}/g) ?? [];
    const id = `chatcmpl-${Math.random().toString(36).substring(2)}`;
    const created = Date.now();

    const getChunkBase = () => ({
        id,
        object: "chat.completion.chunk",
        created,
        model,
        choices: [
            {
                index: 0,
                finish_reason: null,
            },
        ],
    });

    const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            const send = async (chunk: object | string) => {
                const data =
                    typeof chunk === "string" ? chunk : JSON.stringify(chunk);
                await wait(chunkDelay);
                controller.enqueue(encoder.encode(`data: ${data}`));
            };

            await wait(initialDelay);

            const roleChunk = getChunkBase();
            await send({
                ...roleChunk,
                choices: [
                    {
                        ...roleChunk.choices[0],
                        delta: { role: "assistant" },
                    },
                ],
            });

            for (const token of tokens) {
                const chunkBase = getChunkBase();
                await send({
                    ...chunkBase,
                    choices: [
                        {
                            ...chunkBase.choices[0],
                            delta: { content: token },
                        },
                    ],
                });
            }

            const stopChunk = getChunkBase();
            await send({
                ...stopChunk,
                choices: [
                    {
                        ...stopChunk.choices[0],
                        delta: {},
                        finish_reason: "stop",
                    },
                ],
            });
            await send("[DONE]");
            controller.close();
        },
    });

    return stream;
};
