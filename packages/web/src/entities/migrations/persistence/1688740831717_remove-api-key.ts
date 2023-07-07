export const migratePersistenceRemoveApiKey = (
    value: Record<string, any>
): Record<string, any> => {
    if (!value.conversations || !Array.isArray(value.conversations))
        return value;

    value.conversations = value.conversations.map((conversation) => {
        if (conversation.config?.apiKey === undefined) return conversation;
        const { apiKey, ...config } = conversation.config;

        return {
            ...conversation,
            config,
        };
    });

    return value;
};
