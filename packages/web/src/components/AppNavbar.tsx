import { Navbar } from "@mantine/core";

export const NAVBAR_WIDTH = 300;

export default () => {
    return (
        <Navbar width={{ base: NAVBAR_WIDTH }} p="xs">
            Navbar
        </Navbar>
    );
};
