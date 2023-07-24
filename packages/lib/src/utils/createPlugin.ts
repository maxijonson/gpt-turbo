import { ConversationPlugin } from "./types/index.js";

/**
 * Convenience utility to create a plugin with strict typing.
 *
 * This is the recommended way to create a type safe plugin, since it takes care of specifying generic exact type parameters of the `ConversationPlugin` interface.
 * For example, this will make your plugin appear in the intellisense of the `Conversation.getPlugin` method.
 *
 * @param plugin The plugin to create.
 * @returns A strictly typed plugin.
 */
export default <TName extends string, TOut = undefined>(
    plugin: ConversationPlugin<TName, TOut>
) => plugin;
