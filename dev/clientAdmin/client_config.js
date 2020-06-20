let production = false;

module.exports = {
	production: 			production,
	axios_api_endpoint: 	production ? '""' 								: '"http://185.146.2.146:4948"',
	common_photo_url: 		production ? '"/common/photo/"' 				: '"http://185.146.2.146:4948/common/photo/"',
	common_files_url: 		production ? '"/common/files/"' 				: '"http://185.146.2.146:4948/common/files/"',
	web_smartchat_url: 		production ? '"https://web.smartchat.kz/"' 		: '"http://185.146.2.146:2020/"',
	cabinet_smartchat_url: 	production ? '"https://cabinet.smartchat.kz/"' 	: '"http://185.146.2.146:3333/"',
	host: 					production ? 'admin.smartchat.kz' 				: '185.146.2.146',
	client_port: 			9494,
}
		
