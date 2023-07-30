export default (
    str: string,
    otherStrs: string[],
    transform: (str: string, i: number) => string
) => {
    let i = 1;
    let uniqueStr = str;
    while (otherStrs.some((name) => name === uniqueStr)) {
        uniqueStr = transform(str, i++);
    }
    return uniqueStr;
};
