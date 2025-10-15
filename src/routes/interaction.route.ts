import client from "../index";
import { Events } from "discord.js";
import { getPidorLists } from "../services/get-pidor-lists";
import { sendAllPresences } from "../services/send-all-presences";
import { blow } from "../services/blow";

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

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
    }
});
