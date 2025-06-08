const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message you want the bot to say')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages), // Optional: who can use the command
  async execute(interaction) {
    const message = interaction.options.getString('message');

    // Check if message is too long
    if (message.length > 2000) {
      return interaction.reply({ content: '❌ Message is too long. Max 2000 characters allowed.', ephemeral: true });
    }

    // Reply with the user's message
    await interaction.reply({ content: message });
  },
};
