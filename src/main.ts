import client from "./index";

import "./db/main";

import "./routes/precenses.route";
import "./routes/interaction.route";

import { BOT_TOKEN, BOTSPAM_CHANNEL_ID } from "./cfg";
import { EmbedBuilder, MessageFlags, TextChannel } from "discord.js";

client.once("ready", async (el) => {
    console.log(`✅ Бот запущен как ${client.user?.tag}`);

    const channel = await client.channels.fetch(BOTSPAM_CHANNEL_ID!);
    if (channel && channel.isTextBased()) {
        const embed = new EmbedBuilder()
            .setTitle("Бот успешно запущен 🚀")
            .setFooter({ text: `Режим: ${process.env.NODE_ENV}` })
            .setColor("Random");
        await (channel as TextChannel).send({
            embeds: [embed]
        });
    }
});

client.login(BOT_TOKEN!);
