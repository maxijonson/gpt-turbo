import { Message } from "gpt-turbo";
import React from "react";
import getMessageHeight from "../utils/getMessageHeight.js";
import splitMessage from "../utils/splitMessage.js";
import useConfig from "./useConfig.js";

export default (messages: Message[], maxWidth: number, maxHeight: number) => {
    const { model } = useConfig();

    const [pageIndex, setPageIndex] = React.useState(0);

    const pages = React.useMemo(() => {
        if (!maxWidth || !maxHeight) {
            return [];
        }

        const pages: Message[][] = [];
        let page: Message[] = [];
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
            const messageContent = (() => {
                if (message.isCompletion()) {
                    return message.content;
                }
                if (message.isFunction()) {
                    return `${message.name}() => ${message.content}`;
                }
                if (message.isFunctionCall()) {
                    const { name, arguments: args } = message.functionCall;
                    const parameters = Object.entries(args)
                        .map(([param, value]) => `${param}=${value}`)
                        .join(", ");
                    return `${name}(${parameters})`;
                }
                return "[Unknown message type]";
            })();
            const messageHeight = getMessageHeight(messageContent, maxWidth);
            const isHuge = messageHeight > maxHeight;
            const isOverflowing = pageHeight + messageHeight > maxHeight;

            // FIXME: Not yet perfect. May overflow temporarily until the window is resized or a message is added.
            if (isHuge) {
                const remainingHeight = maxHeight - pageHeight;
                const [firstMessageContent, secondMessageContent] =
                    splitMessage(messageContent, maxWidth, remainingHeight);

                if (firstMessageContent.length && secondMessageContent.length) {
                    msgs[i] = new Message(
                        message.role,
                        firstMessageContent,
                        model
                    );

                    msgs.splice(
                        i + 1,
                        0,
                        new Message(message.role, secondMessageContent, model)
                    );

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
    }, [maxWidth, maxHeight, messages, model]);

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
