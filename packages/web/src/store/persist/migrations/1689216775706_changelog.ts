import { produce } from "immer";
import { StoreMigration } from ".";

export const migrationChangelog: StoreMigration = produce((persistedState) => {
    persistedState.appSettings.lastChangelog = "";
});
