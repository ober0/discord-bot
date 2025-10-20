import { ChatInputCommandInteraction, GuildMemberRoleManager, Message, MessageFlags } from "discord.js";
import { ADMIN_ROLE_ID } from "../cfg";

export async function checkUserIsAdmin(message: Message): Promise<boolean> {
    if (!message.member) return false;

    const hasRole = message.member.roles.cache.some((role) => role.name === "самый самый ультра секси пацик на районе");

    if (!hasRole) {
        await message.reply(`<@${message.author.id}>, у тебя недостаточно прав 😏`);
        return false;
    }

    return true;
}

export async function checkUserIsAdminInteraction(
    interaction: ChatInputCommandInteraction,
    onlyReturn: boolean = false
): Promise<boolean> {
    const member = interaction.member;

    if (!member) return false;

    let hasRole = false;

    if ("roles" in member && member.roles instanceof GuildMemberRoleManager) {
        hasRole = member.roles.cache.some((role) => role.name === "самый самый ультра секси пацик на районе");
    } else if ("roles" in member && Array.isArray(member.roles)) {
        hasRole = member.roles.includes(ADMIN_ROLE_ID!);
    }

    if (!hasRole) {
        if (!onlyReturn) {
            await interaction.reply({
                content: `<@${interaction.user.id}>, у тебя недостаточно прав 😏`,
                flags: MessageFlags.Ephemeral
            });
        }
        return false;
    }

    return true;
}
