global.config = require('../smartchatConfig')
global.sayMe = require('../apiFunctions/sayMe')
global.writeAction = require('../apiFunctions/writeAction')

// modules
	let express				= require('express'),
		bodyParser 			= require('body-parser'),
		cookieParser 		= require('cookie-parser'),
		busboybodyparser 	= require('busboy-body-parser')

let app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use(busboybodyparser())

let getTest 	= require('./controllers/getTest'),
	sendFile 	= require('./controllers/sendFile'),
	sendData 	= require('./controllers/sendData'),
	checkPhone 	= require('./controllers/checkPhone'),
	checkEmail	= require('./controllers/checkEmail'),
	authorize 	= require('./controllers/authorize'),
	checkCookie	= require('./controllers/checkCookie'),
	list		= require('./controllers/list'),
	dos			= require('./controllers/dos'),
	check 		= require('./controllers/check')

//// Magic

app.set('view engine', 'ejs')
app.use('/common', express.static('../files'))
app.use('/public', express.static('./public'))

app.post('/getTest', 	getTest)
app.post('/sendFile', 	sendFile)
app.post('/sendData', 	sendData)
app.post('/checkPhone', checkPhone)
app.post('/checkCookie',checkCookie)
app.post('/checkEmail', checkEmail)
app.post('/authorize', 	authorize)
app.post('/list', 		list)
app.post('/check', 		check)

app.get('/dos', dos)
app.get('/welcome', (req,res) => { res.render('welcome', {}) })
app.get('*', (req,res) => { res.render('index', {}) })

// Magic end

app.listen(config.jobPort, () => { console.log('Сервер запущен на порту: ', config.jobPort) })