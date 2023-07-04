import { migrateSettingsInitial } from "./1688489405401_initial";

const migrations: ((value: Record<string, any>) => Record<string, any>)[] = [
    migrateSettingsInitial,
];

export const migrateSettings = (value: Record<string, any>) =>
    migrations.reduce((acc, migration) => migration(acc), value);
