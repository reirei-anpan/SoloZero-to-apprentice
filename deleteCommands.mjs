import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

const BOT_TOKEN = process.env.TOKEN; // Botのトークン
const CLIENT_ID = "1327916182770290720";
const GUILD_ID = "1191988459179614228";

const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);

(async () => {
  try {
    // サーバー内のすべてのスラッシュコマンドを削除
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: [],
    });
    console.log("サーバー内のスラッシュコマンドを削除しました！");
  } catch (error) {
    console.error("スラッシュコマンド削除中にエラーが発生しました:", error);
  }
})();
