export const migratePersistenceInitial = (
    value: Record<string, any>
): Record<string, any> => {
    // Applies the initial migration to add the version key
    return value;
};
