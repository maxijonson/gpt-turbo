import { ReactNode } from "react";
import v4_4_0 from "./v4-4-0";
import v4_4_1 from "./v4-4-1";

export type ChangelogEntrySection = {
    label: ReactNode;
    items: ReactNode[];
    description?: ReactNode;
};

export type ChangelogEntry = {
    version: string;
    date: Date;
    sections: ChangelogEntrySection[];
    description?: ReactNode;
};

// First entry is the latest version
export const changelog = [v4_4_1, v4_4_0];
