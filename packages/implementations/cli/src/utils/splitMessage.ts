import getMessageHeight from "./getMessageHeight.js";

/**
 * Splits a message into two parts if it is too long to fit in the given width and height.
 * The height of a message part is calculated using the [`getMessageHeight`](./getMessageHeight.ts) function.
 * An ellipsis (…) is added to the end of the first part if it is split.
 *
 * @param message The message to split.
 * @param maxWidth The maximum width alloted for rendering the message. (typically the width of the `Box` the message is rendered in)
 * @param maxHeight The maximum height alloted for rendering the message. (typically the remaining height of the `Box` the message is rendered in)
 * @returns An array containing the first and second parts of the message. If the message does not need to be split, the second part will be an empty string.
 */
export default (
    message: string,
    maxWidth: number,
    maxHeight: number
): [string, string] => {
    const words = message.split(" ");
    let firstSplit = "";

    for (let j = 0; j < words.length; j++) {
        const word = words[j];
        const nextHeight = getMessageHeight(
            `${firstSplit} ${word}…`.trim(),
            maxWidth
        );

        if (nextHeight > maxHeight) {
            break;
        }

        firstSplit += ` ${word}`;
    }

    firstSplit = firstSplit.trim();
    let secondSplit = message.slice(firstSplit.length).trim();

    if (secondSplit.length) {
        secondSplit = "…" + secondSplit;
        if (firstSplit.length) {
            firstSplit += "…";
        }
    }

    return [firstSplit, secondSplit];
};
