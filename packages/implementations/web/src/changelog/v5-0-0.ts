import { ChangelogEntry } from ".";
import { CHANGELOG_SECTION } from "../config/constants";

const v5_0_0: ChangelogEntry = {
    version: "5.0.0 - Library rewrite and plugin system",
    date: new Date("july 28 2023"),
    description:
        "This new update is primarily focused on the library side of the project, so there shouldn't be any major noticeable changes here. However, under the hood, the library has been completely rewritten to be more modular and extensible with plugins. The first plugin to exist is actually the usage stats feature, which has been moved out from the underlying library and into a conversation plugin!",
    sections: [
        {
            label: CHANGELOG_SECTION.IMPROVEMENTS,
            items: [
                "Integrated the stats plugin",
                "Stats are now updated in real time",
                "Improve the crash screen to show the error message and stack trace",
                "Improve the crash screen to pre-fill the bug report on GitHub",
            ],
        },
        {
            label: CHANGELOG_SECTION.FIXES,
            items: ["Fixed the usage stats not updating correctly sometimes"],
        },
    ],
};

export default v5_0_0;
