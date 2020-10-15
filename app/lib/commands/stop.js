const { discord } = require('../../../config.json');
const { execCmd } = require('../util');

module.exports = {
	name: 'stop',
	usage: `${discord.prefix}stop <server>`,
	description: 'Attempts to stop the specified server',
	execute(msg, args) {
		// fail if no arguments or too many arguments are set
		if (args.length !== 1)  return msg.reply(`Command usage: \`${discord.prefix}stop <server>\``);

		msg.channel.send('Running command...')
			.then(sentMsg => {
				execCmd(args[0], 'stop')
					.then(res => {
						sentMsg.edit(res.error ? 'Error stopping server - is it already stopped?' : 'Server stopped successfully');
					});
			});
	},
};