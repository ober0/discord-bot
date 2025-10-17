import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export async function getVote(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
    const vote = new SlashCommandBuilder()
        .setName("голосование")
        .setDescription("Голосование")
        .addStringOption((option) => option.setName("вопрос").setDescription("Текст вопроса").setRequired(true))
        .addStringOption((option) => option.setName("вариант-1").setDescription("Вариант 1").setRequired(true))
        .addStringOption((option) => option.setName("вариант-2").setDescription("Вариант 2").setRequired(true))
        .addBooleanOption((option) =>
            option
                .setName("несколько_ответов")
                .setDescription("Разрешить несколько ответов? По умолчанию — true")
                .setRequired(false)
        )
        .addIntegerOption((option) => option.setName("часы").setDescription("Время действия (часы)").setRequired(false))
        .addIntegerOption((option) =>
            option.setName("минуты").setDescription("Время действия (минуты)").setRequired(false)
        );

    const voteEn = new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Голосование")
        .addStringOption((option) => option.setName("вопрос").setDescription("Текст вопроса").setRequired(true))
        .addStringOption((option) => option.setName("вариант-1").setDescription("Вариант 1").setRequired(true))
        .addStringOption((option) => option.setName("вариант-2").setDescription("Вариант 2").setRequired(true))
        .addBooleanOption((option) =>
            option
                .setName("несколько_ответов")
                .setDescription("Разрешить несколько ответов? По умолчанию — true")
                .setRequired(false)
        )
        .addIntegerOption((option) => option.setName("часы").setDescription("Время действия (часы)").setRequired(false))
        .addIntegerOption((option) =>
            option.setName("минуты").setDescription("Время действия (минуты)").setRequired(false)
        );

    for (let i = 3; i <= 10; i++) {
        vote.addStringOption((option) =>
            option.setName(`вариант-${i}`).setDescription(`Вариант ${i}`).setRequired(false)
        );

        voteEn.addStringOption((option) =>
            option.setName(`вариант-${i}`).setDescription(`Вариант ${i}`).setRequired(false)
        );
    }

    return [vote.toJSON(), voteEn.toJSON()];
}
