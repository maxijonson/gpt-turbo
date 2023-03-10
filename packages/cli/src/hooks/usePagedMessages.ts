import { ConversationMessage } from "gpt-turbo";
import React from "react";

export default (
    messages: ConversationMessage[],
    messagesBoxWidth: number,
    messagesBoxHeight: number
) => {
    const [pageIndex, setPageIndex] = React.useState(0);

    const pages = React.useMemo(() => {
        if (!messagesBoxWidth || !messagesBoxHeight) {
            return [];
        }

        const pages: ConversationMessage[][] = [];
        let page: ConversationMessage[] = [];
        let pageHeight = 0;

        const msgs = messages.slice();
        for (let i = 0; i < messages.length; i++) {
            const message = msgs[i];
            const messageWidth = message.content.length;
            const messageHeight = Math.ceil(messageWidth / messagesBoxWidth);
            const isOverflowing =
                pageHeight + messageHeight > messagesBoxHeight;

            if (isOverflowing && page.length) {
                pages.push(page);
                page = [];
                pageHeight = 0;
            }

            page.push(message);
            pageHeight += messageHeight;
        }

        if (page.length) {
            pages.push(page);
        }

        return pages;
    }, [messages, messagesBoxHeight, messagesBoxWidth]);

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