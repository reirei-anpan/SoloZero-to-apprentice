import fs from "fs";
import path from "path";

const DB_PATH = path.resolve("database/event_members.json");
const PAIRS_PATH = path.resolve("database/pairs.json");

export async function sendEndTimeMessage(client) {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    const channelId = "1191988459179614231"; // チャンネルID
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      console.error(
        "指定されたチャンネルが見つからないか、テキストチャンネルではありません。"
      );
      return;
    }
    
    // メンションリストを作成
    const mentions = data
      .filter((user) => user.id) // IDが存在するエントリのみを対象
      .map((user) => `<@${user.id}>`) // 各ユーザーのIDをDiscordのメンション形式に変換
      .join(" ");

    // メッセージを作成
    const message =
      `${mentions}\n\n交流時間終了です!! 相手にお礼を伝えて交流を終わりましょう👏`;

    // メッセージを送信
    await channel.send({
      content: message,
    });

    console.log("終了メッセージを送信しました。");

    // イベント参加者とペア情報を空にする
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
    console.log(`データベース (${DB_PATH}) を初期化しました。`);

    fs.writeFileSync(PAIRS_PATH, JSON.stringify([], null, 2));
    console.log(`ペア情報 (${PAIRS_PATH}) を初期化しました。`);
  } catch (error) {
    console.error("リマインダーメッセージ送信中にエラーが発生しました:", error);
  }
}
