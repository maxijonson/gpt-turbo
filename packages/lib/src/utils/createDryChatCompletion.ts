import getMessageTokens from "./getMessageTokens.js";

export interface CreateDryChatCompletionConfig {
    /**
     * The model to use for the completion.
     *
     * @default "gpt-3.5-turbo"
     */
    model?: string;

    /**
     * The delay before the first chunk is sent.
     *
     * @default 500
     */
    initialDelay?: number;

    /**
     * The delay between each chunk.
     *
     * @default 50
     */
    chunkDelay?: number;
}

export default (
    message: string,
    config: CreateDryChatCompletionConfig = {}
) => {
    const {
        model = "gpt-3.5-turbo",
        initialDelay = 500,
        chunkDelay = 50,
    } = config;
    const tokens = getMessageTokens(message);
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
