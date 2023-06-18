export const DEFAULT_MODEL = "gpt-3.5-turbo";

export const DEFAULT_CONTEXT =
    "You are a large language model trained by OpenAI. Answer as concisely as possible.";

export const DEFAULT_DRY = false;

export const DEFAULT_DISABLEMODERATION = false;

export const DEFAULT_STREAM = false;

export const ENDPOINT_CHATCOMPLETION =
    "https://api.openai.com/v1/chat/completions";

export const ENDPOINT_MODERATION = "https://api.openai.com/v1/moderations";

export const PRICING_TABLE = {
    unknown: {
        prompt: 0,
        completion: 0,
    },
    "3.5": {
        prompt: 0.0000015,
        completion: 0.000002,
    },
    "3.5-16k": {
        prompt: 0.000003,
        completion: 0.000004,
    },
    "4": {
        prompt: 0.00003,
        completion: 0.00006,
    },
    "4-32k": {
        prompt: 0.00006,
        completion: 0.00012,
    },
};
