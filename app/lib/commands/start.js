const { discord } = require('../../../config.json');
const { execCmd } = require('../util');

module.exports = {
	name: 'start',
	usage: `${discord.prefix}start <server>`,
	description: 'Attempts to start the specified server',
	execute(msg, args) {
		// fail if no arguments or too many arguments are set
		if (args.length !== 1) return msg.reply(`Command usage: \`${discord.prefix}start <server>\``);

		msg.channel.send('Running command...')
			.then(sentMsg => {
				execCmd(args[0], 'start')
					.then(res => {
						sentMsg.edit(res.error ? 'Error starting server - is it already running?' : 'Server started successfully');
					});
			});

	},
};