let reloadUsers 	= require('./reloadUsers'),
	sendMessage 	= require('./sendMessage'),
	hasRead 		= require('./hasRead'),
	iAmWriting 		= require('./iAmWriting'),
	newReq			= require('./newReq'),
	quizCompleted	= require('./quizCompleted'),
	testCompleted	= require('./testCompleted'),
	quizChecked		= require('./quizChecked')

module.exports = async function(ws, data) {
	data = JSON.parse(data);
	try {
		if(!ws.userid) ws.terminate()
		console.log('recieved from '+ ws.userid +': ', data)
		
		let notice = data.notice
		if(!notice) throw new Error('no notice')

		switch(notice) {

			case 1: 	sendMessage(ws.userid, data); 	break;
			case 2: 	newReq(ws.userid, data); 		break;
			case 3: 	quizCompleted(ws.userid, data); break;
			case 4: 	testCompleted(ws.userid, data); break;
			case 5: 	quizChecked(ws.userid, data);	break;
			case 8: 	hasRead(ws.userid, data);		break;
			case 11: 	iAmWriting(ws.userid, data);	break;
			case 111: 	reloadUsers(); 					break;
			default: 	sayMe('invalid socket notice', data, 'Eror')
		}
	} catch(err) {
		sayMe('socket', data, err.message)
	}
}