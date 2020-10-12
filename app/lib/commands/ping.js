/* eslint-disable no-unused-vars */
const { discord } = require('../../../config.json');

module.exports = 	{   // Ping command. Just returns pong for testing the bot.
	name: 'ping',
	usage: `${discord.prefix}ping`,
	description: 'Returns pong.',
	execute(msg, args) {
		msg.reply('Pong.');
	},
};