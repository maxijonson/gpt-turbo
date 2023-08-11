import type { Doc } from ".contentlayer/generated";
import { PartialDoc } from "./types";

const sortDocs = <T extends Doc | PartialDoc>(docs: T[]) => {
    return docs.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        if (a.order !== undefined) {
            return -1;
        }
        if (b.order !== undefined) {
            return 1;
        }
        return 0;
    });
};

export default sortDocs;
