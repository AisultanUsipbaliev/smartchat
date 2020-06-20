global.config = require('.././config');

const express = require('express');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const http = require('http').Server(app);

app.use(busboyBodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use('/static', express.static('../client/dist/static'));
app.use('/common', express.static('../../files')); 

app.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
  next();
});
  
app.use(session({
	key: 'index',
	secret: 'Mandriva',
	resave: true,
	saveUninitialized: true
}));

let account 		      = require('./routes/account');
let billing           = require('./routes/billing');
let rate           = require('./routes/rate');
let student 		      = require('./routes/student');
let teacher 		      = require('./routes/teacher');
let register          = require('./routes/register');
let system_messages   = require('./routes/system_messages');

app.get('*', (req, res) => { res.sendFile( 'index.html', { root: path.join(__dirname, '../client/dist') } ) });
app.post('/account', account);
if (config.production) { let sessionControl = require('./middleware/sessionControl'); app.use(sessionControl); };
app.post('/billing', billing);
app.post('/rate', rate);
app.post('/student', student);
app.post('/teacher', teacher);
app.post('/register', register);
app.post('/system_messages', system_messages);
app.post('/check_auth', (req, res) => { res.sendStatus(200) });

http.listen(config.server_port, () => { console.log('Сервер прослушивает порт: ' + config.server_port) });

global.startLog = (route, data) => { console.log('---------------------------------------------------------------------------'); console.log(route + '::Data::' , data); }
global.endLog = (route, data) => { console.log(route + '::Answer::' , data); console.log('---------------------------------------------------------------------------'); }
