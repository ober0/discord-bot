export const NOTIFICATION_CHANNEL_ID = process.env.NOTIFICATION_CHANNEL_ID;
export const NOTIFICATION_CHANNEL_NAME = "Активности";

if (!NOTIFICATION_CHANNEL_ID) throw new Error("Не указан NOTIFICATION_CHANNEL_ID");
