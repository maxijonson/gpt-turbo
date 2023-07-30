import { ChangelogEntry } from ".";
import { CHANGELOG_SECTION } from "../config/constants";

const v4_4_1: ChangelogEntry = {
    version: "4.4.1 - Performance Update",
    date: new Date("july 15 2023"),
    description:
        "Although performance was not an issue before, I saw many easy opportunities to improve it. This update contains many small improvements that should make the app feel more responsive and less resource intensive.",
    sections: [
        {
            label: CHANGELOG_SECTION.IMPROVEMENTS,
            items: [
                "Further improved state management",
                "Significantly reduced bundle size by separating dependencies from the main bundle into separate chunks. They will only be loaded when needed.",
                "Updated all project dependencies",
            ],
        },
    ],
};

export default v4_4_1;
