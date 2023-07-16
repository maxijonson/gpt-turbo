import { ChangelogEntry } from ".";
import { CHANGELOG_SECTION } from "../config/constants";

const v4_4_1: ChangelogEntry = {
    version: "4.4.1 - Performance Update",
    date: new Date("july 15 2023"),
    sections: [
        {
            label: CHANGELOG_SECTION.IMPROVEMENTS,
            items: [
                "Further improved state management",
                "Reduced initial bundle size",
                "Updated all project dependencies",
            ],
        },
    ],
};

export default v4_4_1;
