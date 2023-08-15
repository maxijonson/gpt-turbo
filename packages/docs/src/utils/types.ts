import type { Doc } from ".contentlayer/generated";

/**
 * Lighter version of Doc type so it can be used in the client without having to import all of the content
 */
export interface PartialDoc
    extends Pick<
        Doc,
        | "title"
        | "description"
        | "order"
        | "slug"
        | "slugGroup"
        | "slugPage"
        | "isGroupIndex"
    > {
    body?: never;
    _raw?: never;
}

export type DocOrPartialDoc<P extends boolean> = P extends true
    ? PartialDoc
    : Doc;

export interface GroupedDocs<P extends boolean> {
    [group: string]: {
        [page: string]: DocOrPartialDoc<P>;
    };
}
