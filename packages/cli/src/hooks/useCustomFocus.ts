import { useFocus } from "ink";
import React from "react";
import { v4 as uuid } from "uuid";
import useAppFocus from "./useAppFocus.js";

type UseCustomFocusOptions = {
    isActive?: boolean;
    autoFocus?: boolean;
    id?: string;
};

export default (options: UseCustomFocusOptions = {}) => {
    const { setActiveId } = useAppFocus();
    const [id] = React.useState(() => options.id || uuid());
    const { isFocused, focus } = useFocus({
        ...options,
        id,
    });

    React.useEffect(() => {
        if (isFocused) {
            setActiveId(id);
        }
    }, [id, isFocused, setActiveId]);

    return {
        isFocused,
        focus,
    };
};
