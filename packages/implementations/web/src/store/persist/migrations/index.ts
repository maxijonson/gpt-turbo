import { AppPersistedState } from "../..";
import { parsePersistedState } from "../parsePersistedState";
import { migrationChangelog } from "./1689216775706_changelog";
import { migrationConversationExport } from "./1689537326770_conversation-export";

export type StoreMigration = (persistedState: any) => any | Promise<any>;

export const storeMigrations: StoreMigration[] = [
    migrationChangelog,
    migrationConversationExport,
];

export const storeVersion = storeMigrations.length;

export class StoreMigrationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "StoreMigrationError";
    }
}

export const migrateStore = async (
    persistedState: AppPersistedState,
    version: number
) => {
    try {
        const migrations = storeMigrations.slice(version);
        let migratedState: any = persistedState;

        for (const migration of migrations) {
            migratedState = await migration(migratedState);
        }

        const parsedState = parsePersistedState(migratedState);
        return parsedState;
    } catch (e) {
        console.error(e);
        const error = new StoreMigrationError((e as Error).message);
        error.stack = (e as Error).stack;
        throw error;
    }
};
