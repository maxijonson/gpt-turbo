import { ConversationMessage } from "gpt-turbo";
import React from "react";
import getMessageHeight from "../utils/getMessageHeight.js";

export default (
    messages: ConversationMessage[],
    maxWidth: number,
    maxHeight: number
) => {
    const [pageIndex, setPageIndex] = React.useState(0);

    const pages = React.useMemo(() => {
        if (!maxWidth || !maxHeight) {
            return [];
        }

        const pages: ConversationMessage[][] = [];
        let page: ConversationMessage[] = [];
        let pageHeight = 0;

        const addPage = () => {
            if (!page.length) return;
            pages.push(page);
            page = [];
            pageHeight = 0;
        };

        const msgs = messages.slice();
        for (let i = 0; i < messages.length; i++) {
            const message = msgs[i];
            const messageHeight = getMessageHeight(message.content, maxWidth);
            const isOverflowing = pageHeight + messageHeight > maxHeight;

            if (isOverflowing) {
                addPage();
            }

            page.push(message);
            pageHeight += messageHeight;
        }

        addPage();

        return pages;
    }, [messages, maxHeight, maxWidth]);

    const handleSetPageIndex = React.useCallback(
        (nextIndex: Parameters<typeof setPageIndex>[0] = pages.length - 1) => {
            if (typeof nextIndex === "number") {
                setPageIndex(
                    Math.max(0, Math.min(nextIndex, pages.length - 1))
                );
            } else {
                setPageIndex((current) =>
                    Math.max(0, Math.min(nextIndex(current), pages.length - 1))
                );
            }
        },
        [pages.length]
    );

    React.useEffect(() => {
        if (pageIndex > pages.length - 1) {
            handleSetPageIndex(pages.length - 1);
        }
    }, [handleSetPageIndex, pageIndex, pages.length]);

    return {
        pages,
        pageIndex,
        setPageIndex: handleSetPageIndex,
    };
};
