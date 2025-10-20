import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export async function getTrollVoice(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
    const activities = new SlashCommandBuilder()
        .setName("troll-voice")
        .setDescription("Немного издевается над юзером")
        .addUserOption((option) =>
            option.setName("мученик").setDescription("Над кем будем издеваться?").setRequired(true)
        )
        .addNumberOption((option) =>
            option.setName("перемещений").setDescription("Количество перемещений (default: 10").setRequired(false)
        )
        .addNumberOption((option) =>
            option
                .setName("задержка")
                .setDescription("Задержка между перемещениями. Только для администраторов!")
                .setRequired(false)
        );

    return [activities.toJSON()];
}
