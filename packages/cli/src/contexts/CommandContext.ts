import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented.js";

export type Command = "prev" | "next";

export type CommandHandler = (command: Command) => void;

export interface CommandContextValue {
    onCommand: (handler: CommandHandler) => () => void;
    offCommand: (handler: CommandHandler) => void;
}

const notImplemented = makeNotImplemented("CommandContext");
export const CommandContext = React.createContext<CommandContextValue>({
    onCommand: notImplemented,
    offCommand: notImplemented,
});
