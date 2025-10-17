import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags
} from "discord.js";
import db from "../db/main";
import { answerOption, quiz } from "../db/schema";
import { formatTimeMoscow } from "../tools/format-date";

async function calcTime(hours: number | null, minutes: number | null) {
    let timeMs = 0;

    if (!hours && !minutes) {
        return 60 * 60 * 1000;
    }

    if (hours) {
        timeMs += hours * 60 * 60 * 1000;
    }
    if (minutes) {
        timeMs += minutes * 60 * 1000;
    }

    return timeMs;
}

export async function createVote(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString("вопрос", true);
    const minutes = interaction.options.getInteger("минуты", false);
    const hours = interaction.options.getInteger("часы", false);

    const timeMs = await calcTime(hours, minutes);

    const someAnswer = interaction.options.getBoolean("несколько_ответов") ?? false;
    const answers: { id: number; text: string }[] = [];

    for (let i: number = 1; i <= 10; i++) {
        try {
            const answer = interaction.options.getString(`вариант-${i}`);

            if (answer) {
                answers.push({
                    id: i,
                    text: answer
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    await interaction.deferReply();

    if (!answers.length) {
        return interaction.reply("Произошла ошибка, проверьте варианты ответа!");
    }

    const insertQuiz = await db
        .insert(quiz)
        .values({
            channelId: interaction.channelId,
            question: question,
            someAnswer: Number(someAnswer),
            remindAt: new Date().getTime() + timeMs
        })
        .returning();

    const quizId = insertQuiz[0].id;

    const insertAnswers = await Promise.all(
        answers.map(async (answer) => {
            return db
                .insert(answerOption)
                .values({
                    quizId,
                    answer: answer.text
                })
                .returning();
        })
    );

    const endTime = new Date(insertQuiz[0].remindAt);
    const formattedEndTime = formatTimeMoscow(endTime);

    const embed = new EmbedBuilder()
        .setTitle("Голосование")
        .setDescription(question)
        .setColor("Random")
        .setFooter({
            text: someAnswer
                ? "Можно выбрать несколько вариантов\n"
                : "Только один вариант\n" + `До ${formattedEndTime} МСК`
        })
        .setTimestamp();

    const buttons = await Promise.all(
        insertAnswers.flat().map(async (answer) => {
            return new ButtonBuilder()
                .setCustomId(`vote_${quizId}_${answer.id}`)
                .setLabel(answer.answer)
                .setStyle(ButtonStyle.Primary);
        })
    );

    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    for (let i = 0; i < buttons.length; i += 5) {
        rows.push(new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(i, i + 3)));
    }

    await interaction.editReply({ embeds: [embed], components: rows, content: null });
}
