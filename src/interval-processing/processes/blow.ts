import { ChannelType, Client } from "discord.js";
import db from "../../db/main";
import { blow, blowDoes } from "../../db/schema";
import { and, eq, lt } from "drizzle-orm";

export async function blowProcessing(client: Client<true>) {
    const endedBlows = await db
        .select()
        .from(blow)
        .where(and(eq(blow.isEnd, 0), lt(blow.remindAt, Date.now())));

    if (!endedBlows.length) return;

    await Promise.all(
        endedBlows.map(async (endBlow) => {
            const blowCount = await db.$count(blowDoes, eq(blowDoes.blowId, endBlow.id));

            const channel = await client.channels.fetch(endBlow.channelId);
            if (!channel) {
                return;
            }

            if (channel.type === ChannelType.GuildText) {
                const guild = channel.guild;
                const member = await guild.members.fetch(endBlow.userId).catch(() => null);
                const username = member?.user.username;

                channel.send(`🏁 **Голосование завершено!**\nНа ${username} поссали ${blowCount} человек`);
            }

            await db
                .update(blow)
                .set({
                    isEnd: 1
                })
                .where(eq(blow.id, endBlow.id));
        })
    );
}
