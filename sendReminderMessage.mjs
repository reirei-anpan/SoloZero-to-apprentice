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
    // const pairs = await matchUsers(client, false); // falseフラグで送信せずペアのみ取得

    // メッセージを送信
    const message = `:sparkles: 交流10分前のお知らせ :sparkles:`

    await channel.send({
      content: message,
    });

    console.log("リマインダーメッセージを送信しました。");
  } catch (error) {
    console.error("リマインダーメッセージ送信中にエラーが発生しました:", error);
  }
}