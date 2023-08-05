import { createAction } from "../createAction";

export const setShowDesktopNavbar = createAction(({ set }, value: boolean) => {
    set((state) => {
        state.navbar.showDesktopNavbar = value;
    });
}, "setShowDesktopNavbar");
