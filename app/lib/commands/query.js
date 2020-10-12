/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const { queryServer } = require('../util');
const { discord, servers } = require('../../../config.json');

module.exports = 	{
	name: 'query',
	usage: `${discord.prefix}query <server_id>`,
	description: 'Displays status information for the specified server',
	execute(msg, args) {
		// CHECK THAT SERVER ID IS SET AND EXISTS
		if (args.length == 0 || args.length > 1) // if no args supplied, or too many args supplied
		{
			msg.reply(`Usage: \`${discord.prefix}query <server_id>\`.\nUse \`${discord.prefix}servers\` to get a list of IDs`);
			return;
		}

		const id = args[0];
		const server = servers[id];

		if (!server) // check if server exists.
		{
			msg.reply(`Server with ID ${id} not found.`);
			return;
		}

		const embed = new MessageEmbed().setThumbnail(server.image); // create embed object and set thumbnail

		queryServer(server).then(res => { // If server online, populate embed with details and post it
			embed.setColor('#16C60C')
				.setTitle(res.name)
				.setDescription('🟢  Online')
				.addField('Status', `Players: ${res.players.length}/${res.maxplayers}\nMap: ${res.map}\nPing: ${res.ping}`)
				.setFooter(`Connect: ${res.connect}`);
			msg.channel.send(embed);
		}).catch(err => { // If server is offline, send error embed
			embed.setColor('#E81224')
				.setTitle(server.hostName)
				.setDescription('🔴  Offline');
			msg.channel.send(embed);
		});
	},
};