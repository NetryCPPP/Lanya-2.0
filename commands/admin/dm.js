const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send a branded PMC DM to a specific user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to DM')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message to send')
        .setRequired(true))
    // Optional: only admins can use this
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const text = interaction.options.getString('message');

    // 🟡 Replace this link with your actual PMC logo or banner URL
    const PMC_LOGO = 'https://cdn.discordapp.com/attachments/1059799472596598807/1425896504119398451/welcome.gif?ex=68eb3b5a&is=68e9e9da&hm=1efbdff86225f5f43f325454d0f2051dc68178a662fce22495e86693c589e15d&'; 

    // 🧱 Branded Embed
    const embed = new EmbedBuilder()
      .setColor(0xffd700) // Gold color for PMC
      .setAuthor({ name: 'Team PMC', iconURL: PMC_LOGO })
      .setTitle('📢 Official Message from Team PMC')
      .setDescription(text)
      .setThumbnail(PMC_LOGO)
      .setFooter({
        text: `Sent by ${interaction.user.tag} • Powered by Team PMC`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    try {
      await user.send({ embeds: [embed] });
      await interaction.reply({
        content: `✅ PMC-styled DM sent to **${user.tag}**`,
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '❌ Could not send DM (user may have DMs closed).',
        ephemeral: true,
      });
    }
  },
};
