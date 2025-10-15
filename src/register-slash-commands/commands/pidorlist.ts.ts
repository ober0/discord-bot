import { PermissionFlagsBits, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export async function getPidorlist(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
    const pidorlist = new SlashCommandBuilder()
        .setName("список_пидоров")
        .setDescription("Показывает игроков рокет-лиги")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

    const pidorlistEn = new SlashCommandBuilder()
        .setName("pidorlist")
        .setDescription("Показывает игроков рокет-лиги")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

    return [pidorlist.toJSON(), pidorlistEn.toJSON()];
}
