# ServerBot

A discord bot for managing game servers.

## Config

ServerBot uses [Gamedig](https://www.npmjs.com/package/gamedig) to query servers. The list of supported games and returned data can be found on its NPM page.

The `discord` section of config.json is used for setting up your command prefix (default `!`) and specifying where to create status channels (Not yet implemented).

To add a new server, create a new entry in the `servers` section of config.json matching the format below. The initial key for the entry is used to query the server - e.g. in the below example, the query command will be `!query ark`

```json
"ark": {
    "image": "https://i.imgur.com/dN2kZ0M.png",
    "game": "Ark: Survival Evolved",
    "channelName": "STATUS CHANNEL NAME",
    "hostName": "SERVER NAME",
    "query": {
        "type": "arkse",
        "host": "IP",
        "port": "PORT"
    }
		},
		"commands": {
			"start": "/path/to/server/file start",
			"stop": "/path/to/server/file stop",
			"restart": "/path/to/server/file restart",
			"update": "/path/to/server/file update"
		}
}
```

## Commands

`!ping` - Returns pong. Used for testing.

`!servers` - Returns a list of servers and their IDs as defined in config.json

`!query [server]` - Queries the specified server and displays the response data in a rich embed object. Server ID can be found through `!servers` command.
<<<<<<< Updated upstream
=======

`!start [server]` - Runs the start command in config.json

`!stop [server]` - Runs the stop command in config.json

`!restart [server]` - Runs the restart command in config.json

`!update [server]` - Runs the update command in config.json

`!help` - As of now just prints a list of commands, will eventually print a list of commands and usage.
>>>>>>> Stashed changes

## Status Channels

The bot can create unjoinable voice channels to indicate the status of your servers. To do this, set `createStatusChannels` to *true* in config.json, and also specify your guild ID and category ID.

The bot will create a voice channel for each server listed in config.json, using the `channelName` field as the name. Example:

![status channels](https://i.imgur.com/hnfAyfn.png)

The bot will also remove any channels under the specified category which do not match any servers in config.json.

## Planned Features

-  ~~**Status Channels** - create (unjoinable) voice channels under the category specified in config.json to quickly view online/offline status without running the command.~~

- **Server controls** - specify commands in config.json to start/stop the server, etc.
- ~~**Server controls** - specify commands in config.json to start/stop the server, etc.~~

- **RCON** - run RCON commands through the bot for supported games.

- **Raw data** - specify data to load from the `raw` object. See Gamedig for more info.

- **Docker image** - create a Dockerfile to run the bot in a container. Will require a couple of workarounds to also allow for starting/stopping the server

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)
