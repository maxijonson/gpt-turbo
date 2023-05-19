import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "./contexts/providers";
import App from "./components/App";
import AppCatcher from "./components/AppCatcher";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AppCatcher>
            <Providers>
                <App />
            </Providers>
        </AppCatcher>
    </React.StrictMode>
);
