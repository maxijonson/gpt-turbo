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

    public async isConversationAllowed(
        conversation: Conversation
    ): Promise<boolean> {
        if (!this.isEnabled()) return true;
        const { user } = conversation.getConfig();
        if (!user) throw new Error("No user found in conversation config");

        const userId = this.parseUserId(user);
        const quota =
            (await this.quotas.get(userId)) ??
            (await this.quotas.get(QuotaManager.DEFAULT_QUOTA_KEY));
        if (quota === undefined) throw new Error("No default quota found");

        if (!(await this.usages.has(userId))) {
            await this.usages.set(userId, 0);
        }
        const usage = await this.usages.get(userId);
        if (usage === undefined) throw new Error("Failed to create usage");

        return usage + conversation.getSize() <= quota;
    }

    public async logUsage(conversation: Conversation) {
        if (!this.isEnabled()) return;
        const { user } = conversation.getConfig();
        if (!user) throw new Error("No user found in conversation config");

        const userId = this.parseUserId(user);
        if (!(await this.usages.has(userId))) {
            await this.usages.set(userId, 0);
        }
        const usage = await this.usages.get(userId);
        if (usage === undefined) throw new Error("Failed to create usage");

        await this.usages.set(userId, usage + conversation.getSize());
    }

    private parseUserId(user: string) {
        if (!this.isValidUser(user)) throw new Error(`Invalid user: ${user}`);
        return user.split("-")[1];
    }

    private isValidUser(user: string): user is ConversationUser {
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
