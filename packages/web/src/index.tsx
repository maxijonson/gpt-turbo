import React from "react";
import ReactDOM from "react-dom/client";
import { Conversation } from "gpt-turbo";

console.info(Conversation);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <h1>Hello GPT-Turbo</h1>
    </React.StrictMode>
);
