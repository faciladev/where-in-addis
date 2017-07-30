'use strict';

const Telegram = require('telegram-node-bot');

const TelegramBaseController = Telegram.TelegramBaseController;

class OtherwiseController extends TelegramBaseController {
    handle($) {
        $.sendMessage('Hmm...not sure what you mean by that. Would you like to /start again?');
    }
}

module.exports = new OtherwiseController();