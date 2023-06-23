import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "./contexts/providers";
import AppCatcher from "./components/AppCatcher";
import AppRouter from "./routers/AppRouter";
import { Container, Sx } from "@mantine/core";

const containerStyle: Sx = {
    flexDirection: "column",
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AppCatcher>
            <Providers>
                <Container
                    fluid
                    p={0}
                    m={0}
                    mih="100vh"
                    maw="100vw"
                    display="flex"
                    sx={containerStyle}
                >
                    <AppRouter />
                </Container>
            </Providers>
        </AppCatcher>
    </React.StrictMode>
);
