import client from "./index";

import "./register-slash-commands/main";

import "./routes/precenses.route";
import "./routes/interaction.route";

import { BOT_TOKEN } from "./cfg";

client.once("ready", () => {
    console.log(`✅ Бот запущен как ${client.user?.tag}`);
});

client.login(BOT_TOKEN!);
