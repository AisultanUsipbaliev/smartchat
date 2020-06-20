// Меняйте значения production на true когда будете заливать на продакшн! 
// Запустите файл admin.js, и войдите в директорию /client, 
// там откройте терминал и запустите команду npm run build

let production = false;

let config = null;

let common = {
	transport: {
		host: "smtp.mail.ru",
		port: 465,
		secure: true, 
		auth: {
			user: "noreply@smartchat.kz",
			pass: "@IBPvp3iJn6w" 
		}
	},
	mobizonApiKey: 'kzd8ac24577077d98e231bc90a5ef9f21c5802d970beff17369f99f4ef2ffd0c6e437a',
	deafultPassword: 'smartchat'
}

if (production) {
	config = Object.assign({
		production: true,
		axios_api_endpoint: '""',
		common_photo_url: '"/common/photo/"',
		common_files_url: '"/common/files/"',
		web_smartchat_url: '"https://web.smartchat.su/"',
		cabinet_smartchat_url: '"https://cabinet.smartchat.su/"',
		server_port: 3297,
		host: 'admin.smartchat.su',
		mysql_server: {
			host: 'localhost',
			user: 'anvar',
			password: 'Anvar2018',
			database: 'smartchat',
			port: 3306
		},
	}, common);
} else {
	config = Object.assign({
		production: false,
		axios_api_endpoint: '"http://185.146.2.146:4949"',
		common_photo_url: '"http://185.146.2.146:4949/common/photo/"',
		common_files_url: '"http://185.146.2.146:4949/common/files/"',
		web_smartchat_url: '"http://185.146.2.146:9797/"',
		cabinet_smartchat_url: '""',
		client_port: 9497,
		server_port: 4949,
		host: '185.146.2.146',
		mysql_server: {
			host: 'localhost',
			user: 'anvar',
			password: 'Anvar2018',
			database: 'smartchat_dev',
			port: 3306
		},
	}, common);
}

module.exports = config;
