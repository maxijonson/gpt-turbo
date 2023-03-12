import { ConversationMessage } from "gpt-turbo";
import React from "react";
import getMessageHeight from "../utils/getMessageHeight.js";
import splitMessage from "../utils/splitMessage.js";

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

        // TODO: getMessageHeight is pretty expensive and when a message is huge, it can get even more expensive. Maybe find some ways to optimize this or memoize some message heights.
        const msgs = messages.slice();
        for (let i = 0; i < msgs.length; i++) {
            const message = msgs[i];
            const messageHeight = getMessageHeight(message.content, maxWidth);
            const isHuge = messageHeight > maxHeight;
            const isOverflowing = pageHeight + messageHeight > maxHeight;

            // FIXME: Not yet perfect. May overflow temporarily until the window is resized or a message is added.
            if (isHuge) {
                const remainingHeight = maxHeight - pageHeight;
                const [firstMessageContent, secondMessageContent] =
                    splitMessage(message.content, maxWidth, remainingHeight);

                if (firstMessageContent.length && secondMessageContent.length) {
                    msgs[i] = {
                        ...message,
                        content: firstMessageContent,
                    };

                    msgs.splice(i + 1, 0, {
                        ...message,
                        id: message.id + "-",
                        content: secondMessageContent,
                    });

                    i--;
                    continue;
                }
            }

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
