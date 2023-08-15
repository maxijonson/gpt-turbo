// Thanks to taxonomy: https://github.com/shadcn-ui/taxonomy/blob/main/contentlayer.config.js
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

export const Doc = defineDocumentType(() => {
    const getSlug = (doc: any) => {
        return doc._raw.flattenedPath.split("/").slice(1).join("/");
    };

    return {
        name: "Doc",
        filePathPattern: `docs/**/*.mdx`,
        contentType: "mdx",
        fields: {
            title: {
                type: "string",
                required: true,
            },
            description: {
                type: "string",
                required: false,
            },
            order: {
                type: "number",
                required: false,
            },
            api: {
                type: "string",
                required: false,
            },
        },
        computedFields: {
            slug: {
                type: "string",
                resolve: getSlug,
            },
            slugGroup: {
                type: "string",
                resolve: (doc) => doc._raw.flattenedPath.split("/")[1],
            },
            slugPage: {
                type: "string",
                resolve: (doc) => {
                    const slugSplits = doc._raw.flattenedPath
                        .split("/")
                        .slice(1);
                    return slugSplits[slugSplits.length - 1];
                },
            },
            isGroupIndex: {
                type: "boolean",
                resolve: (doc) => getSlug(doc).split("/").length === 1,
            },
        },
    };
});

export default makeSource({
    contentDirPath: "./src/mdx",
    documentTypes: [Doc],
    mdx: {
        remarkPlugins: [],
        rehypePlugins: [
            rehypeSlug,
            [
                rehypeAutolinkHeadings,
                {
                    properties: {
                        className: ["subheading-anchor"],
                        ariaLabel: "Link to section",
                    },
                    behavior: "wrap",
                },
            ],
        ],
    },
});
