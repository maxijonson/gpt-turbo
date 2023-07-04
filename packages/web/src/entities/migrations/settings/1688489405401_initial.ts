export const migrateSettingsInitial = (
    value: Record<string, any>
): Record<string, any> => {
    if (value.version) return value;
    value.version = "4.2.1";
    return value;
};
