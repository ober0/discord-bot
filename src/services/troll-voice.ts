import {
    ChannelType,
    ChatInputCommandInteraction,
    Colors,
    CommandInteraction,
    EmbedBuilder,
    MessageFlags,
    TextChannel
} from "discord.js";
import db from "../db/main";
import { trollVoice } from "../db/schema";
import { and, eq, gt } from "drizzle-orm";
import { STAFF_VOICE_ID } from "../cfg";

const timeout = 1000 * 60 * 30; // 30 мин

export async function processingTrollVoice(interaction: ChatInputCommandInteraction, isAdmin: boolean) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const user = interaction.options.getUser("мученик", true);
    const member = await interaction.guild?.members.fetch(user.id);

    const transfers = interaction.options.getNumber("перемещений", false) ?? 10;
    const delay = interaction.options.getNumber("задержка", false);

    if (!isAdmin && delay) {
        return interaction.editReply({
            content: "❌ Изменение задержки доступно только администратору"
        });
    }

    if (!isAdmin && transfers > 20) {
        return interaction.editReply({
            content: "❌ Лимит - 20 перемещений"
        });
    }

    if (!member) {
        return interaction.editReply({
            content: "❌ Юзер не найден"
        });
    }

    const [count1, count2] = await Promise.all([
        db.$count(trollVoice, and(gt(trollVoice.createdAt, Date.now() - timeout), eq(trollVoice.userId, user.id))),
        db.$count(
            trollVoice,
            and(gt(trollVoice.createdAt, Date.now() - timeout), eq(trollVoice.creatorId, interaction.user.id))
        )
    ]);

    await db.insert(trollVoice).values({
        createdAt: Date.now(),
        creatorId: interaction.user.id,
        userId: user.id
    });

    if (count1 > 0 && !isAdmin) {
        return interaction.editReply({
            content: "❌ Пользователь уже мучался в последние 30 минут. Подождите немного!"
        });
    }
    if (count2 > 0 && !isAdmin) {
        return interaction.editReply({
            content: "❌ Пв уже мучали пользователя в последние 30 минут. Подождите немного!"
        });
    }

    const voice = member?.voice;

    const currentChannelId = voice.channel?.id;

    if (!currentChannelId) {
        return interaction.editReply({
            content: "❌ Пользователь сейчас не в войсе :("
        });
    }

    await interaction.editReply({
        content: "Начинаем мучения :)"
    });

    await voice.setMute(true, "Так надо, бро");

    const fetchedChannels = await interaction.guild?.channels.fetch();

    if (!fetchedChannels) {
        return interaction.editReply({
            content: "❌ Внутренняя ошибка: комнаты не найдены"
        });
    }

    const filteredChannelsCollection = fetchedChannels.filter(
        (channel) => channel?.type === ChannelType.GuildVoice && channel?.id !== STAFF_VOICE_ID
    );

    const filteredChannels = Array.from(filteredChannelsCollection);

    const channelsCount = filteredChannels.length;

    for (let i = 0; i < transfers; i++) {
        const index = i % channelsCount;
        const targetChannelId = filteredChannels[index][0];

        try {
            await member.voice.setChannel(targetChannelId);
        } catch (error) {
            console.error(error);
        }

        await new Promise((resolve) => setTimeout(resolve, delay ?? 500));
    }

    await member.voice.setChannel(currentChannelId);
    await voice.setMute(false, "Так надо, бро");

    const announcementChannel = interaction.channel;

    if (announcementChannel && announcementChannel.isTextBased() && "send" in announcementChannel) {
        const embed = new EmbedBuilder()
            .setTitle("🔔 Мучение завершено!")
            .setColor(Colors.Red)
            .addFields(
                { name: "Пользователь", value: member.user.tag, inline: true },
                { name: "Команду вызвал", value: interaction.user.tag, inline: true },
                { name: "Перемещений", value: transfers.toString(), inline: true },
                { name: "Задержка", value: `${delay ?? 500} мс`, inline: true }
            )
            .setFooter({ text: "Бот заботится о порядке!" })
            .setTimestamp();

        await announcementChannel.send({ embeds: [embed] });
    }
}
