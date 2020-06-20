let login 			= require('./translator/sign')
let registration 	= require('./translator/registration')
let activate 		= require('./translator/activate')
let restore 		= require('./translator/restore')

module.exports = async function(page, lang) {
	let strings
	let translate
	switch(page) {
		case 'login': 				translate = login; 				break;
		case 'registration': 		translate = registration; 		break;
		case 'activate': 			translate = activate; 			break;
		case 'restore': 			translate = restore;			break;
		default: 					return {invalid: 'no such page'}
	}

	switch(lang) {
		case 'en': 	strings = translate.en;		break;
		default: 	strings = translate.ru;		break;
	}

	return strings
}