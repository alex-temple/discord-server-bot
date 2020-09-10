const config = require('../../config.json');
const prefix = config.discord.prefix;
const servers = config.servers;

const Discord = require('discord.js');
const fetch = require('node-fetch');

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
                .setColor('#F07339')
                .setTitle('Server List')
                .setDescription(`Use \`${prefix}status <server_id>\` to view details on a specific server.`)
                .addField('\u200b', '\u200b');

            const ids = Object.keys(servers); // Get object keys for each server
            ids.map(id => {
                const server = servers[id];
                embed.addField(id, `${server.game}\u200b`, false); // Add a field for each server
            });
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
                msg.reply(`Usage: \`${prefix}status <server_id>\`.\nUse \`${prefix}!servers\` to get a list of IDs`); 
                return;
            }

            const id = args[0];
            const server = servers[id];

            if (!server) // check if server exists.
            {
                msg.reply(`Server with ID ${id} not found.`);
                return;
            }

            // FETCH SERVER STATUS
            const protocol = server.query.method;
            const embed = new Discord.MessageEmbed()
                .setTitle(server.serverName)
                .setThumbnail(server.image);

            switch (protocol)
            {
                case 'http':
                    // serverHttp(server.query.url, (res) => {
                    //     console.log(res);
                    // });
                    let settings = {method: "Get"};
                    fetch(server.query.url, settings).then(res => res.json()).then(json => {
                        const { game, status } = json;
                        online = !status.error ? "🟢  Online" : "🔴  Offline";
                        embed.setColor('#34CD2B')
                            .setDescription(online)
                            .addField(
                                'Status:', 
                                `Game: ${game.info.game}
                                Players online: ${game.info.player_count}/${game.info.max_players}
                                Map: ${game.info.map}
                                Password: ${!!game.info.password_protected}
                                VAC: ${!!game.info.vac_enabled}`, 
                                false
                            );
                        msg.channel.send(embed);
                    });
                    break;
                case 'rcon':
                    embed.setColor('DARK_RED')
                        .addField("Error", "RCON querying is not implemented yet.", false);
                    msg.channel.send(embed);
                    break;
            }
        }
    }
];

module.exports = commandList;

const serverHttp = (url, cb) => {
    let settings = {method: "Get"};
    fetch(url, settings).then(res => res.json()).then(json => {
        cb(json);
    });
}