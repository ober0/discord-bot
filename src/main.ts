import client from "./index";

import "./db/main";

import "./routes/precenses.route";
import "./routes/interaction.route";

import { BOT_TOKEN, BOTSPAM_CHANNEL_ID } from "./cfg";
import { Client, EmbedBuilder, MessageFlags, TextChannel } from "discord.js";
import { intervalProcessing } from "./interval-processing/main";

client.once("clientReady", async (el) => {
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

    setInterval(async () => {
        await intervalProcessing(el);
    }, 30_000);
});

client.login(BOT_TOKEN!);
