import { Doc, allDocs } from ".contentlayer/generated";

export interface GroupedDocs {
    [group: string]: {
        [page: string]: Doc;
    };
}

export const getDocBySlug = (...slugParts: string[]) => {
    const slug = slugParts.join("/");
    return allDocs.find((doc) => doc.slug === slug) ?? null;
};

export const getGroupedDocs = () => {
    return allDocs.reduce((acc, doc) => {
        if (doc.isGroupIndex) return acc;

        const [group, page] = doc.slug.split("/");
        if (!acc[group]) {
            acc[group] = {};
        }
        acc[group][page] = doc;
        return acc;
    }, {} as GroupedDocs);
};

export const sortDocs = (docs: Doc[]) => {
    return docs.sort((a, b) => {
        if (a.order && b.order) {
            return a.order - b.order;
        }
        if (a.order) {
            return -1;
        }
        if (b.order) {
            return 1;
        }
        return 0;
    });
};

export const getGroupIndexes = () => {
    const groupIndexes = Object.keys(getGroupedDocs()).reduce((acc, group) => {
        const doc = getDocBySlug(group);
        if (doc) {
            acc.push(doc);
        }
        return acc;
    }, [] as Doc[]);
    return sortDocs(groupIndexes);
};

export const getGroupDocs = (group: string) => {
    const groupedDocs = getGroupedDocs();
    const groupDocs = groupedDocs[group];
    if (!groupDocs) return [];
    return sortDocs(Object.values(groupDocs));
};
