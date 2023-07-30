export default (name: string) => {
    return (..._args: any[]) => {
        throw new Error(`${name} is not implemented yet`);
    };
};
