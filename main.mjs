import {
  Client,
  GatewayIntentBits,
  InteractionType,
} from "discord.js";
import cron from "node-cron";
import { sendScheduledMessage} from "./sendScheduledMessage.mjs";
import { sendReminderMessage } from "./sendReminderMessage.mjs";
import { handleInteraction } from "./handleInteraction.mjs";
import { matchUsers } from "./matchUsers.mjs";

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

// "interactionCreate" イベントでボタン処理をハンドリング
client.on("interactionCreate", async (interaction) => {
  await handleInteraction(client);
});

// "messageCreate" イベントでメッセージ処理をハンドリング
client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "post") {
    await sendScheduledMessage(client);
  }
  if (message.content.toLowerCase() === "send") {
    await matchUsers(client);
  }
  if (message.content.toLowerCase() === "reminder") {
    await sendReminderMessage(client);
  }
});

// 毎週月・水・金の21時にメッセージを送信
cron.schedule("0 12 * * 1,3,5", async () => {
  await sendScheduledMessage(client);
});

// 毎週土の12時にメッセージを送信
cron.schedule("0 3 * * 6", async () => {
  await matchUsers(client);
});

// Botのログイン
client.login(process.env.TOKEN);
