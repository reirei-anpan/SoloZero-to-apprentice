import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

export async function sendScheduledMessage(client) {
  try {
    const channelId = "1191988459179614231"; // チャンネルID
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      console.error(
        "指定されたチャンネルが見つからないか、テキストチャンネルではありません。"
      );
      return;
    }

    const button = new ButtonBuilder()
      .setCustomId("sample_button")
      .setLabel("参加")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    // 曜日ごとのメッセージパターン
    const messagesByDay = {
      1: "🪢 同期と話したい人を募集開始 🪢\n\n今週の土曜日、21時から同期と交流したいアプレンティス生は「参加」をクリック!!", // 月曜日
      3: "👫 まだまだ、同期と話したい人を募集中 👫\n\n今週の土曜日、21時から同期と交流したいアプレンティス生は「参加」をクリック!!", // 水曜日
      5: "🚨 最後の募集 🚨\n\n応募期限は「本日 23:50分」まで!!\n\n今週の土曜日、21時から同期と交流したいアプレンティス生は「参加」をクリック!!", // 金曜日
    };

    const today = new Date().getDay(1); // 今日の曜日 (0: 日曜日, 1: 月曜日, ...)
    const message =
      messagesByDay[today] || "募集メッセージが設定されていません。";

    await channel.send({
      content: `${message}\n\n`, // テキストとボタンの間に空行を追加
      components: [row],
    });

    console.log("メッセージを送信しました: 曜日に応じたパターン");
  } catch (error) {
    console.error("メッセージ送信中にエラーが発生しました:", error);
  }
}
