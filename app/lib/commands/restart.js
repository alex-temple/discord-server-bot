const { discord } = require('../../../config.json');
const { execCmd } = require('../util');

module.exports = {
	name: 'restart',
	usage: `${discord.prefix}restart <server>`,
	description: 'Attempts to restart the specified server',
	execute(msg, args) {
		// fail if no arguments or too many arguments are set
		if (args.length !== 1) return msg.reply(`Command usage: \`${discord.prefix}restart <server>\``);

		msg.channel.send('Running command...')
			.then(sentMsg => {
				execCmd(args[0], 'restart')
					.then(res => {
						sentMsg.edit(res.error ? 'Error restarting server' : 'Server restarted successfully');
					});
			});
	},
};