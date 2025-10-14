import client from "./index";
import "dotenv/config";

import "./routes/messages.route";

client.once("ready", () => {
    console.log(`✅ Бот запущен как ${client.user?.tag}`);
});

client.login(process.env.BOT_TOKEN);
