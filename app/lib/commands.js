// load config
const config = require('../../config.json');
const prefix = config.discord.prefix;
const servers = config.servers;

const Discord = require('discord.js');
const fetch = require('node-fetch');
const Gamedig = require('gamedig');

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

            embed.addField("💠", serverList)
                 .addField('\u200b', '\u200b');
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

            queryServer(server).then(res => {
                msg.channel.send(res);
            }).catch(err => {
                msg.channel.send(err);
            });
        }
    }
];

const queryServer = (server) => {
    return new Promise((resolve, reject) => {
        const {type, host, port} = server.query; // grab query details from config
        const embed = new Discord.MessageEmbed() // create embed object and set thumbnail
            .setThumbnail(server.image);

        Gamedig.query({ // query the server
            type,
            host,
            port
        }).then (res => { // ***IF SERVER RESPONDS***
            const {name, map, players, maxplayers, connect, ping} = res; // grab global return values and raw object from the response

            // populate the rest of the embed object using data from the query
            embed.setColor('#16C60C')
                 .setTitle(name)
                 .setDescription("🟢  Online")
                 .addField('Status', `Players: ${players.length}/${maxplayers}\nMap: ${map}\nPing: ${ping}`)
                 .setFooter(`Connect: ${connect}`);
                 resolve(embed);
        }).catch (err => { // ***IF NO RESPONSE***
            embed.setColor('#E81224')
                 .setTitle(server.hostName)
                 .setDescription("🔴  Offline");
            reject(embed);
        });
    });
}

module.exports = commandList;