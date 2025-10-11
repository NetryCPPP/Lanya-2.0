const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send a DM to a specific user (with embed)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to DM')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message to send')
        .setRequired(true))
    // Optional: only admins can use
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const text = interaction.options.getString('message');

    // 🧱 Build the embed
    const embed = new EmbedBuilder()
      .setColor(0x00BFFF) // Aqua Blue
      .setTitle('📩 Message from the Server Team')
      .setDescription(text)
      .setFooter({ text: `Sent by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    try {
      await user.send({ embeds: [embed] });
      await interaction.reply({ content: `✅ Embed DM sent to **${user.tag}**`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Could not send DM (user might have DMs disabled).', ephemeral: true });
    }
  },
};
