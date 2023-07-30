import { AppStateSlice } from "..";

export interface SavedPromptsState {
    savedPrompts: { name: string; value: string }[];
}

export const initialSavedPromptsState: SavedPromptsState = {
    savedPrompts: [],
};

export const createSavedPromptsSlice: AppStateSlice<SavedPromptsState> = () =>
    initialSavedPromptsState;
