import { ADMINS } from "../config/env.js";

export default (userId: string) => ADMINS.includes(userId);
