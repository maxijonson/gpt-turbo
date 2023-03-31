import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "./contexts/providers";
import App from "./components/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Providers>
            <App />
        </Providers>
    </React.StrictMode>
);
