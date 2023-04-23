import Keyv from "keyv";
import {
    MONGO_CONNECTION_STRING,
    MYSQL_CONNECTION_STRING,
    POSTGRES_CONNECTION_STRING,
    POSTGRES_SCHEMA,
    DEFAULT_QUOTA,
} from "../config/env.js";
import { ChatCompletionRequestMessageRoleEnum, Conversation } from "gpt-turbo";
import getConversationConfig from "../utils/getConversationConfig.js";
import BotException from "../exceptions/BotException.js";

export type DbType = "mongodb" | "mysql" | "postgres";

export default class ConversationManager<
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
                ? `Using database: ${this.dbType}`
                : "Quotas/Usages disabled"
        );
    }

    public async init() {
        if (!this.isQuotaEnabled()) return;
        await this.quotas.set(
            ConversationManager.DEFAULT_QUOTA_KEY,
            DEFAULT_QUOTA
        );
    }

    public isQuotaEnabled(): this is ConversationManager<true> {
        return this.quotas !== null && this.usages !== null;
    }

    public async getChatCompletion(
        messages: (
            | { content: string; role: ChatCompletionRequestMessageRoleEnum }
            | string
        )[],
        userId: string
    ) {
        const conversation = await Conversation.fromMessages(
            this.getAlternatedMessages(messages),
            getConversationConfig({
                user: `discord-${userId}`,
            })
        );

        if (this.isQuotaEnabled()) {
            const quota =
                (await this.quotas.get(userId)) ??
                (await this.quotas.get(ConversationManager.DEFAULT_QUOTA_KEY));
            if (quota === undefined) throw new Error("No default quota found");

            if (!(await this.usages.has(userId))) {
                await this.usages.set(userId, 0);
            }
            const usage = await this.usages.get(userId);
            if (usage === undefined) throw new Error("Failed to create usage");

            const minNextUsage = usage + conversation.getSize();
            if (minNextUsage >= quota) {
                throw new BotException("Sorry, You've reached your quota.");
            }
        }

        const response = await conversation.getChatCompletionResponse();

        if (this.isQuotaEnabled()) {
            if (!(await this.usages.has(userId))) {
                await this.usages.set(userId, 0);
            }
            const usage = await this.usages.get(userId);
            if (usage === undefined)
                throw new Error("Failed to create usage after response");
            await this.usages.set(
                userId,
                usage + conversation.getSize() + response.size
            );
        }

        return response;
    }

    private getAlternatedMessages(
        messages: (
            | { content: string; role: ChatCompletionRequestMessageRoleEnum }
            | string
        )[]
    ): { content: string; role: ChatCompletionRequestMessageRoleEnum }[] {
        const alternatedMessages: {
            content: string;
            role: ChatCompletionRequestMessageRoleEnum;
        }[] = [];

        messages.forEach((message, index) => {
            alternatedMessages.push({
                content:
                    typeof message === "string" ? message : message.content,
                role:
                    typeof message === "string"
                        ? index % 2 === 0
                            ? "user"
                            : "assistant"
                        : message.role,
            });
        });

        return alternatedMessages;
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
