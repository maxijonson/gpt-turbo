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
