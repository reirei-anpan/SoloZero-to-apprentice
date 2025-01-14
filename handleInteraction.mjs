import fs from "fs";

const DB_PATH = "./database.json";

export async function handleInteraction(interaction) {
  if (
    interaction.type === interaction.MessageComponent &&
    interaction.customId === "sample_button"
  ) {
    try {
      await interaction.deferReply({ ephemeral: true }); // 応答を保留状態にする

      if (!interaction.guild) {
        await interaction.editReply({
          content: "この操作はサーバー内でのみ実行可能です。",
        });
        return;
      }

      const user = interaction.user;
      const guild = interaction.guild;
      const member = await guild.members.fetch(user.id);
      const nickname = member.nickname || user.username;

      const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
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

      await interaction.editReply({
        content: "参加が記録されました！",
      });
    } catch (error) {
      console.error("データベース保存中にエラーが発生しました:", error);
      if (!interaction.replied) {
        await interaction.editReply({
          content: "エラーが発生しました。もう一度お試しください。",
        });
      }
    }
  }
}
