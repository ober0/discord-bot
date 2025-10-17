import dotenv from "dotenv";
dotenv.config();

export const NOTIFICATION_CHANNEL_ID = process.env.NOTIFICATION_CHANNEL_ID;
export const NOTIFICATION_CHANNEL_NAME = "Активности";

if (!NOTIFICATION_CHANNEL_ID) throw new Error("Не указан NOTIFICATION_CHANNEL_ID");

export const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("Не указан BOT_TOKEN");

export const CLIENT_ID = process.env.CLIENT_ID;
if (!CLIENT_ID) throw new Error("Не указан CLIENT_ID");

export const GUILD_ID = process.env.GUILD_ID;
if (!GUILD_ID) throw new Error("Не указан GUILD_ID");

export const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID;
if (!ADMIN_ROLE_ID) throw new Error("Не указан ADMIN_ROLE_ID");

export const BOTSPAM_CHANNEL_ID = process.env.BOTSPAM_CHANNEL_ID;
if (!BOTSPAM_CHANNEL_ID) throw new Error("Не указан BOTSPAM_CHANNEL_ID");
