const { Events, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
  name: Events.MessageCreate,
  once: false,

  async execute(message) {
    if (message.author.bot) return;

    // 📌 Bot mention response
    const mention = new RegExp(`^<@!?${message.client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      try {
        const commands = await message.client.application.commands.fetch();
        const helpCommand = commands.find((cmd) => cmd.name === 'help');
        const helpCommandId = helpCommand ? helpCommand.id : 'unknown';

        const mentionEmbed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setDescription(
            `Hey ${message.author}, I'm Lanya, I use \`/\` commands.\nCheck out my commands, type </help:${helpCommandId}>`
          )
          .setTimestamp();

        await message.reply({ embeds: [mentionEmbed] });
      } catch (error) {
        console.error('Error fetching commands:', error);
      }
    }

    // 📌 Load messageCreate handlers from commands (e.g. afk.js)
    const utilityPath = path.join(__dirname, '../../commands/utility');
    const commandFiles = fs.readdirSync(utilityPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(path.join(utilityPath, file));

      if (
        command.event?.name === Events.MessageCreate &&
        typeof command.event.execute === 'function'
      ) {
        try {
          await command.event.execute(message);
        } catch (err) {
          console.error(`❌ Error in ${file}'s messageCreate event:`, err);
        }
      }
    }
  },
};
