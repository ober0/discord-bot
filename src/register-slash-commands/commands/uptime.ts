import { PermissionFlagsBits, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export async function getUptime(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
    const uptime = new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Проверить работу")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

    return [uptime.toJSON()];
}
