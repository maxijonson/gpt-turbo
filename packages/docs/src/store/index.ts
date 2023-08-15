"use client";

import { StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";
import { enableMapSet } from "immer";
import {
    NavbarState,
    createNavbarSlice,
    initialNavbarState,
} from "./slices/navbarSlice";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

// eslint-disable-next-line @typescript-eslint/ban-types
export type AppState = {
    navbar: NavbarState;
};

export type AppStateSlice<T> = StateCreator<
    AppState,
    [["zustand/immer", never], ["zustand/devtools", never]],
    [],
    T
>;

export const initialAppState: AppState = {
    navbar: initialNavbarState,
};

enableMapSet();

export const useAppStore = createWithEqualityFn<AppState>()(
    immer(
        devtools(
            (...a) => ({
                navbar: createNavbarSlice(...a),
            }),
            {
                enabled: process.env.NODE_ENV === "development",
            }
        )
    ),
    shallow
);
