import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";

export async function sendUptime(interaction: ChatInputCommandInteraction) {
    const uptimeSeconds = process.uptime();
    const uptimeDate = new Date(Date.now() - uptimeSeconds * 1000);

    const moscowTime = new Date(uptimeDate.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));

    const nowMoscow = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" }));

    const totalSeconds = Math.floor(uptimeSeconds);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    const uptimeString = [days ? `${days}д` : "", hours ? `${hours}ч` : "", minutes ? `${minutes}м` : "", `${seconds}с`]
        .filter(Boolean)
        .join(" ");

    const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setTitle("📊 Аптайм бота")
        .addFields(
            {
                name: "⏰ Время запуска (МСК)",
                value: moscowTime.toLocaleString("ru-RU", {
                    timeZone: "Europe/Moscow",
                    hour12: false
                })
            },
            {
                name: "🕐 Время работы",
                value: uptimeString
            }
        )
        .setFooter({
            text: `Текущее время: ${nowMoscow.toLocaleTimeString("ru-RU", { timeZone: "Europe/Moscow", hour12: false })}`
        });

    await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral
    });
}
