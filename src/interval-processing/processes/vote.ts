import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelType,
    Client,
    ComponentType,
    EmbedBuilder,
    MessageFlags
} from "discord.js";
import db from "../../db/main";
import { answerOption, quiz, registeredAnswers } from "../../db/schema";
import { and, eq, lt } from "drizzle-orm";

export async function voteEndProcessing(client: Client<true>) {
    const votes = await db
        .select()
        .from(quiz)
        .where(and(eq(quiz.isEnd, 0), lt(quiz.remindAt, Date.now())));

    if (!votes) {
        return;
    }

    await Promise.all(
        votes.map(async (vote) => {
            const channel = await client.channels.fetch(vote.channelId);
            if (!channel) {
                return;
            }

            const answers = await db.select().from(answerOption).where(eq(answerOption.quizId, vote.id));

            const answersData: {
                id: number;
                text: string;
                count: number;
                userIds: string[];
            }[] = await Promise.all(
                answers.map(async (answer) => {
                    const userAnswers = await db
                        .select()
                        .from(registeredAnswers)
                        .where(and(eq(registeredAnswers.answerId, answer.id), eq(registeredAnswers.quizId, vote.id)));

                    return {
                        id: answer.id,
                        text: answer.answer,
                        count: userAnswers.length,
                        userIds: userAnswers.map((el) => el.userId)
                    };
                })
            );

            const sortedAnswersData = answersData.sort((a, b) => b.count - a.count);

            if (channel.type === ChannelType.GuildText) {
                const embed = new EmbedBuilder()
                    .setTitle("Голосование завершено")
                    .setDescription(
                        `**Вопрос: ${vote.question}**\n\n🏆Победивший вариант: ${sortedAnswersData[0].text} (${sortedAnswersData[0].count} голосов)\n`
                    )
                    .setFields(
                        sortedAnswersData.map((value) => ({
                            name: value.text,
                            value: `${value.count} голосов`,
                            inline: false
                        }))
                    )
                    .setColor("Random")
                    .setFooter({ text: "Поздравляем!" })
                    .setTimestamp();

                if (vote.isPublic) {
                    const button = new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setLabel("Посмотреть проголосовавших")
                        .setCustomId(`check-quiz-vote_${vote.id}`);

                    await channel.send({
                        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(button)],
                        embeds: [embed]
                    });
                } else {
                    await channel.send({
                        embeds: [embed]
                    });
                }

                await db
                    .update(quiz)
                    .set({
                        isEnd: 1
                    })
                    .where(eq(quiz.id, vote.id));
            } else return;
        })
    );
}

export async function checkQuizVote(interaction: ButtonInteraction) {
    const [_, quizIdStr] = interaction.customId.split("_");
    const quizId = parseInt(quizIdStr);

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const votes = await db.select().from(quiz).where(eq(quiz.id, quizId));

    if (!votes.length) {
        return;
    }

    const vote = votes[0];

    const answers = await db.select().from(answerOption).where(eq(answerOption.quizId, vote.id));

    const answersData: {
        id: number;
        text: string;
        count: number;
        userIds: string[];
    }[] = await Promise.all(
        answers.map(async (answer) => {
            const userAnswers = await db
                .select()
                .from(registeredAnswers)
                .where(and(eq(registeredAnswers.answerId, answer.id), eq(registeredAnswers.quizId, vote.id)));

            return {
                id: answer.id,
                text: answer.answer,
                count: userAnswers.length,
                userIds: userAnswers.map((el) => el.userId)
            };
        })
    );

    const sortedAnswersData = answersData.sort((a, b) => b.count - a.count);

    const fields = await Promise.all(
        sortedAnswersData.map(async (answer) => {
            const users = await Promise.all(
                answer.userIds.map(async (userId) => {
                    try {
                        const member = await interaction.guild?.members.fetch(userId);
                        if (!member) {
                            return "Не удалось получить никнейм";
                        }
                        return member.nickname || member.user.username;
                    } catch {
                        return "(пользователь не найден)";
                    }
                })
            );

            return {
                name: `${answer.text} (проголосовало: ${users.length})`,
                value:
                    users.length > 0
                        ? users.map((u, idx) => `${idx + 1}. ${u}`).join("\n")
                        : "— никто не проголосовал —",
                inline: false
            };
        })
    );

    const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("🗳 Список проголосовавших")
        .setDescription(`Результаты по голосованию: **${vote.question}**`)
        .setFields(fields);

    await interaction.editReply({ embeds: [embed] });
}
