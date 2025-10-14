import { EmbedBuilder, Message } from "discord.js";
import { NOTIFICATION_CHANNEL_ID, NOTIFICATION_CHANNEL_NAME } from "../cfg";

export async function sendAllPresences(message: Message) {
    if (message.channel.id !== NOTIFICATION_CHANNEL_ID) {
        await message.reply(`Команда доступна только в канале ${NOTIFICATION_CHANNEL_NAME}`);
        return;
    }

    const membersCollection = message.guild?.members.cache.filter((m) => m.presence);
    if (!membersCollection || membersCollection.size === 0) {
        return message.reply("Сейчас никто не играет :(");
    }

    const members = Array.from(membersCollection.values());

    const fields = members.flatMap((member) => {
        if (!member.presence) return [];

        return member.presence.activities.map((activity) => ({
            name: `**${member.displayName}**`,
            value: `Игра: **${activity.name}**\nСтатус: ${member.presence?.status}`,
            inline: false
        }));
    });

    if (!fields.length) {
        return message.reply("Сейчас никто не играет :(");
    }

    const embed = new EmbedBuilder().setTitle("Список активностей").addFields(fields).setColor(0x1a73e8).setTimestamp();

    return message.reply({ embeds: [embed] });
}
