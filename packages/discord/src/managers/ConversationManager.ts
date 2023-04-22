import Keyv from "keyv";
import {
    MONGO_CONNECTION_STRING,
    MYSQL_CONNECTION_STRING,
    POSTGRES_CONNECTION_STRING,
    POSTGRES_SCHEMA,
} from "../config/env.js";

export type DbType = "mongodb" | "mysql" | "postgres";

export default class ConversationManager {
    private dbType: DbType | null = null;
    private quotas: Keyv | null = null;
    private usages: Keyv | null = null;

    constructor() {
        this.quotas = this.getDb("gpt-turbo-discord-quotas");
        this.usages = this.getDb("gpt-turbo-discord-usages");

        console.info(
            this.dbType
                ? `Using database: ${this.dbType}`
                : "Quotas/Usages disabled"
        );
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
                this.dbType = "mongodb";
                db = new Keyv(uri, {
                    namespace: name,
                    collection: name,
                });
                break;
            case MYSQL_CONNECTION_STRING:
                this.dbType = "mysql";
                db = new Keyv(uri, {
                    namespace: name,
                    table: name.replace(/-/g, "_"),
                });
                break;
            case POSTGRES_CONNECTION_STRING:
                this.dbType = "postgres";
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
