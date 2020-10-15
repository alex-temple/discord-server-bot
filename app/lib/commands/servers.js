/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const { discord, servers } = require('../../../config.json');

module.exports = 	{
	name: 'servers',
	usage: `${discord.prefix}servers`,
	description: 'Returns a list of servers',
	execute(msg, args) {
		const embed = new MessageEmbed() // Create new rich embed to display the server details
			.setColor('#FFE63A')
			.setTitle('Server List')
			.setFooter('Use `!status [server_id]` to query a specific server');

		let serverList = '';
		const ids = Object.keys(servers); // Get object keys for each server

		ids.map(id => {
			const server = servers[id];
			serverList += `**${id}** - ${server.game}\n`;
		});

		embed.addField('~~~~~~~~~~~~~~~~', serverList);
		return msg.channel.send(embed); // Send the embed
	},
};