let express 			= require('express'),
	bodyParser 			= require('body-parser'),
	busboyBodyParser 	= require('busboy-body-parser'),
	cookieParser 		= require('cookie-parser')

global.config 		= require('../../smartchatConfig')
global.writeAction 	= require('./modules/databaseLog')
global.startLog 	= require('./modules/log').startLog
global.endLog 		= require('./modules/log').endLog
global.errorLog 	= require('./modules/log').errorLog
global.sayMe 		= require('./modules/sayMe')

let app = express()
app.set('view engine', 'ejs')

// Функции Middleware
	let passwordControl = require('./middleware/passwordControl')
	let dataControl 	= require('./middleware/dataControl')

// Middleware
	app.use(cookieParser())
	app.use(busboyBodyParser())
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({extended:false}))
	app.use('/static', express.static('../static'))
	app.use('/common', express.static('./../../files'))
	
// Функции API
	let posts 			= require('./routes/posts')
	let gets 			= require('./routes/gets')
	let accountGets		= require('./routes/accountGets')

	app.use(passwordControl)
	app.use('/', posts)
	app.use('/', accountGets)
	app.use(dataControl)
	app.use('/', gets)
	
let http = require('http').Server(app)
http.listen(config.teacherPort, () => { 
	console.log('******************************************')
	console.log('Teacher на порту: ' 	+ config.teacherPort)
	console.log('Версия приложения: ' 	+ config.version)
	console.log('База данных: ' 		+ config.database.database)
	console.log('Имя хоста: ' 			+ config.hostname)
	console.log('******************************************')
})