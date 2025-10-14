import client from "../index";
import { Events } from "discord.js";
import { sendActivityNotification } from "../services/send-activity-notification";

client.on(Events.PresenceUpdate, async (oldPresence, newPresence) => {
    await sendActivityNotification(oldPresence, newPresence);
});
