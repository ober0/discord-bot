import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    MessageFlags
} from "discord.js";
import { v4 as uuidv4 } from "uuid";
import { formatTimeMoscow } from "../tools/format-date";
import db from "../db/main";
import { blow as blowTable, blowDoes } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core/index";

export async function blow(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("юзер");
    const minutes = interaction.options.getInteger("время") ?? 5;

    if (!user) {
        return await interaction.reply({
            content: "Юзер не найден",
            ephemeral: true
        });
    }

    const remindAt = Date.now() + minutes * 60 * 1000;

    await interaction.deferReply();

    const formattedEndTime = formatTimeMoscow(new Date(Date.now() + 1000 * 60 * minutes));

    const [blow] = await db
        .insert(blowTable)
        .values({
            userId: user.id,
            channelId: interaction.channelId,
            remindAt,
            formattedEndTime,
            minutes
        })
        .returning();

    const createMainButton = (currentCount: number) => {
        return new ButtonBuilder()
            .setCustomId(`blow_${blow.id}`)
            .setLabel(`Обоссали ${currentCount} раз`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji("💦");
    };

    const response = await interaction.editReply({
        content: `<@${user.id}> **Тебя отпетушили!** \n\nНажмите на кнопку, чтобы **обоссать** ${user.username}\nУ вас есть **${minutes} минут (до ${formattedEndTime})**`,
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(createMainButton(0))]
    });
}

export async function blowProcessing(interaction: ButtonInteraction) {
    const [_, blowIdStr] = interaction.customId.split("_");
    const blowId = parseInt(blowIdStr);

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const [blow] = await db.select().from(blowTable).where(eq(blowTable.id, blowId));

    if (!blow) {
        await interaction.editReply({
            content: "❌ Событие не найдено!"
        });
        return;
    }

    const blowedUser = await interaction.guild?.members.fetch(blow.userId);

    if (!blowedUser) {
        await interaction.editReply({
            content: "❌ Пользователь не найден!"
        });
        return;
    }

    if (blow.remindAt < Date.now()) {
        await interaction.editReply({
            content: `🚫 Время чтобы обоссать ${blowedUser.user.username} вышло!`
        });
        return;
    }

    const alreadyBlowed = await db
        .select()
        .from(blowDoes)
        .where(and(eq(blowDoes.blowId, blowId), eq(blowDoes.userId, interaction.user.id)));

    if (alreadyBlowed.length) {
        await interaction.editReply({
            content: `🚫 Вы уже обоссали ${blowedUser.user.username}!`
        });
        return;
    }

    await db.insert(blowDoes).values({
        blowId: blowId,
        userId: interaction.user.id
    });

    const count = await db.$count(blowDoes, eq(blowDoes.blowId, blowId));

    const updatedButton = new ButtonBuilder()
        .setCustomId(`blow_${blowId}`)
        .setLabel(`Обоссали ${count} раз`)
        .setStyle(ButtonStyle.Primary)
        .setEmoji("💦");

    const updatedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(updatedButton);

    await interaction.message.edit({
        content: `<@${blowedUser.user.id}> **Тебя отпетушили!** \n\nНажмите на кнопку, чтобы обоссать ${blowedUser.user.username}\nУ вас есть **${blow.minutes} минут (до ${blow.formattedEndTime})**`,
        components: [updatedRow]
    });

    await interaction.editReply({
        content: `✅ Вы успешно обоссали ${blowedUser.user.username}!`
    });
}
