const { servers } = require('../../config.json');
const Gamedig = require('gamedig');
const logger = require('./logger');

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
	const children = category.children;

	Object.keys(servers).forEach(id => {
		const server = servers[id];
		const channel = children.find(ch => ch.name.slice(3, server.channelName.length + 3) === server.channelName);

		this.queryServer(server)
			.then(res => {
				this.createChannel(guild, `🟢 ${server.channelName} | ${res.players.length}/${res.maxplayers}`, {
					type: 'voice',
					userLimit: 0, // THIS CREATES UNLIMITED SLOTS, REMOVE JOIN PERMS FROM @EVERYONE INSTEAD
					parent: category,
				}, channel)
					.then(() => {
						logger.channels(`${server.channelName} updated (Online)`);
					})
					.catch(err => {
						logger.error(err);
					});
			})
			.catch(() => {
				this.createChannel(guild, `🔴 ${server.channelName} | Offline`, {
					type: 'voice',
					userLimit: 0, // THIS CREATES UNLIMITED SLOTS, REMOVE JOIN PERMS FROM @EVERYONE INSTEAD
					parent: category,
				}, channel)
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