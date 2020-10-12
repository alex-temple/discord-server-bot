'use strict';
// Load config
require('dotenv').config();
const token = process.env.BOT_TOKEN;

// Load bot & login
const bot = require('./lib/bot');
bot.login(token);