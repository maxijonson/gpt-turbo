/**
 * Given a `maxWidth`, this function will return the number of lines expected to be rendered for a given `message`.
 * This count is made on the following assumptions on how Ink renders multiline text:
 * - Newlines carriage returns are counted as adding to the height (as expected).
 * - Words that would normally overflow the `maxWidth` will be wrapped to the next line. This means that not every line will be `maxWidth` characters long.
 *
 * @param message The message to measure.
 * @param maxWidth The maximum width alloted for rendering the message. (typically the width of the `Box` the message is rendered in)
 * @returns The number of lines expected to be rendered for the given `message`.
 */
export default (message: string, maxWidth: number) => {
    const lines = message.split(/\r?\n|\r/);
    let messageHeight = 0;

    for (let i = 0; i < lines.length; i++) {
        const words = lines[i].split(" ");
        let lineLength = 0;

        for (let j = 0; j < words.length; j++) {
            const wordLength = words[j].length;

            if (lineLength + wordLength > maxWidth) {
                messageHeight++;
                lineLength = wordLength + 1;
            } else {
                lineLength += wordLength + 1;
            }
        }

        if (lineLength > 0) {
            messageHeight++;
        }
    }

    return messageHeight;
};
