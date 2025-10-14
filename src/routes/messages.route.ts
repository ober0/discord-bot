import client from "../index";
import { getPidorLists } from "../services/get-pidor-lists";
import { Events } from "discord.js";
import { sendAllPresences } from "../services/send-all-presences";

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    let content: string;

    if (message.mentions.has(client.user?.id!)) {
        content = message.content.replace(`<@${client.user?.id}>`, "").trim().toLowerCase();

        if (["список пидорасов", "список пидоров", "пидоры", "пидорасы"].includes(content)) {
            await getPidorLists(message);
            return;
        } else if (content === "активности") {
            await sendAllPresences(message);
        }
    } else {
        content = message.content;

        if (content === "!actives" || content === "!precenses") {
            await sendAllPresences(message);
        }
    }
});
