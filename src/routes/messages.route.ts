import client from "../index";
import { Events, GuildMember } from "discord.js";
import { checkUserIsAdmin } from "../tools/check-admin.tools";
import { getPidorLists } from "../services/get-pidor-lists";

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (message.mentions.has(client.user?.id!)) {
        const content = message.content.replace(`<@${client.user?.id}>`, "").trim();

        if (["список пидорасов", "список пидоров", "пидоры", "пидорасы"].includes(content.toLowerCase())) {
            await getPidorLists(message);
            return;
        }
    }
});
