import fs from "fs";

const PAIRS_PATH = "./pairs.json";

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

    // pairs.jsonの内容を取得
    let pairs = [];
    if (fs.existsSync(PAIRS_PATH)) {
      const data = fs.readFileSync(PAIRS_PATH, "utf8");
      pairs = JSON.parse(data); // JSON形式をパースして配列に変換
    }

    // pairs.jsonが空の場合の処理
    if (pairs.length === 0) {
      console.log("pairs.jsonにマッチングデータがありません。");
      await channel.send("現在、マッチング結果がありません。");
      return;
    }

    // メッセージを作成
    const message = `:sparkles: 交流10分前のお知らせ :sparkles:\n\n--------------------------------\n${pairs.join(
      "\n"
    )}\n--------------------------------\n\n21時になったら各自ルームに参加して、交流を始めてね!!\n\n※ 参加が難しくなった場合は、ペアの同期に連絡してね!!`;

    // メッセージを送信
    await channel.send({
      content: message,
    });

    console.log("リマインダーメッセージを送信しました。");
  } catch (error) {
    console.error("リマインダーメッセージ送信中にエラーが発生しました:", error);
  }
}
