import { AppStateSlice } from "..";

export interface SavedContextsState {
    savedContexts: { name: string; value: string }[];
}

export const initialSavedContextsState: SavedContextsState = {
    savedContexts: [],
};

export const createSavedContextsSlice: AppStateSlice<SavedContextsState> = () =>
    initialSavedContextsState;
