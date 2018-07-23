let config = require('./config');
let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let cron = require('node-cron');
let busboyBodyParser = require('busboy-body-parser');

let app = express();
let http = require('http').Server(app);

//APP>USE
	app.use(busboyBodyParser());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:false}));
	app.use('/static', express.static('../static'));
	app.set('view engine', 'ejs');
	app.use(cookieParser()); 
	app.use(function(req, res, next) 
	{
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
		next();
	});
	

//REQUIRES
	let account 		= require('./routes/account');
	let teacher 		= require('./routes/teacher');
	let graph 			= require('./routes/graph');
	let schedule 		= require('./routes/schedule');
	let requests	 	= require('./routes/req');
	let group 			= require('./routes/group');
	let student 		= require('./routes/student');
	let chat 			= require('./routes/chat');
	let notice 			= require('./routes/notice');
	let file 			= require('./routes/file');
	let test 			= require('./routes/test');
	let level 			= require('./routes/level');
	let result 			= require('./routes/result');
	let template 		= require('./routes/template');
	let get             = require('./routes/get');

//APP.POST
	app.post('/account', account);
	app.post('/teacher', teacher);
	app.post('/graph', graph);
	app.post('/chart', schedule);
	app.post('/req', requests);
	app.post('/group', group);
	app.post('/student', student);
	app.post('/chat', chat);
	app.post('/notice', notice);
	app.post('/test', test);
	app.post('/level', level);
	app.post('/result', result);
	app.post('/template', template);
	app.post('/file', file);
	app.use('', get);

http.listen(config.port,()=>{console.log('Сервер прослушивает порт: ' + config.port);});