import client from "./index";
import "dotenv/config";

import "./routes/messages.route";
import "./routes/precenses.route";

client.once("ready", () => {
    console.log(`✅ Бот запущен как ${client.user?.tag}`);
});

client.login(process.env.BOT_TOKEN);
