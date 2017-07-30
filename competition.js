'use strict';

const Telegram = require('telegram-node-bot');
const InputFile = Telegram.InputFile;
const Api = new Telegram.TelegramApi('404732308:AAFEvTTbvBTodGAzG6FB2qfYC-ItPO8xyWY');
const File = Telegram.Models.File;

const adminIds = [376351761];

const TelegramBaseController = Telegram.TelegramBaseController;

class CompetitionController extends TelegramBaseController {

	startHandler($){
		let welcomeText = 'Welcome to Where in Addis picture competition.\n\n';
		welcomeText += 'To begin competition /compete \n\n';
		$.sendMessage(welcomeText);
	}

	competeHandler($){
		competitionMenu($);
	}

	get routes(){
		return {
			'startCommand': 'startHandler',
			'competeCommand': 'competeHandler'
		}
	}
}

const form = {
	pictures: {
    	q: 'Upload your winning photograph',
    	error: 'sorry, wrong input',
	    validator: (message, callback) => {
		    if(message.photo) {
			    callback(true, message.photo) 
			    return
		    }

		    callback(false)
	    }
    },

    competitor: {
	    q: 'Enter your full name',
	    error: 'sorry, wrong input',
	    validator: (message, callback) => {
		    if(message.text) {
			    callback(true, message.text)
			    return
		    }

		    callback(false)
	    }
    },

    place: {
	    q: 'Enter location',
	    error: 'sorry, wrong input',
	    validator: (message, callback) => {
		    if(message.text) {
			    callback(true, message.text) 
			    return
		    }

		    callback(false)
	    }
    },

    business_name: {
    	q: 'Enter business name',
    	error: 'sorry, wrong input',
	    validator: (message, callback) => {
		    if(message.text) {
			    callback(true, message.text) 
			    return
		    }

		    callback(false)
	    }
    }    

}
function competitionMenu($){
	$.runMenu({
	    message: 'Do you want to start the competition?',
	    options: {
	        parse_mode: 'Markdown' // in options field you can pass some additional data, like parse_mode
	    },
	    resizeKeyboard: true,
	    'yes': () => {
	    	$.sendMessage('Game on!\n\n', {reply_markup: JSON.stringify({remove_keyboard: true})});
	    	competitionForm($);
	    },
	    'no': () => {
	    	$.sendMessage('Sure. May be later.', {reply_markup: JSON.stringify({remove_keyboard: true})})
	    }
	})
}

function competitionForm($){
	$.runForm(form, result => {

		let picuturePromises = result.pictures.reduce((initial, current) => {
			return initial.concat(Api.getFile(current.fileId));
		},[]);

		Promise.all(picuturePromises).then(imageFiles => {

			let qualityImage = imageFiles.reduce((initial, current) => {
				if(!initial) return current;
				else if(initial.fileSize > current.fileSize) return initial;
				else return current;
			}, {});

				$.sendMessage('Congradulations!\n\nWe have received your information.').then(() => {
					
					adminIds.forEach((adminId) => {
						Api.sendMessage(adminId, "*** New Competitor ***").then(() => {
						Api.sendMessage(adminId, 'Name: ' + result.competitor + '\n')}).then(() => {
						Api.sendMessage(adminId, 'Place: ' + result.place + '\n')}).then(() => {
						Api.sendMessage(adminId, 'Business Name: ' + result.business_name + '\n')}).then(() => {
						Api.sendPhoto(adminId, qualityImage.fileId)}).then(() => {
						Api.sendMessage(adminId, "*** End ***")});
					})
				});
						
		}).catch(error => {
			console.log(error);
		})
	});
}

module.exports = new CompetitionController();