import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export default async <T>(
    resourcesPath: string,
    attributeChecks: (keyof T)[] = []
) => {
    const resources: T[] = [];

    const resourceFiles = fs
        .readdirSync(resourcesPath)
        .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const resourceFile of resourceFiles) {
        const resourcePath = path.join(resourcesPath, resourceFile);
        const resource = (
            await import(
                pathToFileURL(path.join(resourcesPath, resourceFile)).toString()
            )
        ).default as T;

        if (!resource) {
            throw new Error(
                `Resource "${resourceFile}" could not be loaded. (${resourcePath}))`
            );
        }
        for (const attributeCheck of attributeChecks) {
            if (!resource[attributeCheck]) {
                throw new Error(
                    `Resource "${resourceFile}" does not have a "${String(
                        attributeCheck
                    )}" attribute. (${resourcePath})`
                );
            }
        }

        resources.push(resource);
    }

    return resources;
};
