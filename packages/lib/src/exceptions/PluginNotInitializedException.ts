/**
 * Thrown when a plugin attempts to use a provided service before said service has been injected into the plugin (during `init`).
 * This usually happens when a plugin attempts to use a service in its constructor, since plugins are initialized after instantiation.
 *
 * @example
 * ```typescript
 * class TestPlugin extends ConversationPlugin {
 *     constructor() {
 *         super();
 *         this.conversation.history.setContext(...); // This throws a PluginNotInitializedException
 *     }
 *
 *     init(...) {
 *         this.conversation.history.setContext(...); // This works
 *     }
 * }
 * ```
 */
export class PluginNotInitializedException extends Error {
    constructor() {
        super(
            "Cannot use a service before it has been injected into the plugin."
        );
        this.name = PluginNotInitializedException.name;
    }
}
