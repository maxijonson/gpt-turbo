import { ChangelogEntry } from ".";
import { CHANGELOG_SECTION } from "../config/constants";

const v4_5_0: ChangelogEntry = {
    version: "4.5.0 - Conversation Edit, Duplicate and Export",
    date: new Date("july 16 2023"),
    sections: [
        {
            label: CHANGELOG_SECTION.FEATURES,
            items: [
                "Added the ability to change conversation settings",
                "Added the ability to duplicate conversations",
                "Added the ability to import/export conversations",
            ],
        },
    ],
};

export default v4_5_0;
