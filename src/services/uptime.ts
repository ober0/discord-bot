import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";

export async function sendUptime(interaction: ChatInputCommandInteraction) {
    const uptimeSeconds = process.uptime();
    const startDate = new Date(Date.now() - uptimeSeconds * 1000);

    const moscowStartTime = startDate.toLocaleString("ru-RU", {
        timeZone: "Europe/Moscow",
        hour12: false
    });

    const nowMoscowTime = new Date().toLocaleString("ru-RU", {
        timeZone: "Europe/Moscow",
        hour12: false
    });

    const totalSeconds = Math.floor(uptimeSeconds);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const uptimeString = [days ? `${days}д` : "", hours ? `${hours}ч` : "", minutes ? `${minutes}м` : "", `${seconds}с`]
        .filter(Boolean)
        .join(" ");

    const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("📊 Аптайм бота")
        .addFields(
            { name: "⏰ Время запуска (МСК)", value: moscowStartTime },
            { name: "🕐 Время работы", value: uptimeString },
            { name: "Режим", value: process.env.NODE_ENV!.toString() }
        )
        .setFooter({ text: `Текущее время (МСК): ${nowMoscowTime}` });

    await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral
    });
}
