'use strict';

///// DISCORD BOT CONFIG /////
const { discord } = require('../../config.json');
const Discord = require('discord.js');
const fs = require('fs');
const logger = require('./logger');
const { statusChannels, cleanup } = require('./util');

const cmdFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));
logger.cmd(`Command files found: ${cmdFiles}`);

const bot = new Discord.Client();  // initialise client
bot.commands = new Discord.Collection();  // create collection for command list

for (const file of cmdFiles)
{
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

// Events
bot.on('ready', () => { // fired when the bot first logs in
	logger.info(`Logged in as ${bot.user.tag}`);
	bot.user.setPresence({ // Set bot's custom status ("Playing with servers")
		status: 'online',
		activity: {
			name: 'with servers',
		},
	}).then(logger.info('Bot status set'))
		.catch(err => { logger.error(err); });

	if (discord.createStatusChannels) // check if the bot is set to create status channels
	{
		const { guildID, categoryID } = discord;
		// grab guild and category objects, and start updating channels
		bot.guilds.fetch(guildID).then(guild => {
			const category = guild.channels.resolve(categoryID);

			// generate initial channels
			cleanup(category);
			statusChannels(guild, category);
			// refresh channels every 60s
			bot.setInterval(() => {
				statusChannels(guild, category);
			}, 60000);
		});
	}
});

// fired when a text message is posted
bot.on('message', msg => {
	if (!msg.content.startsWith(discord.prefix) || msg.author.bot) return; // check if message starts with command prefix (config.json) or originates from the bot. if so, ignore
	const args = msg.content.slice(discord.prefix.length).trim().split(/ +/); // remove outside spaces and split args (regex to handle multiple spaces between args)
	const cmd = args.shift().toLowerCase(); // remove the command from the args array, and set it as its own variable

	// unknown command handler
	if (!bot.commands.has(cmd))
	{
		logger.warn(`${msg.author.username} tried to run unknown command: ${msg.content}`);
		return msg.reply(`Unknown command \`${cmd}\``);
	}

	// Log command usage
	logger.cmd(`${msg.author.username} ran command: ${msg.content}`);

	try
	{
		bot.commands.get(cmd).execute(msg, args); // call the 'execute' method on the command
	}
	catch (err)
	{
		logger.error(err);
	}
});

bot.on('error', (err) => { // fired when the bot encounters an error
	logger.error(err);
});

module.exports = bot;