import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

export async function sendScheduledMessage(client) {
  try {
    const channelId = "1331597364737216593"; // チャンネルID
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      console.error(
        "指定されたチャンネルが見つからないか、テキストチャンネルではありません。"
      );
      return;
    }

    const button = new ButtonBuilder()
      .setCustomId("participation_button")
      .setLabel("参加")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    // 曜日ごとのメッセージパターン
    const messagesByDay = {
      4: "🪢 アプレンティス生同士で交流したい人を募集開始 🪢\n\n@everyone\n\n次の水曜日、22時から交流したいアプレンティス生は「参加」をクリック!!", // 木曜日
      0: "👫 まだまだ、アプレンティス生同士で交流したい人を募集中 👫\n\n@everyone\n\n次の水曜日、22時から交流したいアプレンティス生は「参加」をクリック!!", // 日曜日
      2: "🚨 最後の募集 🚨\n\n応募期限は「本日 23:50分」まで!!\n\n@everyone\n\n次の水曜日、22時から交流したいアプレンティス生は「参加」をクリック!!", // 火曜日
    };

    const today = new Date().getDay(); // 今日の曜日を取得 (0: 日曜日, 1: 月曜日, 2:火曜日 ...)
    const message =
      messagesByDay[today] || "募集メッセージが設定されていません。";

    await channel.send({
      content: `${message}`,
      components: [row],
    });

    console.log("メッセージを送信しました: 曜日に応じたパターン");
  } catch (error) {
    console.error("メッセージ送信中にエラーが発生しました:", error);
  }
}
