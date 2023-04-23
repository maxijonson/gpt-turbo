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

export type DbType = "mongodb" | "mysql" | "postgres";

export default class ConversationManager<
    QuotaEnabled = false,
    TDbType = QuotaEnabled extends true ? DbType : null,
    TDb = QuotaEnabled extends true ? Keyv : null
> {
    public static readonly DEFAULT_QUOTA_KEY = "default";

    private dbType: TDbType = null as TDbType;
    private quotas: TDb = null as TDb;
    private usages: TDb = null as TDb;

    constructor() {
        this.quotas = this.getDb("gpt-turbo-discord-quotas") as TDb;
        this.usages = this.getDb("gpt-turbo-discord-usages") as TDb;

        console.info(
            this.dbType
                ? `Using database: ${this.dbType}`
                : "Quotas/Usages disabled"
        );
    }

    public async getChatCompletion(
        messages: (
            | { content: string; role: ChatCompletionRequestMessageRoleEnum }
            | string
        )[]
    ) {
        const conversation = await Conversation.fromMessages(
            this.getAlternatedMessages(messages),
            getConversationConfig()
        );
        return conversation.getChatCompletionResponse();
    }

    public async init() {
        if (!this.isQuotaEnabled()) return;
        this.quotas.set(ConversationManager.DEFAULT_QUOTA_KEY, DEFAULT_QUOTA);
    }

    public isQuotaEnabled(): this is ConversationManager<true> {
        return this.dbType !== null;
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
