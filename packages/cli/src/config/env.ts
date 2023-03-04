import { ChatCompletionModel } from "@maxijonson/gpt-turbo";
import dotenv from "dotenv";
dotenv.config();

export const GPTTURBO_APIKEY = process.env.GPTTURBO_APIKEY || "";

export const GPTTURBO_MODEL = (process.env.GPTTURBO_MODEL ||
    "gpt-3.5-turbo") as ChatCompletionModel;

export const GPTTURBO_DRY = (process.env.GPTTURBO_DRY || "false") === "true";
