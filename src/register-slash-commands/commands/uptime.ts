import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export async function getUptime(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
    const uptime = new SlashCommandBuilder().setName("uptime").setDescription("Проверить работу");

    return [uptime.toJSON()];
}
