const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const axios = require('axios');
const TLANSLATE_API_URL = 'https://oji.itstom.dev/api/translate';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oji-tlanslate')
    .setDescription('おじさん構文に変換します')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換したいテキストを入力')
        .setRequired(true)),
  
  async execute(interaction) {
    const inputText = interaction.options.getString('text');
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const response = await axios.post(TLANSLATE_API_URL, { text: inputText }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const translated = response.data?.translation ?? '翻訳結果が見つかりません';

      const embed = new EmbedBuilder()
        .addFields(
          { name: '📝 入力テキスト', value: inputText },
          { name: '✅ 翻訳', value: translated }
        )
        .setColor('#6596e3')
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: 'エラーが発生しました',
      });
    }
  }
};