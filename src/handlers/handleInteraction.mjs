import { InteractionType } from "discord.js";

import path from "path";
import fs from "fs";

const DB_PATH = path.resolve("database/event_members.json");

export async function handleInteraction(interaction) {
  if (
    interaction.type === InteractionType.MessageComponent &&
    interaction.customId === "participation_button"
  ) {
    try {
      const user = interaction.user;
      const guild = interaction.guild;
      const member = await guild.members.fetch(user.id);
      const nickname = member.nickname || user.username;

      // データベースの読み込み
      let data;
      try {
        const fileContent = fs.readFileSync(DB_PATH, "utf8");
        data = fileContent ? JSON.parse(fileContent) : [];
      } catch (error) {
        console.error("データベース読み込み中にエラーが発生しました:", error);
        data = []; // エラーが発生した場合は空配列で初期化
      }
      
      // ユーザー情報の保存
      if (!data.find((entry) => entry.id === user.id)) {
        data.push({
          id: user.id,
          username: user.username,
          nickname,
          timestamp: new Date().toISOString(),
        });
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        console.log(`ユーザー情報を保存しました: ${nickname} (${user.id})`);
      } else {
        console.log(`ユーザー情報はすでに保存されています: ${nickname} (${user.id})`);
      }

      await interaction.reply({
        content: "参加が記録されました！",
        ephemeral: true,
      });
    } catch (error) {
      console.error("データベース保存中にエラーが発生しました:", error);
      await interaction.reply({
        content: "エラーが発生しました。もう一度お試しください。",
        ephemeral: true,
      });
    }
  }
}