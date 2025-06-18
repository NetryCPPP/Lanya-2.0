const {
  SlashCommandBuilder,
  Events,
  EmbedBuilder,
} = require('discord.js');

const afkMap = new Map(); // In-memory AFK store

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set your AFK status')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Why are you AFK?')
        .setRequired(false)
    ),

  async execute(interaction) {
    const reason = interaction.options.getString('reason') || 'AFK';
    afkMap.set(interaction.user.id, {
      reason,
      since: Date.now(),
    });

    await interaction.reply({
      content: `✅ You are now AFK: **${reason}**`,
      ephemeral: true,
    });
  },

  // ✅ Handle messageCreate event
  event: {
    name: Events.MessageCreate,
    async execute(message) {
      if (message.author.bot || !message.guild) return;

      // Remove AFK if the user sends a message
      if (afkMap.has(message.author.id)) {
        afkMap.delete(message.author.id);
        await message.reply({
          content: '👋 Welcome back! You are no longer AFK.',
          allowedMentions: { repliedUser: false },
        });
      }

      // Notify if mentioned user is AFK
      for (const [id, afkInfo] of afkMap.entries()) {
        if (message.mentions.users.has(id)) {
          const { reason, since } = afkInfo;
          const duration = Math.floor((Date.now() - since) / 1000);
          const mins = Math.floor(duration / 60);
          const secs = duration % 60;

          const embed = new EmbedBuilder()
            .setColor(0xFFA500)
            .setDescription(
              `💤 <@${id}> is AFK: **${reason}** (*${mins > 0 ? `${mins}m ` : ''}${secs}s ago*)`
            );

          await message.reply({ embeds: [embed] });
          break; // Only notify for the first AFK user
        }
      }
    },
  },
};
