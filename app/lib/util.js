const Gamedig = require('gamedig');
const Discord = require('discord.js');

exports.queryServer = (server) => {
    return new Promise((resolve, reject) => {
        const { type, host, port } = server.query; // grab query details from config

        Gamedig.query({ // query the server
            type,
            host,
            port
        }).then(res => { // ***IF SERVER RESPONDS***
            const { name, map, players, maxplayers, connect, ping } = res; // grab values from returned JSON
            resolve({
                name,
                map,
                players,
                maxplayers,
                connect,
                ping
            });
        }).catch(err => { // ***IF NO RESPONSE***
            reject("Server offline.");
        });
    });
}

exports.createChannel = (guild, name, options, channel) => {
    return new Promise((resolve, reject) => {
        let { type, userLimit, parent } = options
        if (!channel) {
            guild.channels.create(name, {
                type,
                userLimit,
                parent
            }).then(res => resolve).catch(err => reject);
        }
        else {
            channel.edit({ name }).then(res => resolve).catch(err => reject);
        }
    });
}

exports.statusChannels = (guild, servers, category, logger) => {
    return new Promise((resolve, reject) => {
        // logger.info("Updating status channels");
        let children = category.children;

        Object.keys(servers).forEach(id => {
            let server = servers[id];
            let channel = children.find(ch => ch.name.slice(3) === server.channelName);

            this.queryServer(server)
                .then(res => {
                    this.createChannel(guild, `🟢 ${server.channelName}`, {
                        type: 'voice',
                        userLimit: 0,
                        parent: category
                    }, channel)
                        .then(res => {
                            logger.info(`${server.channelName} updated`);
                        })
                        .catch(err => {
                            logger.error("err");
                        })
                })
                .catch(err => {
                    this.createChannel(guild, `🔴 ${server.channelName}`, {
                        type: 'voice',
                        userLimit: 0,
                        parent: category
                    }, channel)
                        .then(res => {
                            logger.info(`${server.channelName} updated`)
                        })
                        .catch(err => {
                            logger.error("err")
                        });
                });
        });
    });
}