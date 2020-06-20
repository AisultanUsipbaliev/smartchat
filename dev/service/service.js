let cron = require('node-cron')
let WebSocket = require('ws')
let cookieParser = require('cookie-parser')({secret: 'secret'})

global.config = require('../smartchatConfig')
global.socket = new WebSocket.Server({ port: config.socketPort })
global.sayMe = require('../apiFunctions/sayMe')
global.writeAction = require('../apiFunctions/writeAction')
global.log = require('./functions/log')

let clientConnect = require('./socket/clientConnect')
let socketRouter = require('./socket/socketRouter')

socket.on('connection', async (ws, req) => {
	cookieParser(req, null, () => { clientConnect(ws, req) })
	ws.on('message', (data)=> { socketRouter(ws, data) })
})

// Функции для cron
	let sendDayliReport 	= require('./cron/dayliReport')
	let beforeStartLesson 	= require('./cron/beforeStartLesson')
	let startLesson 		= require('./cron/startLesson')
	let finishLesson 		= require('./cron/finishLesson')
	let cleanChart 			= require('./cron/cleanChart')
	let cleanGroups 		= require('./cron/cleanGroups')
	let clearFiles 			= require('./cron/clearFiles')
	let amocron				= require('./cron/amocron')
	let alertcron 			= require('./cron/alertcron')

	let mailCron 	= require('./cron/mailCron')
	let pushCron 	= require('./cron/pushCron')

if(config.production) {

	//MAIL-CRON
	cron.schedule('15,45 * * * *', async function() {
		try {
			await log('')
			await log('MAIL-CRON STARTED')
			await mailCron()
			await log('MAIL-CRON is completed');
			await log('')
		} catch (ex) {
			console.log('MAIL-CRON: ', ex)
			await sayMe('MAIL-CRON', {}, ex.message)
			await log('ERROR: ' + ex.message, {}, 1 )
		}
	})

	//PUSH-CRON
	cron.schedule('20,50 * * * *', async function() {
		try {
			await log('')
			await log('PUSH-CRON STARTED')
			await pushCron()
			await log('PUSH-CRON is completed')
			await log('')

		} catch (ex) {
			console.log('PUSH-CRON: ', ex)
			await sayMe('PUSH-CRON', {}, ex.message)
			await log('ERROR: ' + ex.message, {}, 1 )
		}
	})

	
	//MAIN-CRON
	cron.schedule('0,30 * * * *', async function() {
		try {
			await log('')
			await log('MAIN-CRON STARTED')

			await startLesson()
			await finishLesson()
	
			await cleanChart()
			await cleanGroups()
			// await clearFiles()
			
			await amocron()
			
			await log('MAIN-CRON is completed')
			await log('')
			
		} catch (ex) {
			console.log('MAIN-CRON: ', ex)
			await sayMe('MAIN-CRON', {}, ex.message)
			await log('ERROR: ' + ex.message, {}, 1 )
		}
		
		if((new Date()).getMinutes() == 0 && (new Date()).getHours() == 0) 
			await sendDayliReport()
	})

	//ALERT-CRON
	cron.schedule('5,35 * * * *', async function(){
		try {	
			await log('')
			await log('ALERT-CRON STARTED')
			await alertcron()
			await log('ALERT-CRON is completed')
			await log('')
		} catch(ex) {
			console.log('ALERT-CRON: ', ex)
			await sayMe('ALERT-CRON', {}, ex.message)
			await log('ERROR: ' + ex.message, {}, 1 )
		}
	})
}

// let studentModel 		= require('./models/student')
// let createSertificat 	= require('./functions/createSertificat')
// async function o() {
// 	let student = await studentModel.getStudent(72)
// 	createSertificat(student)
// }

// o()
console.log('service is runned')