import { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import cron from "node-cron";

// Discord Botの初期化
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
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
      console.error("指定されたチャンネルが見つからないか、テキストチャンネルではありません。");
      return;
    }

    // ボタンを作成
    const button = new ButtonBuilder()
      .setCustomId("sample_button")
      .setLabel("リアクションを追加！")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    // メッセージを送信
    await channel.send({
      content: "こんにちは！週の始まりです。頑張りましょう！",
      components: [row],
    });

    console.log("メッセージを送信しました。");
  } catch (error) {
    console.error("メッセージ送信中にエラーが発生しました:", error);
  }
}

// 毎週月曜日の夜21時にメッセージを送信
cron.schedule("0 21 * * 1", sendScheduledMessage);

// "post"と投稿されたらメッセージを送信
client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "post") {
    await sendScheduledMessage();
  }
});

// Botのログイン
client.login(process.env.TOKEN);
