global.config       = require('../smartchatConfig')
global.sayMe        = require('../apiFunctions/sayMe')
global.writeAction  = require('../apiFunctions/writeAction')

let express				= require('express'),
	bodyParser 			= require('body-parser'),
	cookieParser 		= require('cookie-parser'),
	busboyBodyParser 	= require('busboy-body-parser'),
	pathModule 			= require('path')

let path = require('./path')
let app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use(busboyBodyParser())

let cookieControl 	= require('./middleware/cookieControl')
let dataControl 	= require('./middleware/dataControl')
let cors 			= require('./middleware/cors')
let account 		= require('./routes/account')
let api 			= require('./routes/api')
let error			= require('./routes/error')
let gets			= require('./routes/gets')

app.set('view engine', 'ejs')

app.use(cors)

// LOGIC MAGIC
app.use('/static', express.static(path.static))
app.use('/common', express.static(path.files))
app.use('/public', express.static(path.public))

// app.post('/test', async (req, res) => {
// 	res.send(message: 'hello')
// })

app.post('/error', error)
app.use(cookieControl)
app.use(gets)
app.post('/account', account)
app.use(dataControl)
app.post('/api', api)

app.get('*', (req, res) => { res.sendFile( 'index.html', { root: pathModule.join(__dirname, path.vue) } ) })

app.listen( config.teacherPort, () => {
	console.log(`Teacher запущен на порту ${config.teacherPort}`)
	sayMe('Teacher', {}, `Teacher запущен на порту ${config.teacherPort}`)
})

//LOGIC MAGIC