import { AppStateSlice } from "..";

export interface NavbarState {
    mobileNavbarOpened: boolean;
}

export const initialNavbarState: NavbarState = {
    mobileNavbarOpened: false,
};

export const createNavbarSlice: AppStateSlice<NavbarState> = () =>
    initialNavbarState;
