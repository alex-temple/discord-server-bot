const { discord } = require('../../../config.json');
const { execCmd } = require('../util');

module.exports = {
	name: 'update',
	usage: `${discord.prefix}update <server>`,
	description: 'Attempts to update the specified server',
	execute(msg, args) {
		// fail if no arguments or too many arguments are set
		if (args.length !== 1) return msg.reply(`Command usage: \`${discord.prefix}update <server>\``);

		msg.channel.send('Running command...')
			.then(sentMsg => {
				execCmd(args[0], 'update')
					.then(res => {
						sentMsg.edit(res.error ? 'Error updating server?' : 'Server updated successfully');
					});
			});
	},
};