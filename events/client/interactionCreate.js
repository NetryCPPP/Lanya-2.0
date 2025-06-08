const { Events, MessageFlags, InteractionType } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction) {
    const client = interaction.client;

    // Slash command execution
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.error(`❌ No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '❌ There was an error while executing this command!',
            flags: [MessageFlags.Ephemeral],
          });
        } else {
          await interaction.reply({
            content: '❌ There was an error while executing this command!',
            flags: [MessageFlags.Ephemeral],
          });
        }
      }
    }

    // Autocomplete
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (command?.autocomplete) {
        try {
          await command.autocomplete(interaction);
        } catch (error) {
          console.error('Autocomplete error:', error);
          await interaction.respond([]);
        }
      }
    }

    // Modal handler (customId starts with "say-modal")
    if (interaction.type === InteractionType.ModalSubmit && interaction.customId.startsWith('say-modal')) {
      const sayCommand = client.commands.get('say');
      if (sayCommand?.handleModal) {
        try {
          await sayCommand.handleModal(interaction);
        } catch (error) {
          console.error('Modal error:', error);
          await interaction.reply({ content: '❌ Failed to handle modal.', ephemeral: true });
        }
      }
    }
  },
};
