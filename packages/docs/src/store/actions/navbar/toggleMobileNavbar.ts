import { createAction } from "../createAction";

export const toggleMobileNavbar = createAction(({ set }, opened?: boolean) => {
    set((state) => {
        state.navbar.mobileNavbarOpened =
            opened ?? !state.navbar.mobileNavbarOpened;
    });
}, "toggleMobileNavbar");
