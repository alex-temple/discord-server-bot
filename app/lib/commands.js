// load config
const config = require('../../config.json');
const prefix = config.discord.prefix;
const servers = config.servers;

const {queryServer} = require('./util');
const Discord = require('discord.js');

const commandList = [
    {   // Ping command. Just returns pong for testing the bot.
        name: "ping",
        usage: `${prefix}ping`,
        description: "Returns pong.",
        execute (msg, args) {
            msg.reply('Pong.');
        }
    },
    {
        name: "servers",
        usage: `${prefix}servers`,
        description: "Returns a list of servers",
        execute (msg, args) {
            const embed = new Discord.MessageEmbed() // Create new rich embed to display the server details
                .setColor('#FFE63A')
                .setTitle('Server List')
                .setFooter('Use `!status [server_id]` to query a specific server');

            let serverList = '';
            const ids = Object.keys(servers); // Get object keys for each server
            
            ids.map(id => {
                const server = servers[id];
                serverList += `**${id}** - ${server.game}\n`;
            });

            embed.addField("💠💠💠💠💠💠💠💠", serverList);
            msg.channel.send(embed); // Send the embed
        }
    },
    {
        name: "status",
        usage: `${prefix}status <server_id>`,
        description: "Displays status information for the specified server",
        execute (msg, args) {
            // CHECK THAT SERVER ID IS SET AND EXISTS
            if (args.length == 0 || args.length > 1) // if no args supplied, or too many args supplied
            {
                msg.reply(`Usage: \`${prefix}status <server_id>\`.\nUse \`${prefix}servers\` to get a list of IDs`); 
                return;
            }

            const id = args[0];
            const server = servers[id];

            if (!server) // check if server exists.
            {
                msg.reply(`Server with ID ${id} not found.`);
                return;
            }

            const embed = new Discord.MessageEmbed().setThumbnail(server.image); // create embed object and set thumbnail

            queryServer(server).then(res => { // If server online, populate embed with details and post it
                embed.setColor('#16C60C')
                     .setTitle(res.name)
                     .setDescription("🟢  Online")
                     .addField('Status', `Players: ${res.players.length}/${res.maxplayers}\nMap: ${res.map}\nPing: ${res.ping}`)
                     .setFooter(`Connect: ${res.connect}`);
                msg.channel.send(embed);
            }).catch(err => { // If server is offline, send error embed
                embed.setColor('#E81224')
                     .setTitle(server.hostName)
                     .setDescription("🔴  Offline");
                msg.channel.send(embed);
            });
        }
    }
];

module.exports = commandList;