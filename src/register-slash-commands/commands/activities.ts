import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export async function getActivities(): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
    const activities = new SlashCommandBuilder()
        .setName("активности")
        .setDescription("Показывает текущие активности на сервере");

    const activitiesEn = new SlashCommandBuilder()
        .setName("activities")
        .setDescription("Показывает текущие активности на сервере");

    return [activities.toJSON(), activitiesEn.toJSON()];
}
