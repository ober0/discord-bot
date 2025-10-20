import {
    PermissionFlagsBits,
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
    SlashCommandBuilder
} from "discord.js";
import { BOT_TOKEN, CLIENT_ID, GUILD_ID } from "../cfg";
import { getActivities } from "./commands/activities";
import { getPidorlist } from "./commands/pidorlist";
import { getBlow } from "./commands/blow";
import { getVote } from "./commands/vote";
import { getUptime } from "./commands/uptime";
import { getTrollVoice } from "./commands/troll-voice";

async function deleteAllCommands(rest: REST) {
    rest.put(Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!), { body: [] }).catch(console.error);

    rest.put(Routes.applicationCommands(CLIENT_ID!), { body: [] }).catch(console.error);

    console.log("Все команды очищены");
}

async function deleteCreateCommands(rest: REST) {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    const pidorlist = await getPidorlist();
    commands.push(...pidorlist);

    const activities = await getActivities();
    commands.push(...activities);

    const blow = await getBlow();
    commands.push(...blow);

    const vote = await getVote();
    commands.push(...vote);

    const uptime = await getUptime();
    commands.push(...uptime);

    const trollVoice = await getTrollVoice();
    commands.push(...trollVoice);

    rest.put(Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!), { body: commands }).catch(console.error);

    console.log("Все команды добавлены");
}

async function main() {
    const rest = new REST({ version: "10" }).setToken(BOT_TOKEN!);

    await deleteAllCommands(rest);

    setTimeout(async () => {
        await deleteCreateCommands(rest);
    }, 1000);
}

main();
