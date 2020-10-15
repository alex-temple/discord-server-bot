const { servers } = require('../../config.json');
const logger = require('./logger');

const { exec } = require('child_process');
const Gamedig = require('gamedig');


// Query specified game server
exports.queryServer = (server) => {
	return new Promise((resolve, reject) => {
		// grab query details from config
		const { type, host, port } = server.query;

		// query the server
		Gamedig.query({
			type,
			host,
			port,
		}).then(res => {
			// grab values from returned JSON
			const { name, map, players, maxplayers, connect, ping } = res;
			resolve({
				name,
				map,
				players,
				maxplayers,
				connect,
				ping,
			});
		}).catch(() => {
			reject('Server offline.');
		});
	});
};

// Create new channel using the specified options
exports.createChannel = (guild, name, options, channel) => {
	return new Promise((resolve, reject) => {
		if (!channel) {
			guild.channels.create(name, options)
				.then(res => resolve(res))
				.catch(err => reject(err));
		}
		else {
			channel.edit({ name })
				.then(res => resolve(res))
				.catch(err => reject(err));
		}
	});
};

// Create/update status channels
exports.statusChannels = (guild, category) => {
	// list of channels under specified category
	const children = category.children;
	// role object for @everyone
	const everyone = guild.roles.everyone;

	// channel creation options
	const options = {
		// channel type voice
		type: 'voice',
		// set permissions - disable @everyone from connecting/speaking
		permissionOverwrites: [
			{
				id: everyone.id,
				allow: [ 'VIEW_CHANNEL' ],
				deny: [ 'CONNECT', 'SPEAK' ],
			},
		],
		// set parent category
		parent: category,
	};

	Object.keys(servers).forEach(id => {
		const server = servers[id];
		const channel = children.find(ch => ch.name.slice(3, server.channelName.length + 3) === server.channelName);

		this.queryServer(server)
			.then(res => {
				this.createChannel(guild, `🟢 ${server.channelName} | ${res.players.length}/${res.maxplayers}`, options, channel)
					.then(() => {
						logger.channels(`${server.channelName} updated (Online)`);
					})
					.catch(err => {
						logger.error(err);
					});
			})
			.catch(() => {
				this.createChannel(guild, `🔴 ${server.channelName} | Offline`, options, channel)
					.then(() => {
						logger.channels(`${server.channelName} updated (Offline)`);
					})
					.catch(err => {
						logger.error(err);
					});
			});
	});
};

// Clean up status channels
exports.cleanup = (category) => {
	const children = category.children;
	logger.info(`Cleaning up category: ${category.name}`);

	const serverList = [];
	Object.keys(servers).forEach(id => {
		serverList.push(servers[id]);
	});

	children.forEach(channel => {
		if (serverList.find(server => server.channelName === channel.name.slice(3, server.channelName.length + 3))) return;
		channel.delete()
			.then(() => {
				logger.channels(`Deleted channel ${channel.name}`);
			})
			.catch(err => {
				logger.error(`Error deleting channel: ${err}`);
			});
	});
};

// execute commands on a server
exports.execCmd = (server, command) => {
	return new Promise((resolve, reject) => {
		const targetServer = servers[server];

		if (!targetServer) reject('Server does not exist');
		if (!Object.prototype.hasOwnProperty.call(targetServer, 'commands')) reject('Server does not support this command');

		exec(targetServer.commands[command], (error, stdout, stderr) => {
			resolve({ error, stdout, stderr });
		});
	});
};