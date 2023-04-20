import { ConversationConfigParameters } from "gpt-turbo";
import {
    GPTTURBO_APIKEY,
    GPTTURBO_MODEL,
    GPTTURBO_DRY,
    GPTTURBO_CONTEXT,
} from "../config/env.js";

export default (
    config: ConversationConfigParameters = {}
): ConversationConfigParameters => ({
    apiKey: GPTTURBO_APIKEY,
    model: GPTTURBO_MODEL,
    dry: !GPTTURBO_APIKEY || GPTTURBO_DRY,
    context: GPTTURBO_CONTEXT,
    ...config,
});
