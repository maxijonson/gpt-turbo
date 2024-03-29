import { ReactNode } from "react";
import v4_4_0 from "./v4-4-0";
import v4_4_1 from "./v4-4-1";
import v4_5_0 from "./v4-5-0";
import v5_0_0 from "./v5-0-0";

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
export const changelog = [v5_0_0, v4_5_0, v4_4_1, v4_4_0];
