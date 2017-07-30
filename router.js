'use strict';

const Telegram = require('telegram-node-bot');
const tg = new Telegram.Telegram('404732308:AAFEvTTbvBTodGAzG6FB2qfYC-ItPO8xyWY');
const competitionCtrl = require('./competition'),
TextCommand = Telegram.TextCommand;

module.exports = function(){
	tg.router.when(
		new TextCommand('/start', 'startCommand'),
		competitionCtrl
	).when(
		new TextCommand('/compete', 'competeCommand'),
		competitionCtrl
	);
}
