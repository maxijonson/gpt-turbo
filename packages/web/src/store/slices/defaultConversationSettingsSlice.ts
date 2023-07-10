import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
    DEFAULT_STREAM,
} from "gpt-turbo";
import { AppStateSlice } from "..";
import { Settings } from "../../entities/settings";

export interface DefaultConversationSettingsState {
    defaultSettings: Settings;
}

export const initialDefaultConversationSettingsState: DefaultConversationSettingsState =
    {
        defaultSettings: {
            apiKey: "",
            model: DEFAULT_MODEL,
            context: DEFAULT_CONTEXT,
            disableModeration: DEFAULT_DISABLEMODERATION,
            dry: DEFAULT_DRY,
            stream: DEFAULT_STREAM,
            functionIds: [],
            save: false,
            version: 1,
        },
    };

export const createDefaultConversationSettingsSlice: AppStateSlice<
    DefaultConversationSettingsState
> = () => initialDefaultConversationSettingsState;
