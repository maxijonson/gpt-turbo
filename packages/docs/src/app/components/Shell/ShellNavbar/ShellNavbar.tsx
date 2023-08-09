import { AppShell } from "@mantine/core";
import * as classes from "./ShellNavbar.css";

export const SHELLNAVBAR_WIDTH = 260;

const ShellNavbar = () => {
    return <AppShell.Navbar className={classes.root}>Navbar</AppShell.Navbar>;
};

export default ShellNavbar;
