import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { matchUsers } from "./matchUsers.mjs"; // マッチング結果を取得

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

export async function sendReminderMessage(client) {
  try {
    const channelId = "1191988459179614231"; // チャンネルID
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      console.error(
        "指定されたチャンネルが見つからないか、テキストチャンネルではありません。"
      );
      return;
    }

    // マッチング結果を取得
    const pairs = await matchUsers(client, false); // falseフラグで送信せずペアのみ取得

    // メッセージを送信
    const message = `:sparkles: 交流10分前のお知らせ :sparkles:

${pairs.join("\n")}`;

    await channel.send({
      content: message,
    });

    console.log("リマインダーメッセージを送信しました。");
  } catch (error) {
    console.error("リマインダーメッセージ送信中にエラーが発生しました:", error);
  }
}
