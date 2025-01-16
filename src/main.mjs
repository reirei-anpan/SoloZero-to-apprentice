import {
  Client,
  GatewayIntentBits,
  InteractionType,
} from "discord.js";
import cron from "node-cron";
import { sendScheduledMessage} from "./tasks/sendScheduledMessage.mjs";
import { sendReminderMessage } from "./tasks/sendReminderMessage.mjs";
import { sendEndTimeMessage } from "./tasks/sendEndTimeMessage.mjs";
import { handleInteraction } from "./handlers/handleInteraction.mjs";
import { matchUsers } from "./match/matchUsers.mjs";

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
  await handleInteraction(interaction);
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
  if (message.content.toLowerCase() === "end") {
    await sendEndTimeMessage(client);
  }
});

// 毎週火・木・日の21時にメッセージを送信
cron.schedule("0 12 * * 2,4,0", async () => {
  await sendScheduledMessage(client);
});

// 毎週水の12時にメッセージを送信
cron.schedule("0 3 * * 3", async () => {
  await matchUsers(client);
});

// 毎週水の21時50分にメッセージを送信
cron.schedule("50 12 * * 3", async () => {
  await sendReminderMessage(client);
});

// 毎週水の22時30分にメッセージを送信
cron.schedule("30 13 * * 3", async () => {
  await sendEndTimeMessage(client);
});

// Botのログイン
client.login(process.env.TOKEN);
