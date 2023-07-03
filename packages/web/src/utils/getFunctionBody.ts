// eslint-disable-next-line @typescript-eslint/ban-types
export default (fn: Function) => {
    const fnString = fn.toString();
    const start = fnString.indexOf("{") + 1;
    const end = fnString.lastIndexOf("}");

    const body = fnString.substring(start, end).trim();

    return (
        body
            .split("\n")
            // First line is fine, but the rest are indented by 8 spaces
            .map((line, i) => (i === 0 ? line : line.substring(8)))
            .join("\n")
    );
};
