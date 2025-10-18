import { Client } from "discord.js";
import { voteEndProcessing } from "./processes/vote";
import { blowProcessing } from "./processes/blow";

export async function intervalProcessing(client: Client<true>) {
    await Promise.all([voteEndProcessing(client), blowProcessing(client)]);
}
