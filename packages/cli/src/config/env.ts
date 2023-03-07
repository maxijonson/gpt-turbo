import dotenv from "dotenv";
dotenv.config();

export const GPTTURBO_APIKEY = process.env.GPTTURBO_APIKEY;

export const GPTTURBO_DRY = (process.env.GPTTURBO_DRY || "false") === "true";

export const GPTTURBO_MODEL = process.env.GPTTURBO_MODEL;

export const GPTTURBO_CONTEXT = process.env.GPTTURBO_CONTEXT;
