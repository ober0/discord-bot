import { Client } from "discord.js";
import { voteEndProcessing } from "./processes/vote";

export async function intervalProcessing(client: Client<true>) {
    await Promise.all([voteEndProcessing(client)]);
}
