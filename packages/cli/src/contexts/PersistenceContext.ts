import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented.js";

export interface PersistenceContextValue {
    setSaveFile: (saveFile: string) => void;
    setLoadFile: (loadFile: string) => void;
}

const notImplemented = makeNotImplemented("PersistenceContext");
export const PersistenceContext = React.createContext<PersistenceContextValue>({
    setSaveFile: notImplemented,
    setLoadFile: notImplemented,
});
