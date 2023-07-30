import { ChangelogEntry } from ".";
import { CHANGELOG_SECTION } from "../config/constants";

const v4_5_0: ChangelogEntry = {
    version: "4.5.0 - Conversation Edit, Duplicate and Export",
    date: new Date("july 18 2023"),
    sections: [
        {
            label: CHANGELOG_SECTION.FEATURES,
            items: [
                "Added the ability to change conversation settings",
                "Added the ability to duplicate conversations",
                "Added the ability to import/export conversations",
                "Added the ability to generate a conversation name using the assistant.",
            ],
        },
        {
            label: CHANGELOG_SECTION.IMPROVEMENTS,
            items: [
                "Moved the advanced conversation settings to their own tab",
                "Default settings are now saved in the conversation form",
            ],
        },
        {
            label: CHANGELOG_SECTION.REMOVALS,
            items: [
                "Removed the default conversation settings from the settings popup. This is now done directly in the conversation form.",
            ],
        },
    ],
};

export default v4_5_0;
