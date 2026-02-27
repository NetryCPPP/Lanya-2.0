const Timer = require('../models/Timer');
const { EmbedBuilder } = require('discord.js');

// Inside your ready event:
setInterval(async () => {
    const expired = await Timer.find({ endTime: { $lte: new Date() } });

    for (const timer of expired) {
        try {
            const user = await client.users.fetch(timer.userId);
            const embed = new EmbedBuilder()
                .setTitle('⏰ Time is Up!')
                .setDescription(`**Reason:** ${timer.reason}`)
                .setThumbnail('https://i.imgur.com/8N95u7E.gif') // Simple clock animation gif
                .setColor('#FF0000');

            await user.send({ 
                content: `Hey <@${user.id}>, your timer finished!`, 
                embeds: [embed] 
            });
        } catch (e) { console.log("Can't DM user"); }
        await Timer.findByIdAndDelete(timer._id);
    }
}, 15000); // Checks every 15 seconds
