import { AppShell } from "@mantine/core";
import * as classes from "./AppNavbar.css";

export const APPNAVBAR_WIDTH = 260;

const AppNavbar = () => {
    return (
        <AppShell.Navbar withBorder={false} className={classes.root}>
            Navbar
        </AppShell.Navbar>
    );
};

export default AppNavbar;
