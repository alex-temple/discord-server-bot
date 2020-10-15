const { discord } = require('../../../config.json');

module.exports = 	{   // Ping command. Just returns pong for testing the bot.
	name: 'ping',
	usage: `${discord.prefix}ping`,
	description: 'Returns pong.',
	execute(msg) {
		const msgTime = msg.createdAt;
		const diff = msgTime - Date.now();
		return msg.reply(`Pong. \n\n_Latency: ${diff}_`);
	},
};