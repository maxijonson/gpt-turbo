import React from "react";
import * as gptTurbo from "gpt-turbo";

const WindowUtils = () => {
    React.useEffect(() => {
        (window as any).gpt = gptTurbo;
    }, []);

    return null;
};

export default WindowUtils;
