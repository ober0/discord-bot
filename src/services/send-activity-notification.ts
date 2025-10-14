import { EmbedBuilder, Presence } from "discord.js";
import { NOTIFICATION_CHANNEL_ID } from "../cfg";

export async function sendActivityNotification(oldPresence: Presence | null, newPresence: Presence) {
    const member = newPresence.member;
    if (!member) return;

    const channel = newPresence.guild?.channels.cache.get(NOTIFICATION_CHANNEL_ID!);
    if (!channel || !channel.isTextBased()) return;

    const newGames = newPresence.activities.filter((a) => a.type === 0);
    const oldGames = oldPresence?.activities.filter((a) => a.type === 0) || [];

    for (const game of newGames) {
        if (!oldGames.some((g) => g.name === game.name)) {
            const embed = new EmbedBuilder()
                .setTitle(`Новая активность на сервере! 🎮`)
                .addFields([
                    { name: "Юзер", value: `**${member.displayName}**`, inline: true },
                    { name: "Игра", value: game.name, inline: true },
                    { name: "Статус", value: game.presence.status, inline: true }
                ])
                .setColor(0x1a73e8)
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        }
    }
}
