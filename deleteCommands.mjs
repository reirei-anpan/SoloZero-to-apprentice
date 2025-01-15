import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

const BOT_TOKEN = process.env.TOKEN;
const CLIENT_ID = "1327916182770290720";

const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);

(async () => {
  try {
    // グローバルコマンドを削除
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
    console.log("グローバルコマンドを削除しました！");
  } catch (error) {
    console.error("グローバルコマンド削除中にエラーが発生しました:", error);
  }
})();
