import { Client, GatewayIntentBits, Partials } from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences
    ],
    allowedMentions: {
        parse: ["users"],
        repliedUser: true
    },
    partials: [Partials.Message, Partials.Reaction, Partials.User],
    presence: {
        status: "online",
        activities: [{ name: "Играет с JS", type: 0 }]
    }
});

export default client;
