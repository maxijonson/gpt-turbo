import { AppPersistedState } from "../..";
import { parsePersistedState } from "../parsePersistedState";

export type StoreMigration = (persistedState: any) => any | Promise<any>;

export const storeMigrations: StoreMigration[] = [];

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

        const parsedState = await parsePersistedState(migratedState);
        return parsedState;
    } catch (e) {
        console.error(e);
        const error = new StoreMigrationError((e as Error).message);
        error.stack = (e as Error).stack;
        throw error;
    }
};
