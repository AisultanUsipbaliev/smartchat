// global
global.config       = require('../smartchatConfig')
global.sayMe        = require('./functions/sayMe')
global.writeAction  = require('./functions/databaseLog')

let path = require('./path')
// functions
let cors 				= require('./middleware/cors')
let acceptControl   	= require('./middleware/acceptControl')
let passwordControl 	= require('./middleware/passwordControl')
let amocrmMiddleware	= require('./middleware/amocrmMiddleware')

let gets	= require('./routes/gets')
let amocrm 	= require('./routes/amocrm')
let api		= require('./routes/api')
let account = require('./routes/account')

// modules
	let express				= require('express'),
		bodyParser 			= require('body-parser'),
		cookieParser 		= require('cookie-parser'),
		busboyBodyParser 	= require('busboy-body-parser'),
		pathModule 			= require('path'),
		cron 				= require('node-cron')

let app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:false}))
app.use(busboyBodyParser())


app.set('view engine', 'ejs')
app.use('/account', express.static(path.static))
app.use('/static', express.static('../clientStudent/dist/static'))
app.use('/common', express.static('../files'))
app.use('/src', express.static('../service/src'))

app.use(cors)


// LOGIC MAGIC
app.use(amocrm)
app.use(passwordControl)


app.use(gets)
app.post('/account', account)
app.use(acceptControl)
app.use(amocrmMiddleware)
app.post('/api', api)

app.get('*', (req, res) => { res.sendFile( 'index.html', { root: pathModule.join(__dirname, path.vue) } ) })

app.listen(config.studentPort, () => { console.log(`******************************************\nStudent на порту: ${config.studentPort}\nВерсия приложения: ${config.version}\nБаза данных: ${config.database.database}\nИмя хоста: ${config.hostname}\n******************************************`);sayMe('Уведомление', {},`Сервер студента запущен на порту ${config.studentPort}!`); })

//LOGIC MAGIC