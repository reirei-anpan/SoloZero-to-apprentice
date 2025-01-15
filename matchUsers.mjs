import fs from "fs";

const DB_PATH = "./database.json";
const PAIRS_PATH = "./pairs.json";

export async function matchUsers(client) {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    const channelId = "1191988459179614231";
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      console.error("指定されたチャンネルが見つからないか、テキストチャンネルではありません。");
      return;
    }

    if (data.length < 2) {
      await channel.send("本日はマッチングできませんでした...🥺\nまた、来週応募してね!!");
      return;
    }

    const shuffled = data.sort(() => Math.random() - 0.5);
    const pairs = [];
    const rooms = [
      ":crab: | キャンサールーム",
      ":lion_face: | レオルーム",
      ":turtle: | アクエリアスルーム",
      ":ram: | アリエスルーム",
      ":cow: | タウロスルーム",
    ];
    let roomIndex = 0;

    while (shuffled.length >= 2) {
      const user1 = shuffled.pop();
      const user2 = shuffled.pop();
      pairs.push(`${rooms[roomIndex % rooms.length]}：${user1.username} & ${user2.username}`);
      roomIndex++;
    }

    if (shuffled.length === 1) {
      pairs[pairs.length - 1] += ` と ${shuffled.pop().username}`;
    }
    
    // マッチング結果をファイルに保存
    fs.writeFileSync(PAIRS_PATH, JSON.stringify(pairs, null, 2));

    await channel.send(`:sparkles: 本日のマッチング結果 :sparkles:\n\n--------------------------------\n${pairs.join("\n")}\n--------------------------------\n\n21時になったら、各自でルームに参加してお話ししましょう!!\n夜ご飯やお酒を準備して、リラックスした時間を過ごしてください:beers:\n\n※ 参加が難しくなった場合は、ペアの同期に連絡してね!!`);
  } catch (error) {
    console.error("マッチング処理中にエラーが発生しました:", error);
  }
}
