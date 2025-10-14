import { Message } from "discord.js";

export async function checkUserIsAdmin(message: Message): Promise<boolean> {
    if (!message.member) return false;

    const hasRole = message.member.roles.cache.some((role) => role.name === "самый самый ультра секси пацик на районе");

    if (!hasRole) {
        await message.reply(`<@${message.author.id}>, у тебя недостаточно прав`);
        return false;
    }

    return true;
}
