import dotenv from "dotenv";
dotenv.config();

export const GPTTURBO_APIKEY = process.env.GPTTURBO_APIKEY;

export const GPTTURBO_DRY =
    process.env.GPTTURBO_DRY === undefined
        ? undefined
        : process.env.GPTTURBO_DRY === "true";

export const GPTTURBO_MODEL = process.env.GPTTURBO_MODEL;

export const GPTTURBO_CONTEXT = process.env.GPTTURBO_CONTEXT;

export const GPTTURBO_DISABLEMODERATION =
    process.env.GPTTURBO_DISABLEMODERATION === undefined
        ? undefined
        : process.env.GPTTURBO_DISABLEMODERATION === "soft"
        ? "soft"
        : (process.env.GPTTURBO_DISABLEMODERATION || "false") === "true";

export const GPTTURBO_STREAM =
    process.env.GPTTURBO_STREAM === undefined
        ? undefined
        : process.env.GPTTURBO_STREAM === "true";

// CLI only below

export const GPTTURBO_SHOWUSAGE =
    process.env.GPTTURBO_SHOWUSAGE === undefined
        ? undefined
        : process.env.GPTTURBO_SHOWUSAGE === "true";

export const GPTTURBO_SHOWDEBUG =
    process.env.GPTTURBO_SHOWDEBUG === undefined
        ? undefined
        : process.env.GPTTURBO_SHOWDEBUG === "true";
