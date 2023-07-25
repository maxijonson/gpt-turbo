import { ChangelogEntry } from ".";
import { CHANGELOG_SECTION } from "../config/constants";

const v4_4_0: ChangelogEntry = {
    version: "4.4.0 - Zustand",
    date: new Date("july 12 2023"),
    sections: [
        {
            label: CHANGELOG_SECTION.FEATURES,
            items: [
                "Added the ability to remove all callable functions.",
                "Added the ability to remove all saved contexts.",
                "Added the ability to remove all saved prompts.",
                "Added the ability to reset default settings.",
                "Added the ability to reset function warnings.",
                "Added this changelog!",
            ],
        },
        {
            label: CHANGELOG_SECTION.IMPROVEMENTS,
            items: [
                "Revamped state management from React Context API to Zustand.",
                "With Zustand comes a new persistence system, which will (hopefully) help with invalid saved data in the future, thanks to migrations.",
            ],
        },
        {
            label: CHANGELOG_SECTION.FIXES,
            items: [
                "Fixed an issue preventing from having more than 1 callable function in a conversation.",
            ],
        },
        {
            label: CHANGELOG_SECTION.REMOVALS,
            items: [
                "Removed the API key from saved conversations. It will be taken from your default settings instead.",
            ],
        },
    ],
};

export default v4_4_0;
