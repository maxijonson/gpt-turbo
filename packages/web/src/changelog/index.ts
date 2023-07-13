import { ReactNode } from "react";
import v4_4_0 from "./v4-4-0";

export type ChangelogEntrySection = {
    label: ReactNode;
    items: ReactNode[];
};

export type ChangelogEntry = {
    version: string;
    date: Date;
    sections: ChangelogEntrySection[];
};

// First entry is the latest version
export const changelog = [v4_4_0];
