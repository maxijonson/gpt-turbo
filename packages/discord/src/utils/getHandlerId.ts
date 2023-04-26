/**
 * Used for generating a (interaction) handler ID from a handler (class) name.
 */
export default (handlerName: string) => {
    return handlerName
        .replace("Handler", "")
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase();
};
