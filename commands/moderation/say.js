const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ChannelType,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Open a prompt to make the bot say something')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Optional channel where the message will be sent')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),

  // Called when the /say command is used
  async execute(interaction) {
    const targetChannel = interaction.options.getChannel('channel');

    const modal = new ModalBuilder()
      .setCustomId(`say-modal|${targetChannel ? targetChannel.id : 'same'}`)
      .setTitle('Say Something');

    const messageInput = new TextInputBuilder()
      .setCustomId('say-message')
      .setLabel('What should the bot say?')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Type your message here...')
      .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(messageInput);
    modal.addComponents(actionRow);

    // Show the modal (this also counts as responding to the interaction)
    await interaction.showModal(modal);
  },

  // Called when the modal is submitted
  async handleModal(interaction) {
    const messageContent = interaction.fields.getTextInputValue('say-message');
    const [, channelId] = interaction.customId.split('|');

    const channelToSend =
      channelId === 'same'
        ? interaction.channel
        : interaction.guild.channels.cache.get(channelId);

    if (!channelToSend || !channelToSend.isTextBased()) {
      return interaction.reply({
        content: '❌ The selected channel is invalid or not text-based.',
        ephemeral: true,
      });
    }

    try {
      await channelToSend.send({ content: messageContent });
      await interaction.reply({
        content: `✅ Message sent to ${channelToSend.toString()}`,
        ephemeral: true,
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      await interaction.reply({
        content: '❌ Failed to send the message.',
        ephemeral: true,
      });
    }
  },
};
