import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ComponentType, MessageFlags } from "discord.js";
import db from "../db/main";
import { quiz, registeredAnswers } from "../db/schema";
import { and, eq, gte } from "drizzle-orm";

export async function processingVote(interaction: ButtonInteraction) {
    const [_, quizIdStr, answerIdStr] = interaction.customId.split("_");
    const quizId = parseInt(quizIdStr);
    const answerId = parseInt(answerIdStr);
    const userId = interaction.user.id;

    await interaction.deferUpdate();

    const quizExistArray = await db
        .select()
        .from(quiz)
        .where(and(eq(quiz.id, quizId), gte(quiz.remindAt, Date.now())));

    if (!quizExistArray.length) {
        return interaction.followUp({
            content: "🚫 Голосование не найдено или истекло время голосования",
            flags: MessageFlags.Ephemeral
        });
    }

    const quizExist = quizExistArray[0];

    const existThisAnswer = await db
        .select()
        .from(registeredAnswers)
        .where(
            quizExist.someAnswer
                ? and(
                      eq(registeredAnswers.answerId, answerId),
                      eq(registeredAnswers.quizId, quizId),
                      eq(registeredAnswers.userId, userId)
                  )
                : and(eq(registeredAnswers.quizId, quizId), eq(registeredAnswers.userId, userId))
        );

    if (existThisAnswer.length) {
        return interaction.followUp({
            content: quizExist.someAnswer ? "🚫 Вы уже проголосовали за этот вариант" : "🚫 Вы уже проголосовали",
            flags: MessageFlags.Ephemeral
        });
    }

    await db.insert(registeredAnswers).values({
        answerId,
        quizId,
        userId,
        createdAt: Date.now()
    });

    const voteCount = await db.$count(registeredAnswers, eq(registeredAnswers.answerId, answerId));

    const message = interaction.message;
    const newRows = message.components.map((row) => {
        if (row.type !== ComponentType.ActionRow) return row;

        const newRow = new ActionRowBuilder<ButtonBuilder>();
        for (const component of row.components) {
            if (component.type !== ComponentType.Button) {
                newRow.addComponents(component as any);
                continue;
            }

            const button = ButtonBuilder.from(component);
            if ("custom_id" in button.data && button.data.custom_id === interaction.customId) {
                button.setLabel(`${button.data.label} (голосов: ${voteCount})`);
            }

            newRow.addComponents(button);
        }
        return newRow;
    });

    await interaction.editReply({ components: newRows }).catch(() => {});

    await interaction.followUp({
        content: "✅ Вы успешно проголосовали",
        flags: MessageFlags.Ephemeral
    });
}
