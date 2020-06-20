// Меняйте значения production на true когда будете заливать на продакшн! 
// Запустите файл admin.js, и войдите в директорию /client, 
// там откройте терминал и запустите команду npm run build

let production = false;
let config = null;

if (production) {
	config = {
		production: false,
		axios_api_endpoint: '"/"',
		photo_url: '"/common/photo/"',
		file_url: '"/common/files/"'
	}
} else {
	config = {
		production: false,
		axios_api_endpoint: '"http://185.146.2.146:3131"',
		photo_url: '"http://185.146.2.146:3131/common/photo/"',
		file_url: '"http://185.146.2.146:3131/common/files/"',
		port: 3333,
		host: '185.146.2.146'
	}
}

module.exports = config;
