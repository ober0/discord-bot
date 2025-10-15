import { PermissionFlagsBits, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export async function getBlow(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
    const blow = new SlashCommandBuilder()
        .setName("обоссать")
        .setDescription("ну... сам узнаешь что это")
        .addUserOption((option) => option.setName("юзер").setDescription("Кого отпетушить?").setRequired(true))
        .addIntegerOption((options) =>
            options.setName("время").setDescription("время голосования (в минутах)").setRequired(false)
        );

    return [blow.toJSON()];
}
