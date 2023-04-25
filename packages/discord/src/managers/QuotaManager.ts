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
    private quotas: TQuotas = null as TQuotas;
    private usages: TUsages = null as TUsages;

    constructor() {
        this.quotas = this.getDb("gpt-turbo-discord-quotas") as TQuotas;
        this.usages = this.getDb("gpt-turbo-discord-usages") as TUsages;

        console.info(
            this.dbType
                ? `Quotas/Usages enabled. Using ${this.dbType}`
                : "Quotas/Usages disabled."
        );
    }

    public async init() {
        if (!this.isEnabled()) return;
        await this.quotas.set(QuotaManager.DEFAULT_QUOTA_KEY, DEFAULT_QUOTA);
    }

    public isEnabled(): this is QuotaManager<true> {
        return this.quotas !== null && this.usages !== null;
    }

    public async getQuota(userId: string): Promise<number> {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        const id = this.parseUserId(userId);
        const quota =
            (await this.quotas.get(id)) ??
            (await this.quotas.get(QuotaManager.DEFAULT_QUOTA_KEY));
        if (quota === undefined) throw new Error("No default quota found");
        return quota;
    }

    public async setQuota(userId: string, quota: number) {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        if (quota < 0) throw new BotException("Quota must be positive");
        const id = this.parseUserId(userId);
        await this.quotas.set(id, quota);
    }

    public async getUsage(userId: string): Promise<number> {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        const id = this.parseUserId(userId);
        const usage = await this.usages.get(id);
        return usage ?? 0;
    }

    public async setUsage(userId: string, usage: number) {
        if (!this.isEnabled()) throw new BotException("Quotas are disabled");
        if (usage < 0) throw new BotException("Usage must be positive");
        const quota = await this.getQuota(userId);
        const id = this.parseUserId(userId);
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
        const { user } = conversation.getConfig();
        if (!user) throw new Error("No user found in conversation config");

        const userId = this.parseUserId(user);
        const quota = await this.getQuota(userId);
        const usage = await this.getUsage(userId);

        return usage + conversation.getSize() < quota;
    }

    public async logUsage(conversation: Conversation) {
        if (!this.isEnabled()) return;
        const { user } = conversation.getConfig();
        if (!user) throw new Error("No user found in conversation config");

        const userId = this.parseUserId(user);
        const usage = await this.getUsage(userId);

        await this.usages.set(userId, usage + conversation.getSize());
    }

    private parseUserId(user: string) {
        if (isValidSnowflake(user)) return user;
        if (!this.isValidConversationUser(user))
            throw new BotException("Invalid user id");
        return user.split("-")[1];
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
}
