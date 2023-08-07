// Thanks to taxonomy: https://github.com/shadcn-ui/taxonomy/blob/main/contentlayer.config.js
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

export const Doc = defineDocumentType(() => ({
    name: "Doc",
    filePathPattern: `docs/**/*.mdx`,
    contentType: "mdx",
    fields: {
        title: {
            type: "string",
            required: true,
        },
    },
    computedFields: {
        slug: {
            type: "string",
            resolve: (doc) =>
                doc._raw.flattenedPath.split("/").slice(1).join("/"),
        },
        slugGroup: {
            type: "string",
            resolve: (doc) => doc._raw.flattenedPath.split("/")[1],
        },
        slugSubGroup: {
            type: "string",
            resolve: (doc) => {
                const slugSplits = doc._raw.flattenedPath.split("/").slice(1);
                if (slugSplits.length < 3) return "";
                return slugSplits[2];
            },
        },
        slugPage: {
            type: "string",
            resolve: (doc) => {
                const slugSplits = doc._raw.flattenedPath.split("/").slice(1);
                return slugSplits[slugSplits.length - 1];
            },
        },
    },
}));

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
                },
            ],
        ],
    },
});
