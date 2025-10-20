import client from "../index";
import { ButtonInteraction, ChatInputCommandInteraction, Events, MessageFlags } from "discord.js";
import { getPidorLists } from "../services/get-pidor-lists";
import { sendAllPresences } from "../services/send-all-presences";
import { blow, blowProcessing } from "../services/blow";
import { sendUptime } from "../services/uptime";
import { createVote } from "../services/vote";
import { checkUserIsAdmin, checkUserIsAdminInteraction } from "../tools/check-admin.tools";
import { processingVote } from "../services/processing-vote";
import { checkQuizVote } from "../interval-processing/processes/vote";
import { processingTrollVoice } from "../services/troll-voice";

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        await slashCommandsRoute(interaction);
    } else if (interaction.isButton()) {
        await buttonRoute(interaction);
    }
});

async function buttonRoute(interaction: ButtonInteraction) {
    const data = interaction.customId.split("_");
    const prefix = data[0];

    switch (prefix) {
        case "vote":
            await processingVote(interaction);
            break;
        case "check-quiz-vote":
            await checkQuizVote(interaction);
            break;
        case "blow":
            await blowProcessing(interaction);
            return;
        default:
            await interaction.reply({ content: "Неизвестная ошибка", flags: MessageFlags.Ephemeral });
    }
}

async function slashCommandsRoute(interaction: ChatInputCommandInteraction) {
    const command = interaction.commandName;

    if (command === "список_пидоров" || command === "pidorlist") {
        await getPidorLists(interaction);
        return;
    } else if (command === "активности" || command === "activities") {
        await sendAllPresences(interaction);
        return;
    } else if (command === "обоссать") {
        await blow(interaction);
        return;
    } else if (command === "голосование" || command === "vote") {
        await createVote(interaction);
        return;
    } else if (command === "uptime") {
        const isAdmin = await checkUserIsAdminInteraction(interaction);
        if (!isAdmin) return;

        await sendUptime(interaction);
        return;
    } else if (command === "troll-voice") {
        const isAdmin = await checkUserIsAdminInteraction(interaction, true);
        await processingTrollVoice(interaction, isAdmin);
    }
}
