const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Timer = require('../models/Timer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Manage your persistent DM timers.')
        .addSubcommand(subcommand =>
            subcommand.setName('set').setDescription('Set a timer')
                .addIntegerOption(opt => opt.setName('days').setDescription('Days').setMinValue(0))
                .addIntegerOption(opt => opt.setName('hours').setDescription('Hours').setMinValue(0))
                .addIntegerOption(opt => opt.setName('minutes').setDescription('Minutes').setMinValue(0))
                .addStringOption(opt => opt.setName('reason').setDescription('Reason for timer')))
        .addSubcommand(subcommand =>
            subcommand.setName('list').setDescription('List your active timers'))
        .addSubcommand(subcommand =>
            subcommand.setName('cancel').setDescription('Cancel a timer')
                .addStringOption(opt => opt.setName('id').setDescription('Timer ID from /timer list').setRequired(true))),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        if (sub === 'set') {
            const d = interaction.options.getInteger('days') || 0;
            const h = interaction.options.getInteger('hours') || 0;
            const m = interaction.options.getInteger('minutes') || 0;
            const reason = interaction.options.getString('reason') || 'Timer Expired!';

            if (d + h + m === 0) return interaction.reply({ content: 'Set a time!', ephemeral: true });

            const totalMs = (d * 86400000) + (h * 3600000) + (m * 60000);
            const endTime = new Date(Date.now() + totalMs);

            const newTimer = await Timer.create({ userId: interaction.user.id, reason, endTime });
            
            const embed = new EmbedBuilder()
                .setTitle('⏳ Timer Set')
                .setDescription(`I will DM you <t:${Math.floor(endTime/1000)}:R>.\n**Reason:** ${reason}`)
                .setFooter({ text: `ID: ${newTimer._id}` })
                .setColor('#00FF00');

            return interaction.reply({ embeds: [embed] });
        }

        if (sub === 'list') {
            const timers = await Timer.find({ userId: interaction.user.id });
            if (!timers.length) return interaction.reply('No active timers.');

            const embed = new EmbedBuilder().setTitle('Your Timers').setColor('#5865F2');
            timers.forEach(t => embed.addFields({ name: `ID: ${t._id}`, value: `Ends <t:${Math.floor(t.endTime/1000)}:R>\n${t.reason}` }));
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (sub === 'cancel') {
            const id = interaction.options.getString('id');
            const deleted = await Timer.findOneAndDelete({ _id: id, userId: interaction.user.id });
            return interaction.reply(deleted ? '✅ Timer cancelled.' : '❌ Timer not found.');
        }
    }
};
