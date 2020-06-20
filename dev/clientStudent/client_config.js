// Меняйте значения production на true когда будете заливать на продакшн! 
// Запустите файл admin.js, и войдите в директорию /client, 
// там откройте терминал и запустите команду npm run build

let production = false;
let config = null;

if (production) {
	config = {
		production: true,
		axios_api_endpoint: '"/"',
		photo_url: '"/common/photo/"',
		file_url: '"/common/files/"',
		tutorial_url: '"/tutorial/"',
		audio_url: '"/common/audio/"'
	}
} else {
	config = {
		production: false,
		axios_api_endpoint: '"http://185.146.2.146:9797"',
		photo_url: '"http://185.146.2.146:9797/common/photo/"',
		file_url: '"http://185.146.2.146:9797/common/files/"',
		tutorial_url: '"http://91.215.136.18:9797/tutorial/"',
		audio_url: '"http://185.146.2.146:9797/common/audio/"',
		port: 2020,
		host: '185.146.2.146'
	}
}

module.exports = config;
