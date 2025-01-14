import { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } from "discord.js";

export async function sendScheduledMessage(client) {
  try {
    const channelId = "1191988459179614231"; // チャンネルID
    const channel = await client.channels.fetch(channelId);

    if (!channel || !channel.isTextBased()) {
      console.error("指定されたチャンネルが見つからないか、テキストチャンネルではありません。");
      return;
    }

    // Embedを作成
    const embed = new EmbedBuilder()
      .setColor(0x00ff00) // 緑色
      .setDescription("同期と交流したいアプレンティス生は「参加」ボタンを押してね!!");

    // ボタンを作成
    const button = new ButtonBuilder()
      .setCustomId("sample_button")
      .setLabel("参加")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    // メッセージを送信
    await channel.send({
      embeds: [embed],
      components: [row],
    });

    console.log("メッセージを送信しました。");
  } catch (error) {
    console.error("メッセージ送信中にエラーが発生しました:", error);
  }
}
