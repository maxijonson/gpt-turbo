import { Doc, allDocs } from ".contentlayer/generated";
import type { DocOrPartialDoc, GroupedDocs, PartialDoc } from "@utils/types";
import sortDocs from "@utils/sortDocs";

export const getPartialDoc = (doc: Doc): PartialDoc => ({
    title: doc.title,
    description: doc.description,
    order: doc.order,
    slug: doc.slug,
    slugGroup: doc.slugGroup,
    slugPage: doc.slugPage,
    isGroupIndex: doc.isGroupIndex,
});

export const getPartialDocs = (docs: Doc[] = allDocs) => {
    return docs.map(getPartialDoc);
};

export const getDocBySlug = <P extends boolean = true>(
    slugParts: string[],
    partial: P = true as P
): DocOrPartialDoc<P> | null => {
    const slug = slugParts.join("/");
    const doc = allDocs.find((doc) => doc.slug === slug) ?? null;
    if (!doc) return null;
    if (partial) return getPartialDoc(doc) as DocOrPartialDoc<P>;
    return doc as DocOrPartialDoc<P>;
};

export const getGroupedDocs = <P extends boolean = true>(
    partial: P = true as P
) => {
    return allDocs.reduce((acc, doc) => {
        if (doc.isGroupIndex) return acc;

        const [group, page] = doc.slug.split("/");
        if (!acc[group]) {
            acc[group] = {};
        }

        if (partial) {
            (acc as GroupedDocs<true>)[group][page] = getPartialDoc(doc);
        } else {
            (acc as GroupedDocs<false>)[group][page] = doc;
        }

        return acc;
    }, {} as GroupedDocs<P>);
};

export const getGroupIndexes = <P extends boolean = true>(
    partial: P = true as P
) => {
    const groupedDocs = getGroupedDocs(partial);
    const groupIndexes = Object.keys(groupedDocs).reduce((acc, group) => {
        const doc = getDocBySlug([group], partial);
        if (doc) {
            acc.push(doc);
        }
        return acc;
    }, [] as DocOrPartialDoc<P>[]);
    return sortDocs(groupIndexes);
};

export const getGroupDocs = <P extends boolean = true>(
    group: string,
    partial: P = true as P
) => {
    const groupedDocs = getGroupedDocs(partial);
    const groupDocs = groupedDocs[group];
    if (!groupDocs) return [];
    return sortDocs(Object.values(groupDocs));
};
