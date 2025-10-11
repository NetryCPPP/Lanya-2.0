const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send a DM to a specific user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to DM')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message to send')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const text = interaction.options.getString('message');

    try {
      await user.send(text);
      await interaction.reply({ content: `✅ DM sent to ${user.tag}`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to send DM (user might have DMs closed).', ephemeral: true });
    }
  },
};
