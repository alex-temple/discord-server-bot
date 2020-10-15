const fs = require('fs');
const { discord } = require('../../../config.json');

const cmdFiles = fs.readdirSync(__dirname).filter(file => (file.endsWith('.js') && !file.includes('help')));

module.exports = {
	name: 'Help',
	usage: `${discord.prefix}help`,
	description: 'Lists available commands',
	execute(msg) {
		msg.reply(cmdFiles);
	},
};