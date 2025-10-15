import { ChatInputCommandInteraction, EmbedBuilder, Message } from "discord.js";

export async function getPidorLists(interaction: ChatInputCommandInteraction) {
    const onlineMembers = interaction.guild?.members.cache.filter((m) => m.presence && m.presence.status !== "offline");

    if (!onlineMembers) {
        return interaction.reply("Сейчас никто не играет в Rocket League :(");
    }

    const fields = onlineMembers
        .filter((member) => member.presence?.activities.some((a) => a.name.toLowerCase().includes("rocket league")))
        .map((member) => {
            const rocketActivity = member.presence!.activities.find((a) =>
                a.name.toLowerCase().includes("rocket league")
            );

            let duration = "";
            if (rocketActivity?.timestamps?.start) {
                const diff = Date.now() - rocketActivity.timestamps.start.getTime();
                const minutes = Math.floor(diff / 60000);
                duration = ` (играет ${minutes} мин)`;
            }

            return {
                name: `${member.displayName}`,
                value: `**Rocket League** ${duration}`
            };
        });

    if (!fields.length) {
        return interaction.reply("Сейчас никто не играет в Rocket League :(");
    }

    const embed = new EmbedBuilder()
        .setTitle("Список пидоров, играющих в Rocket League")
        .addFields(fields)
        .setColor(0x1a73e8)
        .setTimestamp();
    return interaction.reply({ embeds: [embed] });
}
