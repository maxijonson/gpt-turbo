import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const MDX_DOCS = path.join(ROOT, "src/mdx/docs");

interface DocsPage {
    slug: string;
    path: string;
    import: () => Promise<any>;
}

interface DocsPageGroup {
    slugGroup: string;
    pages: Record<string, DocsPage>;
}

export const getDocsPage = async (
    slugGroup: string,
    slug: string
): Promise<DocsPage | null> => {
    try {
        const filePath = path.join(MDX_DOCS, slugGroup, slug + ".mdx");
        const fileStat = await fs.stat(filePath);

        if (!fileStat.isFile()) return null;

        return {
            slug,
            path: filePath,
            // Not using filePath because it wouldn't work. ES modules need to have an idea of what the path is at build time.
            import: () => import(`./${slugGroup}/${slug}.mdx`),
        };
    } catch {
        return null;
    }
};

export const getDocsPageGroup = async (
    slugGroup: string
): Promise<DocsPageGroup | null> => {
    try {
        const folderPath = path.join(MDX_DOCS, slugGroup);
        const folderStat = await fs.stat(folderPath);

        if (!folderStat.isDirectory()) return null;

        const files = await fs.readdir(folderPath);
        const pages: DocsPageGroup["pages"] = {};

        for (const file of files) {
            const page = await getDocsPage(
                slugGroup,
                file.replace(/\.mdx$/, "")
            );
            if (!page) continue;
            pages[page.slug] = page;
        }

        return {
            slugGroup,
            pages,
        };
    } catch {
        return null;
    }
};

export const getDocsPages = async () => {
    const docsDir = await fs.readdir(MDX_DOCS);
    const pageGroups: Record<string, DocsPageGroup> = {};

    for (const folder of docsDir) {
        const pageGroup = await getDocsPageGroup(folder);
        if (!pageGroup) continue;
        pageGroups[pageGroup.slugGroup] = pageGroup;
    }

    return pageGroups;
};
