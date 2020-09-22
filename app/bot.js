'use strict';

// Load  config
require('dotenv').config();
const config = require('../config.json');

// Discord
const Discord = require('discord.js');
const token = process.env.BOT_TOKEN;
const commandList = require('./lib/commands');

const bot = new Discord.Client();  // initialise client
bot.commands = new Discord.Collection();

commandList.forEach(command => {
    bot.commands.set(command.name, command);
});

// Bot events
bot.on('ready', () => {
    logger.info(`Logged in as ${bot.user.tag}`);
    bot.user.setPresence({ // Set bot's custom status
        status: 'online',
        activity: {
            name: "with servers"
        }
    }).then(logger.info("Bot status set"))
      .catch(console.error);
});

bot.on('reconnecting', () => {
    logger.info("Reconnecting...");
});

bot.on('message', msg => {
    if (!msg.content.startsWith(config.discord.prefix) || msg.author.bot) return; // check if message starts with command prefix (config.json) or originates from the bot. if so, ignore
    const args = msg.content.slice(config.discord.prefix.length).trim().split(/ +/); // split args
    const cmd = args.shift().toLowerCase();

    if (!bot.commands.has(cmd)) return; // ignore unknown commands [maybe change to an 'unknown command' reply later]

    logger.info(`${msg.author.username} ran command: ${msg.content}`); // Log command usage

    try
    {
        bot.commands.get(cmd).execute(msg, args);
    }
    catch (err)
    {
        logger.error(err);
    }
})

// Logging setup
const winston = require('winston');
const logFormat = winston.format.printf(( { level, msg, timestamp } ) => { // create new log format to include timestamp
    return `${timestamp} :: [${level}]: ${msg}`;
});

const logger = winston.createLogger({ // set up logger - format, files, etc
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    ),
    defaultMeta: {
        service: 'server-bot'
    },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});

if (process.env.NODE_ENV !== 'production') // log to console in dev mode
{
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// LOGIN BOT
bot.login(token);