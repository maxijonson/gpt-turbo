import { AppStateSlice } from "..";

export interface NavbarState {
    mobileNavbarOpened: boolean;
    showDesktopNavbar: boolean;
}

export const initialNavbarState: NavbarState = {
    mobileNavbarOpened: false,
    showDesktopNavbar: false,
};

export const createNavbarSlice: AppStateSlice<NavbarState> = () =>
    initialNavbarState;
