export const blockTicks = "```";

const MAX_URL_LENGTH = 2 ** 13 - 1;

export default (
    title: string,
    content: string | { [header: string]: string | number | boolean }
) => {
    const link = "https://github.com/maxijonson/gpt-turbo/issues/new";

    const body = (() => {
        if (typeof content === "string") return content;
        return Object.entries(content)
            .map(([header, value]) => `## ${header}\n${value}`)
            .join("\n");
    })();

    const params = new URLSearchParams({
        title,
        body,
    });

    return `${link}?${params.toString()}`.slice(0, MAX_URL_LENGTH);
};
