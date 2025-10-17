import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    MessageFlags
} from "discord.js";
import { v4 as uuidv4 } from "uuid";

export async function blow(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("юзер");
    const minutes = interaction.options.getInteger("время") ?? 5;
    const randomUuid = uuidv4();

    if (!user) {
        return await interaction.reply({
            content: "Юзер не найден",
            ephemeral: true
        });
    }

    await interaction.deferReply();

    let count = 0;
    const votedUsers = new Set<string>();

    const createMainButton = (currentCount: number) => {
        return new ButtonBuilder()
            .setCustomId(`blow-user-${user.id}-${randomUuid}`)
            .setLabel(`Обоссали ${currentCount} раз`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji("💦");
    };

    const endTime = new Date(Date.now() + 1000 * 60 * minutes);
    const formattedEndTime = endTime.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Moscow"
    });

    try {
        const response = await interaction.editReply({
            content: `<@${user.id}> **Тебя отпетушили!** \n\nНажмите на кнопку, чтобы **обоссать** ${user.username}\nУ вас есть **${minutes} минут (до ${formattedEndTime} МСК)**`,
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(createMainButton(count))]
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 1000 * 60 * minutes
        });

        collector.on("collect", async (i) => {
            if (i.customId === `blow-user-${user.id}-${randomUuid}`) {
                if (votedUsers.has(i.user.id)) {
                    await i.reply({
                        content: `🚫 Вы уже обоссали ${user.username}!`,
                        ephemeral: true
                    });
                    return;
                }

                votedUsers.add(i.user.id);
                count++;

                const updatedButton = createMainButton(count);
                const updatedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(updatedButton);

                try {
                    await i.update({
                        content: `<@${user.id}> **Тебя отпетушили!** \n\nНажмите на кнопку, чтобы обоссать ${user.username}\nУ вас есть **${minutes} минут (до ${formattedEndTime} МСК)**`,
                        components: [updatedRow]
                    });
                } catch (error) {
                    console.error("Ошибка при обновлении:", error);
                }
            }
        });

        collector.on("end", async () => {
            const disabledButton = new ButtonBuilder()
                .setCustomId(`blow-user-${user.id}-${randomUuid}`)
                .setLabel(`Обоссали ${count} раз`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("💦")
                .setDisabled(true);

            const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(disabledButton);

            try {
                await interaction.editReply({
                    components: [disabledRow]
                });

                await interaction.followUp({
                    content: `🏁 **Голосование завершено!**\nНа ${user} поссали ${count} человек`,
                    allowedMentions: { users: [] }
                });

                if (votedUsers.size > 0) {
                    const users = Array.from(votedUsers);
                    const userPromises = users.map((userId) =>
                        interaction.guild?.members.fetch(userId).catch(() => null)
                    );
                    const members = await Promise.all(userPromises);
                    const validMembers = members.filter(Boolean);
                    const userList = validMembers.map((member) => `• ${member?.user.username}`).join("\n");

                    await interaction.followUp({
                        content: `Список нажавших кнопку: \n${userList}`,
                        flags: MessageFlags.Ephemeral
                    });
                }
            } catch (error) {
                console.error("Ошибка при завершении:", error);
            }
        });
    } catch (error) {
        console.error("Ошибка в команде blow:", error);
        if (!interaction.replied) {
            await interaction.followUp({
                content: "Произошла ошибка при выполнении команды",
                ephemeral: true
            });
        }
    }
}
