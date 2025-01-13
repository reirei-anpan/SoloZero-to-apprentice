// main.mjs
import {
  Client,
  GatewayIntentBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  InteractionType,
} from "discord.js";
import cron from "node-cron";
import fs from "fs";

// データベースファイルのパス
const DB_PATH = "./database.json";

// データベース初期化
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

// Discord Botの初期化
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Botが起動した際の処理
client.on("ready", () => {
  console.log(`${client.user.tag} がログインしました！`);
});

// メッセージ送信ロジック
async function sendScheduledMessage() {
  try {
    // チャンネルIDを指定
    const channelId = "1191988459179614231"; // ここに送信したいテキストチャンネルのIDを設定
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      console.error(
        "指定されたチャンネルが見つからないか、テキストチャンネルではありません。"
      );
      return;
    }

    // ボタンを作成
    const button = new ButtonBuilder()
      .setCustomId("sample_button")
      .setLabel("参加")
      .setStyle(ButtonStyle.Success); // 緑系のボタン

    const row = new ActionRowBuilder().addComponents(button);

    // メッセージを送信
    await channel.send({
      content: "同期と交流したいアプレンティス生は「参加」ボタンを押してね!!",
      components: [row],
    });

    console.log("メッセージを送信しました。");
  } catch (error) {
    console.error("メッセージ送信中にエラーが発生しました:", error);
  }
}

// ボタンが押された時の処理
client.on("interactionCreate", async (interaction) => {
  if (
    interaction.type === InteractionType.MessageComponent &&
    interaction.customId === "sample_button"
  ) {
    try {
      const user = interaction.user;
      const guild = interaction.guild;
      const member = await guild.members.fetch(user.id); // メンバー情報を取得
      const nickname = member.nickname || user.username; // ニックネームが設定されていない場合はユーザー名を使用

      // ユーザー情報をデータベースに保存
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
        console.log(
          `ユーザー情報はすでに保存されています: ${nickname} (${user.id})`
        );
      }

      // ボタン押下に成功したことを通知
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
});


// マッチング処理
async function matchUsers() {
  try {
    const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));

    // チャンネルIDを指定
    const channelId = "1191988459179614231"; // ここに送信したいテキストチャンネルのIDを設定
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      console.error(
        "指定されたチャンネルが見つからないか、テキストチャンネルではありません。"
      );
      return;
    }

    // マッチングに必要なユーザーが不足している場合
    if (data.length < 2) {
      await channel.send("本日はマッチングできませんでした...🥺\nまた、来週応募してね!!");
      return; // 処理を中止
    }

    const shuffled = data.sort(() => Math.random() - 0.5); // ユーザーをシャッフル
    const pairs = [];

    while (shuffled.length >= 2) {
      const user1 = shuffled.pop();
      const user2 = shuffled.pop();
      pairs.push(`${user1.username} と ${user2.username}`);
    }

    if (shuffled.length === 1) { // ユーザーが奇数の場合、最後の1人を最終ペアに追加
      const lastUser = shuffled.pop();
      if (pairs.length > 0) {
        pairs[pairs.length - 1] += ` と ${lastUser.username}`;
      }
    }

    // マッチング結果を送信
    if (pairs.length > 0) {
      await channel.send(
        `本日のマッチング結果:\n${pairs.join("\n")}`
      );
      console.log("マッチング結果を送信しました。");
    }
  } catch (error) {
    console.error("マッチング処理中にエラーが発生しました:", error);
  }
}



// 毎週月・水・金 の夜21時にメッセージを送信
cron.schedule("0 21 * * 1,3,5", async () => {
  await sendScheduledMessage();
});

// "post"と投稿されたらメッセージを送信
client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "post") {
    await sendScheduledMessage();
  }
});

// "post"と投稿されたらメッセージを送信
client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "send") {
    await matchUsers();
  }
});


// Botのログイン
client.login(process.env.TOKEN);
