import Keyv from "keyv";
import {
    DEFAULT_QUOTA,
    MONGO_CONNECTION_STRING,
    MYSQL_CONNECTION_STRING,
    POSTGRES_CONNECTION_STRING,
    POSTGRES_SCHEMA,
} from "../config/env.js";
import { Conversation } from "gpt-turbo";
import { ConversationUser } from "../utils/types.js";
import isValidSnowflake from "../utils/isValidSnowflake.js";
import BotException from "../exceptions/BotException.js";
import GPTTurboClient from "../GPTTurboClient.js";
import { Role } from "discord.js";
import { statsPluginName } from "gpt-turbo-plugin-stats";

export type DbType = "mongodb" | "mysql" | "postgres";
export default class QuotaManager<
    QuotaEnabled = false,
    TDbType = QuotaEnabled extends true ? DbType : null,
    TQuotas = QuotaEnabled extends true ? Keyv<number> : null,
    TUsages = QuotaEnabled extends true ? Keyv<number> : null
> {
    public static readonly DEFAULT_QUOTA_KEY =
        "__default__gptturbodiscord__quota__";

    private dbType: TDbType = null as TDbType;
    private userQuotas: TQuotas = null as TQuotas;
    private roleQuotas: TQuotas = null as TQuotas;
    private usages: TUsages = null as TUsages;

    /** ID of each role that appear in the roleQuotas database */
    private quotedRoleIds: Set<string> = new Set();
    /** ID of each guild that contain a quoted role from the quotedRoleIds */
    private quotedGuildIds: Set<string> = new Set();

    constructor(private client: GPTTurboClient) {
        this.userQuotas = this.getDb("gpt-turbo-discord-userquotas") as TQuotas;
        this.roleQuotas = this.getDb("gpt-turbo-discord-rolequotas") as TQuotas;
        this.usages = this.getDb("gpt-turbo-discord-usages") as TUsages;

        console.info(
            this.dbType
                ? `Quotas/Usages enabled. Using ${this.dbType}`
                : "Quotas/Usages disabled."
        );
    }

    public async init() {
        if (!this.isEnabled()) return;
        await this.userQuotas.set(
            QuotaManager.DEFAULT_QUOTA_KEY,
            DEFAULT_QUOTA
        );
    }

    public async postInit() {
        await this.refreshQuotedIds();
    }

    public isEnabled(): this is QuotaManager<true> {
        return (
            this.userQuotas !== null &&
            this.roleQuotas !== null &&
            this.usages !== null
        );
    }

    public async getDefaultQuota(): Promise<number> {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        const quota = await this.userQuotas.get(QuotaManager.DEFAULT_QUOTA_KEY);
        if (quota === undefined) throw new Error("No default quota found");
        return quota;
    }

    /**
     * Gets the quota assigned to a specific user in the database, if it exists, or null if it doesn't.
     * **Important:** This does not take into account the user's role quotas. Use `getQuota` instead if you want to get the actual computed quota for a user.
     */
    public async getUserQuota(userId: string): Promise<number | null> {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        const id = this.parseSnowflake(userId);
        return (await this.userQuotas.get(id)) ?? null;
    }

    public async hasUserQuota(userId: string): Promise<boolean> {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        const id = this.parseSnowflake(userId);
        return this.userQuotas.has(id);
    }

    public async setUserQuota(userId: string, quota: number) {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        if (quota < 0) throw new BotException("Quota must be positive");
        const id = this.parseSnowflake(userId);
        await this.userQuotas.set(id, quota);
    }

    public async deleteUserQuota(userId: string) {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        const id = this.parseSnowflake(userId);
        await this.userQuotas.delete(id);
    }

    /**
     * Gets the quota assigned to a role.
     */
    public async getRoleQuota(roleId: string): Promise<number | null> {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        const id = this.parseSnowflake(roleId);
        return (await this.roleQuotas.get(id)) ?? null;
    }

    public async hasRoleQuota(roleId: string): Promise<boolean> {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        const id = this.parseSnowflake(roleId);
        return this.roleQuotas.has(id);
    }

    /**
     * If the user's quota is defined by a role quota, this method returns that role and the quota assigned to it.
     */
    public async getUserQuotaRole(
        userId: string
    ): Promise<[Role | null, number]> {
        let highestRole: Role | null = null;
        let highestQuota = -1;

        const userQuota = await this.getUserQuota(userId);
        if (userQuota !== null) return [highestRole, userQuota];

        // find all guilds in quotedGuildIds that the user is in
        const quotedGuilds = this.client.guilds.cache.filter((guild) =>
            this.quotedGuildIds.has(guild.id)
        );
        const userGuilds = quotedGuilds.filter((guild) =>
            guild.members.cache.has(userId)
        );

        // find all roles in quotedRoleIds that the user has
        const quotedRoles = userGuilds.flatMap((guild) =>
            guild.roles.cache.filter((role) => this.quotedRoleIds.has(role.id))
        );
        const userRoles = quotedRoles.filter((role) =>
            role.members.has(userId)
        );

        for (const role of userRoles.values()) {
            const quota = await this.getRoleQuota(role.id);
            if (quota !== null && quota > highestQuota) {
                highestRole = role;
                highestQuota = quota;
            }
        }

        return [highestRole, highestQuota];
    }

    public async setRoleQuota(roleId: string, quota: number) {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        if (quota < 0) throw new BotException("Quota must be positive");
        const id = this.parseSnowflake(roleId);
        await this.roleQuotas.set(id, quota);
        await this.refreshQuotedIds();
    }

    public async deleteRoleQuota(roleId: string) {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        const id = this.parseSnowflake(roleId);
        await this.roleQuotas.delete(id);
        await this.refreshQuotedIds();
    }

    /**
     * This combines `getUserQuota` and `getRoleQuota` to determine the actual quota for a user.
     * - User quotas take priority over role quotas
     * - The highest role quota is used, if any
     * - If no quota is found, the default quota is used
     */
    public async getQuota(userId: string) {
        const userQuota = await this.getUserQuota(userId);
        if (userQuota !== null) return userQuota;

        const [role, roleQuota] = await this.getUserQuotaRole(userId);
        if (role !== null) return roleQuota;

        return this.getDefaultQuota();
    }

    public async getUsage(userId: string): Promise<number> {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        const id = this.parseSnowflake(userId);
        const usage = await this.usages.get(id);
        return usage ?? 0;
    }

    public async setUsage(userId: string, usage: number) {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        if (usage < 0) throw new BotException("Usage must be positive");
        const quota = await this.getQuota(userId);
        const id = this.parseSnowflake(userId);
        await this.usages.set(id, Math.min(usage, quota));
    }

    public async clearAllUsages() {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        await this.usages.clear();
    }

    public async isConversationAllowed(
        conversation: Conversation
    ): Promise<boolean> {
        if (!this.isEnabled()) return true;
        const { user } = conversation.config.getConfig();
        if (!user) throw new Error("No user found in conversation config");

        const userId = this.parseSnowflake(user);
        const quota = await this.getQuota(userId);
        const usage = await this.getUsage(userId);
        const stats = conversation.plugins.getPluginOutput(statsPluginName);

        return usage + stats.size < quota;
    }

    public async logUsage(conversation: Conversation) {
        if (!this.isEnabled()) return;
        const { user } = conversation.config.getConfig();
        if (!user) throw new Error("No user found in conversation config");

        const userId = this.parseSnowflake(user);
        const usage = await this.getUsage(userId);
        const stats = conversation.plugins.getPluginOutput(statsPluginName);

        await this.usages.set(userId, usage + stats.size);
    }

    private parseSnowflake(snowflake: string) {
        if (isValidSnowflake(snowflake)) return snowflake;
        if (!this.isValidConversationUser(snowflake))
            throw new BotException("Invalid user/role id");
        return snowflake.split("-")[1];
    }

    private isValidConversationUser(user: string): user is ConversationUser {
        if (!user.startsWith("discord-")) return false;
        const userId = user.split("-")[1];
        return isValidSnowflake(userId);
    }

    private getDb(name: string) {
        const uri =
            MONGO_CONNECTION_STRING ||
            MYSQL_CONNECTION_STRING ||
            POSTGRES_CONNECTION_STRING;

        if (!uri) return null;
        let db: Keyv | null = null;

        switch (uri) {
            case MONGO_CONNECTION_STRING:
                this.dbType = "mongodb" as TDbType;
                db = new Keyv(uri, {
                    namespace: name,
                    collection: name,
                });
                break;
            case MYSQL_CONNECTION_STRING:
                this.dbType = "mysql" as TDbType;
                db = new Keyv(uri, {
                    namespace: name,
                    table: name.replace(/-/g, "_"),
                });
                break;
            case POSTGRES_CONNECTION_STRING:
                this.dbType = "postgres" as TDbType;
                db = new Keyv(uri, {
                    namespace: name.replace(/-/g, "_"),
                    table: name.replace(/-/g, "_"),
                    schema: POSTGRES_SCHEMA || "gpt_turbo_discord",
                });
                break;
        }

        if (!db) return null;
        db.on("event", (err) => {
            console.error(err.message);
        });

        return db;
    }

    private async refreshQuotedIds() {
        if (!this.isEnabled()) return;

        await this.client.guilds.fetch();

        const guilds = this.client.guilds.cache.map((guild) => guild);
        const roles = guilds.flatMap((guild) =>
            guild.roles.cache.map((role) => role)
        );

        const tempQuotedRoleIds = new Set<string>();
        const tempQuotedGuildIds = new Set<string>();
        for await (const [roleId] of this.roleQuotas.iterator()) {
            const quotedRole = roles.find((role) => role.id === roleId);
            if (!quotedRole) {
                console.warn(
                    "Role associated with a role quota not found:",
                    roleId
                );
                continue;
            }
            tempQuotedRoleIds.add(roleId);
            tempQuotedGuildIds.add(quotedRole.guild.id);
        }

        this.quotedRoleIds = tempQuotedRoleIds;
        this.quotedGuildIds = tempQuotedGuildIds;
    }
}
