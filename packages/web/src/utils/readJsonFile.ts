import { ZodType } from "zod";

export default async <T = any>(file: File, schema?: ZodType<T>): Promise<T> => {
    const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (e) => {
            reject(e);
        };
        reader.readAsText(file);
    });

    const json = JSON.parse(content);
    return schema ? schema.parse(json) : json;
};
