import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    MessageFlags
} from "discord.js";

export async function blow(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("юзер");
    const minutes = interaction.options.getInteger("время") ?? 0.1;

    if (!user) {
        return await interaction.reply({
            content: "Юзер не найден",
            ephemeral: true
        });
    }

    let count = 0;
    const votedUsers = new Set<string>();

    const createMainButton = (currentCount: number) => {
        return new ButtonBuilder()
            .setCustomId(`blow-user-${user.id}`)
            .setLabel(`Обоссали ${currentCount} раз`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji("💦");
    };

    const createPersonalButton = (currentCount: number, hasVoted: boolean) => {
        return new ButtonBuilder()
            .setCustomId(`blow-user-${user.id}`)
            .setLabel(hasVoted ? `Вы обоссали ${user.username}` : `Обоссали ${currentCount} раз`)
            .setStyle(hasVoted ? ButtonStyle.Success : ButtonStyle.Primary)
            .setEmoji("💦")
            .setDisabled(hasVoted);
    };

    const mainButton = createMainButton(count);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(mainButton);

    const endTime = new Date(Date.now() + 1000 * 60 * minutes);

    const formattedEndTime = endTime.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const response = await interaction.reply({
        content: `<@${user.id}> **Тебя отпетушили!** \n\nНажмите на кнопку, чтобы **обоссать** ${user.username}\nУ вас есть **${minutes} минут (до ${formattedEndTime})**`,
        components: [row]
    });

    const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 1000 * 60 * minutes
    });

    collector.on("collect", async (i) => {
        if (i.customId === `blow-user-${user.id}`) {
            if (votedUsers.has(i.user.id)) {
                return await i.followUp({
                    content: `🚫 Вы уже обоссали ${user.username}! (Всего: ${count} раз)`,
                    ephemeral: true
                });
            }

            votedUsers.add(i.user.id);
            count++;

            const updatedButton = createMainButton(count);
            const updatedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(updatedButton);

            await i.update({
                content: `<@${user.id}> **Тебя отпетушили!** \nНажмите на кнопку, чтобы обоссать ${user.username}\nУ вас есть **${minutes} минут (до ${formattedEndTime})**`,
                components: [updatedRow]
            });
        }
    });

    collector.on("end", async () => {
        const disabledButton = new ButtonBuilder()
            .setCustomId(`blow-user-${user.id}`)
            .setLabel(`Обоссали ${count} раз`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("💦")
            .setDisabled(true);

        const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(disabledButton);

        await interaction.editReply({
            components: [disabledRow]
        });

        await interaction.followUp({
            content: `🏁 **Голосование завершено!**\nНа ${user} поссали ${count} человек`,
            allowedMentions: { users: [] }
        });

        const users = Array.from(votedUsers);

        const userPromises = users.map((userId) => interaction.guild?.members.fetch(userId).catch(() => null));
        const members = await Promise.all(userPromises);

        const validMembers = members.filter(Boolean);

        const userList = validMembers.map((member) => `• ${member?.user.username}`).join("\n");

        await interaction.followUp({
            content: `Список нажавших кнопку: \n ${userList}`,
            flags: MessageFlags.Ephemeral
        });
    });
}
