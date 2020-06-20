// global
global.config = require('../smartchatConfig')
global.sayMe = require('../apiFunctions/sayMe')

// modules
let express = require('express'),
	bodyParser = require('body-parser'),
	busboyBodyParser = require('busboy-body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	pathModule = require('path'),
	app = express(),
	http = require('http').Server(app)

// middleware and routes
let cors = require('./middleware/cors'),
	sessionControl = require('./middleware/sessionControl'),
	account = require('./routes/account'),
	api = require('./routes/api')

// logic
let path = require('./path')

app.use(cookieParser())
app.use(busboyBodyParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use('/static', express.static(path.static))
app.use('/common', express.static(path.common))
app.use(session(config.adminSession))
app.use(cors)

app.get('*', (req, res) => { res.sendFile( 'index.html', { root: pathModule.join(__dirname, path.dist) } ) })

app.post('/account', account)
app.use(sessionControl)
app.post('/api', api)
app.post('/check_auth', (req,res) => { res.sendStatus(200) })

http.listen(config.adminPort, () => { 
	console.log('Сервер прослушивает порт: ' + config.adminPort) 
})

// logic