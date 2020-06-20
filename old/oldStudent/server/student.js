global.config       = require('./config')
global.sayMe        = require('./functions/sayMe')
global.startLog     = require('./functions/log').startLog
global.endLog       = require('./functions/log').endLog
global.writeAction  = require('./functions/databaseLog')
global.generateId   = require('./functions/generateId')

let express           = require('express'),
	bodyParser 	      = require('body-parser'),
	cookieParser      = require('cookie-parser'),
	busboyBodyParser  = require('busboy-body-parser'),
	cron              = require('node-cron')

let app = express()

// functions
	let amocron           = require('./cron/amocron')
	let callcron          = require('./cron/callcron')
	let alertcron		  = require('./cron/alertcron')

	let passwordControl   = require('./middleware/passwordControl')
	let acceptControl     = require('./middleware/acceptControl')
	let amocrmMiddleware  = require('./middleware/amocrmMiddleware')

	let gets              = require('./routes/gets')
	let amo               = require('./routes/amocrm')
	let mGets             = require('./routes/mGets')
	let account           = require('./routes/account')
	let data              = require('./routes/data')
	let student           = require('./routes/student')
	let chart             = require('./routes/chart')
	let group             = require('./routes/group')
	let course            = require('./routes/course')
	let request           = require('./routes/request')
	let uploadPicture     = require('./routes/uploadPicture')
	let sendFile          = require('./routes/sendFile')
	let chat              = require('./routes/chat')
	let notice            = require('./routes/notice')
	let test              = require('./routes/test')
	let homework          = require('./routes/homework')
	let feedback          = require('./routes/feedback')
// middleware
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(busboyBodyParser());
	app.use('/', express.static('../web/public'));
	app.use('/mobile', express.static('../mobile/public'));
	app.use('/common', express.static('./../../files'));

	app.set('view engine', 'ejs');
	app.use(function(req, res, next) {
		res.header('Cache-Control', 'no-cache');
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
		next();
	});

	app.use(amo)
	app.use(passwordControl);
	app.use(gets);

// routes
	app.post('/account', account);

	app.use(acceptControl);
	app.use(amocrmMiddleware)
	app.post('/data', data);
	app.post('/student', student);
	app.post('/chart', chart);
	app.post('/group', group);
	app.post('/course', course);
	app.post('/request', request);
	app.post('/test', test);
	app.post('/uploadPicture', uploadPicture);
	app.post('/sendFile', sendFile);
	app.post('/chat', chat);
	app.post('/notice', notice);
	app.post('/homework', homework);
	app.post('/feedback', feedback);

	app.get('*', (req, res, next) => 
	{ 
	if(req.cookies.MMM) next();
	else
		if (req.body.myId && req.cookies.SAI)    res.render('./../../web/views/index', {version: config.version}); 
		else                  res.render('./../../web/views/account/sign', {version: config.version});
	});
	
	app.use(mGets);

app.listen(config.port, () => { 
	console.log('******************************************')
	console.log('Student на порту: ' + config.port)
	console.log('Версия приложения: ' + config.version)
	console.log('База данных: ' + config.server.database)
	console.log('Имя хоста: ' + config.hostname)
	console.log('******************************************')
});
if(config.production) sayMe('Уведомление', `Сервер студента запущен на порту ${config.port}!`)


/* Звонилка в определенное время */
cron.schedule('*/2 10,11,12,13,14,15,16,17,18,19,20,21 * * *', async function() {
		try {
			await callcron()
		} catch(ex) {
			console.log('callcron: ', ex)
			sayMe('callcron', ex.message)
		}
	})

/* Этапы */
cron.schedule('0,30 * * * *', async function(){
		try {
			await amocron()
		} catch(ex) {
			console.log('amocron: ', ex)
			sayMe('amocron', ex.message)
		}
})

/* Опоздания */
cron.schedule('2,32 * * * *', async function(){
		try {
			await alertcron()
		} catch(ex) {
			console.log('alertcron: ', ex)
			sayMe('alertcron', ex.message)
		}
})