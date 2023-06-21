import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "./contexts/providers";
import App from "./components/App";
import AppCatcher from "./components/AppCatcher";
import WindowUtils from "./components/WindowUtils";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AppCatcher>
            <Providers>
                <WindowUtils />
                <App />
            </Providers>
        </AppCatcher>
    </React.StrictMode>
);
