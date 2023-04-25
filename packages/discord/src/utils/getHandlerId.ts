export default (handlerName: string) => {
    return handlerName
        .replace("Handler", "")
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase();
};
